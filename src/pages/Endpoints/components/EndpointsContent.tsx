import { Button, Grid, IconButton, styled } from "@material-ui/core";
import React, { FC, useState, useEffect, useCallback } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import ClearIcon from "@material-ui/icons/Clear";
import { EndpointCategoryModel } from "../type/EndpointCategory";
import { SubmitEndpointModel } from "../type/SubmitEndpoint";
import {
  fetchByGraphqlString,
  graphqlStringMap,
} from "../../../api/fetchByTypes";
import BottomNavigation from "../components/BottomNavigation";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { useAssociateEndpoints, useCreateEndpoints } from "../../../hooks/useUpdateEndpoint";

import { QueryByStringWithClient } from "../../../api/apollo";
import { useHistory } from "react-router-dom";

export interface EndpointsContentProps {
  scenarioId: string;
  trialWorkspaceId: string;
}
const EndpointsContent: FC<EndpointsContentProps> = ({
  scenarioId,
  trialWorkspaceId,
}) => {
  const { push } = useHistory();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [sysError, setSysError] = useState("");
  const [endpointsCategories, setEndpointsCategories] = useState<
    EndpointCategoryModel[]
  >([]);
  const getEndpointCategories = () => {
    setLoading(true);
    fetchByGraphqlString(graphqlStringMap.fetchEndpointCategories)
      .then((res: any) => {
        const categories = res.data?.endpointCategories || [];
        getScenarioEndpoints(categories);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getScenarioEndpoints = (endPointCategoryArray: any[]) => {
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {
        const endpoints = res.data.scenario?.endpoints || [];
        const categoryArray = [...endPointCategoryArray];
        endpoints?.forEach(
          (endpoint: {
            id: string;
            name: string;
            endpointCategoryId: string;
            trialWorkspaceId: string;
            scenarioId: string;
            value?: string;
          }) => {
            endpoint.value = endpoint.name;
            if (endpoint.name === "Safety" || endpoint.name === "I/E Evaluation") {
              return;
            }
            const index = categoryArray.findIndex(
              (categroy: EndpointCategoryModel) =>
                categroy.id === endpoint.endpointCategoryId
            );
            if (index > -1) {
              const updateEndpointCategory = categoryArray[index];
              if (updateEndpointCategory.endpoints) {
                if (updateEndpointCategory.endpoints.findIndex((point: any) => point.id === endpoint.id) < 0) {
                  updateEndpointCategory.endpoints?.push(endpoint);
                }
              } else {
                updateEndpointCategory.endpoints = [endpoint];
              }
              categoryArray[index] = updateEndpointCategory;
            }
          }
        );
        setEndpointsCategories(categoryArray);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const { createEndpoints, updateEndpoints, deleteEndpoints } = useCreateEndpoints();
  const { autoAssociateEndpoins } = useAssociateEndpoints();
  const handleAddEndpoint = (categoryId: string) => {
    const categories = [...endpointsCategories];
    const index = categories.findIndex(
      (categroy: EndpointCategoryModel) => categroy.id === categoryId
    );
    if (index > -1) {
      const updateEndpointCategory = categories[index];
      const updateEndpoints = updateEndpointCategory.endpoints
        ? updateEndpointCategory.endpoints
        : [];
      updateEndpoints.push({
        title: `Endpoint ${updateEndpoints.length + 1}`,
        value: "",
      });
      updateEndpointCategory.endpoints = updateEndpoints;
      categories[index] = updateEndpointCategory;
      setEndpointsCategories(categories);
    }
  };
  const handleChangeEndpointValue = (
    endpointTitle: string,
    newValue: string,
    categoryId: string
  ) => {
    const categories = [...endpointsCategories];
    const index = categories.findIndex(
      (categroy: EndpointCategoryModel) => categroy.id === categoryId
    );
    if (index > -1) {
      const updateEndpointCategory = categories[index];
      const updateEndpoints = updateEndpointCategory.endpoints;
      if (updateEndpoints) {
        const updateIndex = updateEndpoints.findIndex(
          (endpoint) => endpoint.title === endpointTitle
        );
        if (updateIndex > -1) {
          const updateEndpoint = updateEndpoints[updateIndex];
          updateEndpoint.value = newValue;
          updateEndpoints[updateIndex] = updateEndpoint;
        }
      }
      updateEndpointCategory.endpoints = updateEndpoints;
      categories[index] = updateEndpointCategory;
      setEndpointsCategories(categories);
    }
  };
  const handleDeleteEndpoint = (categoryId: string, endpointTitle: string, endpointId: string) => {
    if (endpointId) {
      handleRemoveEndpoints([endpointId]);
    } else {
      const categories = [...endpointsCategories];
      const index = categories.findIndex(
        (categroy: EndpointCategoryModel) => categroy.id === categoryId
      );
      if (index > -1) {
        const updateEndpointCategory = categories[index];
        const updateEndpoints = updateEndpointCategory.endpoints;
        if (updateEndpoints) {
          const deleteIndex = updateEndpoints.findIndex(
            (endpoint) => endpoint.title === endpointTitle
          );
          if (deleteIndex > -1) {
            updateEndpoints.splice(deleteIndex, 1);
          }
        }
        updateEndpointCategory.endpoints = updateEndpoints;
        categories[index] = updateEndpointCategory;
        setEndpointsCategories(categories);
      }
    }
  };
  const handleUtilizeTrialworkspaceEndpoint = useCallback(() => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchTrailWorkspace, {
      id: trialWorkspaceId,
    })
      .then((res: any) => {
        const trialWorkspace = res.data.trialWorkspace;
        const endpoints = trialWorkspace?.endpoints || [];
        if (endpoints.length > 0) {
          const submitEndponts: SubmitEndpointModel[] = endpoints.map((endpoint: any) => {
            return {
              id: endpoint.id,
              addToScenarioId: scenarioId,
              endpointCategoryId: endpoint.endpointCategoryId,
              name: endpoint.name
            };
          });
          updateEndpoints({ input: submitEndponts })
            .then((res: any) => {
              getEndpointCategories();
            })
            .catch((error: any) => {
              console.log(error);
              setSysError(error.message || "Utlize endpoints error!");
            })
            .finally(() => {
              setLoading(false);
            })
        }
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, trialWorkspaceId]);
  const handleSubmitEndpoints = (nextAction?: Function) => {
    const addEndpoints: SubmitEndpointModel[] = [];
    const updateEndpointsArr: SubmitEndpointModel[] = [];
    let isValidate = true;
    endpointsCategories.forEach((category: EndpointCategoryModel) => {
      category.endpoints?.forEach((endpoint) => {
        const existEndpoints = category?.endpoints?.filter((endpoint1: any) => endpoint1.value === endpoint.name) || [];
        if (existEndpoints.length > 1) {
          setSysError(`${endpoint.name} already exists !`);
          isValidate = false;
          return false;
        }
        if (endpoint.id) {
          const updateEndpoint: any = {
            id: endpoint.id,
            endpointCategoryId: category.id,
            name: endpoint.value,
          }
          updateEndpointsArr.push(updateEndpoint);
        } else {
          const submitEndpoint: any = {
            scenarioId,
            trialWorkspaceId,
            endpointCategoryId: category.id,
            name: endpoint.value,
          };
          addEndpoints.push(submitEndpoint);
        }
      });
    });
    if (!isValidate) {
      return false;
    }
    setLoading(true);
    if (addEndpoints.length > 0) {
      createEndpoints({ input: addEndpoints })
        .then((res: any) => {
          setAlert("Endpoint was sucessfully created");
          if (nextAction) {
            nextAction();
          }
        })
        .catch((error: any) => {
          setSysError(error.message || "There was an error, please try again");
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    if (updateEndpointsArr.length > 0) {
      updateEndpoints({ input: updateEndpointsArr })
        .then((res: any) => {
          setAlert("Endpoint was sucessfully updated");
          if (nextAction) {
            nextAction();
          }
        })
        .catch((error: any) => {
          setSysError(error.message || "There was an error, please try again");
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setLoading(false);
    nextAction && nextAction()
  };
  /**
   * Delete existing endpoints. 
   * MDITEVER-5708
   * @author: jacob qiao
   * @param ids endpoint id
   */
  const handleRemoveEndpoints = (ids: string[]) => {
    deleteEndpoints(ids).then((res: any) => {
      getEndpointCategories();
    }).catch((error: any) => {
      setSysError(error.message || "There was an error, please try again.");
      console.log(error);
    })
  }
  const sortByNames = (endpointsCategories: EndpointCategoryModel[], sortNames: string[]) => {
    const result: any[] = [];
    sortNames.forEach((name) => {
      const index = endpointsCategories.findIndex((category: EndpointCategoryModel) => category.name === name);
      if (index > -1) {
        result.push(endpointsCategories[index]);
      }
    });
    return result;
  }
  useEffect(() => {
    getEndpointCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ContentContainer>
        <CustomLoading open={loading} />
        <CustomErrorBar
          open={Boolean(sysError)}
          content={sysError}
          onClose={() => setSysError("")}
        />
        <CustomErrorBar
          open={Boolean(alert)}
          content={alert}
          isSuccess
          onClose={() => {
            setAlert("");
          }}
        />
        <ButtonTitle onClick={handleUtilizeTrialworkspaceEndpoint}>Utilize Trial Workspace Endpoints</ButtonTitle>
        {sortByNames(endpointsCategories, ["Primary", "Secondary", "Exploratory"]).map((category: any) => {
          return (
            <>
              <Primary>{category.name}</Primary>
              {category.endpoints?.map((endpoint: any, index: any) => (
                <>
                  <Endpoint>{endpoint.title || `Endpoint ${index + 1}`}</Endpoint>
                  <InputText>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        value={endpoint.value}
                        style={{ width: "872px" }}
                        multiline
                        rows={2}
                        onChange={(e) => {
                          handleChangeEndpointValue(
                            endpoint.title,
                            e.target.value,
                            category.id
                          );
                        }}
                        // inputProps={{
                        //   maxLength: 80
                        // }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  handleDeleteEndpoint(category.id, endpoint.title, endpoint.id)
                                }
                              >
                                <ClearIcon
                                  style={{
                                    color: "#D52B1E",
                                    width: "1.2rem",
                                    marginLeft: "14px",
                                    cursor: "pointer",
                                  }}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                  </InputText>
                </>
              ))}
              <ButtonTitle
                style={{ marginTop: "31px" }}
                onClick={() => handleAddEndpoint(category.id)}
              >
                {category.endpoints && category.endpoints.length > 0
                  ? "Add Additional Endpoint"
                  : "Add Endpoint"}
              </ButtonTitle>
            </>
          )
        })}
        <Submit
          variant="contained"
          color="primary"
          onClick={() => {
            const refreshEndpoint = () => {
              getEndpointCategories();
            }
            handleSubmitEndpoints(refreshEndpoint);
          }}
        >
          Save Endpoints to Trial Workspace
        </Submit>
      </ContentContainer>
      <BottomNavigation
        content={
          "Step 2 of 3 - Enter SoA Trial Endpoints"
        }
        nextClick={() => {
          const nextAction = () => {
            autoAssociateEndpoins({ id: scenarioId }).then((res: any) => {
              push(`/associate-endpoints/${trialWorkspaceId}/${scenarioId}`);
            }).catch((error: any) => {
              setSysError(error.message || "There was an error, please try again.");
              console.log(error);
            });
          }
          handleSubmitEndpoints(nextAction);
        }}
      />
    </>
  );
};

const ContentContainer = styled(Grid)({
  marginTop: "28px",
  background: "#ffffff",
  width: "61.25rem",
});

const ButtonTitle = styled(Button)({
  height: "38px;",
  lineHeight: "38px",
  background: "#F9F9F9;",
  borderRadius: "25px;",
  border: "1px solid #D52B1E;",
  textAlign: "center",
  display: "inline-block",
  marginRight: "25px",
  marginTop: "23px",
  padding: "0 31px;",
});
const Submit = styled(Button)({
  width: "271px;",
  lineHeight: "36px",
  background: "#D52B1E;",
  borderRadius: "25px;",
  border: "1px solid #D52B1E;",
  textAlign: "center",
  display: "block",
  color: "#ffffff",
  margin: "44px auto 140px",
});
const InputText = styled(Grid)({
  "& .MuiInputBase-root": {
    paddingRight: "60px",
  },

  "&> div div .MuiInputAdornment-root": {
    position: "absolute",
    right: "20px",

    "& .MuiIconButton-root": {
      paddingLeft: "0px",
    }
  },
});
const Primary = styled(Grid)({
  fontSize: "1rem",
  fontFamily: "Helvetica",
  color: "#82786F",
  marginTop: "51px",
});
const Endpoint = styled(Grid)({
  fontSize: "10px",
  fontFamily: "Helvetica",
  color: "#82786F",
  marginTop: "24px",
  marginBottom: "12px",
  textTransform: "uppercase",
});

export default EndpointsContent;
