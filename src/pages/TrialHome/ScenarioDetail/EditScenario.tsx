import React, { useEffect, useState, useCallback } from "react";
import { Grid, Typography, styled, Button, IconButton, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import AppBreadcrumb from "../../../components/AppBreadcrumb";
import InformationCard, { Mode } from "../components/InformationCard";
import OptionCard from "../components/OptionCard";
import PercentageCard from "../components/PercentageCard";
import { TrailWorkspaceDetail } from "../../../@types/TrailWorkspace";
import { ScenarioDetail } from "../../../@types/ScenarioDetail";
import CustomTabBar from "../../../components/CustomTabBar";
import { QueryByStringWithClient } from "../../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../../api/fetchByTypes";
import EditScenarioSkeleton from "../components/EditScenarioPageSkeleton";
// import UsersContext from "../../../provider/UsersContextProvider";
import { formatUserName } from "../../../utils/getDataUtil";
import { formatTime } from "../../../utils/formatUtil";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { useCreateSoA } from "../../../hooks/useCreateSoA/use-create-soa";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import { CheckRounded, ClearRounded, Edit } from "@material-ui/icons";
import { useUpdateScenario } from "../../../hooks/useCreateScenario";
// import CapabilityBadgeList, { SelectedTrialLevelCapability } from "../components/CapabilityBadgeList";
// import { DctCapability } from "../../SoA/type/DctCapability";
interface AttrubutesProps {
  id: string;
  name: string;
}

const EditScenario: React.FC = () => {
  const { push } = useHistory();
  const { scenarioId }: any = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [trialWorkspace, setTrialworkspace] = useState<
    TrailWorkspaceDetail | undefined | null
  >(null);
  const [scenario, setScenario] = useState<ScenarioDetail | undefined | null>(
    null
  );
  const [studyPhases, setStudyPhases] = useState<AttrubutesProps[]>([]);
  const [studyTypes, setStudyTypes] = useState<AttrubutesProps[]>([]);
  const [indications, setIndications] = useState<AttrubutesProps[]>([]);
  const [theraPeuticAreas, setTheraPeuticAreas] = useState<AttrubutesProps[]>(
    []
  );
  const [complexityScore, setComplexityScore] = useState();
  const [molecules, setMolecules] = useState<AttrubutesProps[]>([]);
  // const contextData = useContext(UsersContext);
  const { initialScenarioSoA } = useCreateSoA();
  const { UpdateScenario } = useUpdateScenario();
  const [trialId, setTrialId] = useState("");
  const [editScenarioName, setEditScenarioName] = useState("");
  const [showEditScenarioInput, setShowEditScenarioInput] = useState(false);
  // const [dctCapabilityList, setDctCapabilityList] = useState<DctCapability[]>([]);
  // const [displayCapabilities, setDisplayCapabilities] = useState<SelectedTrialLevelCapability[]>([]);
  const [unsupportedTrial, setUnsupportedTrial] = useState<Boolean>(false)

  const getInfoByScenarioId = (scenarioId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {
        const currentScenario = res.data.scenario;
        const current: ScenarioDetail = {
          trialWorkspaceId: currentScenario.trialWorkspaceId,
          id: currentScenario.id,
          name: currentScenario.name,
          description: currentScenario.description,
          createdAt: currentScenario.createdAt,
          scenarioCriteria: currentScenario.scenarioCriteria,
          // soaActivities: currentScenario.soaActivities?.filter((soa: any) => soa.soaVisits.length > 0),
          soaActivities: currentScenario.soaActivities,
          scenarioUpdatedBy: currentScenario?.scenarioUpdatedBy,
          dctCapabilities: currentScenario.dctCapabilities,
        };
        setScenario(current);
        setTrialworkspace(currentScenario.trialWorkspace);
        setTrialId(currentScenario.trialWorkspaceId);
        setUnsupportedTrial(currentScenario?.trialWorkspace?.userTrial?.unsupported)
      })
      .catch((error: any) => {
        console.log(error);
        handleError("There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getIESummary = (scenarioId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchIESummary, {
      id: scenarioId,
    })
      .then((res: any) => {
        const summary = res.data.ieSummary;
        const complexityScore = summary?.complexityScore.scenario;
        setComplexityScore(complexityScore);
      })
      .catch((error: any) => {
        console.log(error);
        handleError("There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const getDicionaries = () => {
    fetchByGraphqlString(graphqlStringMap.fetchAllDictionaries)
      .then((res: any) => {
        const phases = res.data?.phases || [];
        const studyTypes = res.data?.studyTypes || [];
        const indications = res.data?.indications || [];
        const therapeuticAreasDic = res.data?.therapeuticAreas || [];
        const molecules = res.data?.molecules || [];
        setStudyPhases(phases);
        setStudyTypes(studyTypes);
        setIndications(indications);
        setTheraPeuticAreas(therapeuticAreasDic);
        setMolecules(molecules);
      })
      .catch((error: any) => {
        setError("fetch dictionary error");
        console.log(error);
      });
  };
  // const getDctCapabilities = () => {
  //   fetchByGraphqlString(graphqlStringMap.fetchDctCapabilities)
  //     .then((res: any) => {
  //       const capabilityDictionary: DctCapability[] = res.data?.dctCapabilities || [];
  //       setDctCapabilityList(capabilityDictionary);
  //     })
  //     .catch((error: any) => {
  //       setError("fetch dct capabilities error");
  //     })
  // }
  const handleError = (err: any) => {
    setError(err);
  };
  const handleDeleteError = () => {
    setError("");
  };
  const handleViewScoreDetails = useCallback((unsupportedTrial) => {
    !unsupportedTrial 
    ? push(`/IE/criteriaImpact/${scenarioId}`)
    : push({
      pathname: `/IE/predictImpact/${scenarioId}`,
      state: {unsupportedTrial}
    })

  }, [push, scenarioId]);
  const handleEditScenarioName = (oldName: string) => {
    setShowEditScenarioInput(true);
    setEditScenarioName(oldName);
  }
  // const handleUpdateScenarioCapability = (selectedCapabilities: SelectedTrialLevelCapability[]) => {
  //   setSubmitLoading(true);
  //   UpdateScenario({
  //     input: {
  //       id: scenarioId,
  //       trialWorkspaceId: trialWorkspace?.id || "",
  //       dctCapabilities: selectedCapabilities.map((capability: SelectedTrialLevelCapability) => capability.dctCapabilityId)
  //     }
  //   }).then((res: any) => {
  //     setDisplayCapabilities(selectedCapabilities);
  //   }).catch((error: any) => {
  //     handleError("update scenario capability fialed");
  //     console.log(error);
  //   }).finally(() => { setSubmitLoading(false) });
  // }
  useEffect(() => {
    if (scenarioId) {
      getInfoByScenarioId(scenarioId);
      getIESummary(scenarioId);
      getDicionaries();
      // getDctCapabilities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  // useEffect(() => {
  //   if (scenario && dctCapabilityList && dctCapabilityList.length > 0) { 
  //     const displayCapabilityArray: SelectedTrialLevelCapability[] = [];
  //     scenario.dctCapabilities?.forEach((dctCapabilityId: string) => {
  //       const index = dctCapabilityList.findIndex((dctCapability: DctCapability) => dctCapability.id === dctCapabilityId);
  //       if (index > -1) {
  //         const dctCapability: DctCapability = dctCapabilityList[index];
  //         displayCapabilityArray.push({
  //           dctCapabilityId,
  //           name: dctCapability.name,
  //           color: dctCapability.color,
  //         });
  //       }
  //     });
  //     setDisplayCapabilities(displayCapabilityArray);
  //   }
  // }, [scenario, dctCapabilityList]);
  // const renderDctCapability = () => {
  //     return (
  //       <DctCapabilitiesContainer>
  //         <SectionTitle>Trial-level DCT Capabilities</SectionTitle>
  //         <CapabilityBadgeList
  //           capabilityList={dctCapabilityList || []}
  //           displayCapabilities={displayCapabilities || []}
  //           handleUpdateScenarioCapability={(selectedCapabilities: SelectedTrialLevelCapability[]) => 
  //             handleUpdateScenarioCapability && handleUpdateScenarioCapability(selectedCapabilities)
  //           }
  //         />
  //       </DctCapabilitiesContainer>
  //     );
  // }
  const renderDataPage = () => (
    <>
      <Grid container spacing={6}>
        <Left item xs={9}>
          <Title variant="h3">{trialWorkspace?.userTrial.trialTitle}</Title>
          <SaveTime>
            Last Saved {formatTime(trialWorkspace?.userTrial?.updatedAt)} By{" "}
            {formatUserName(scenario?.scenarioUpdatedBy?.name || "")}
          </SaveTime>
          <Information>
            <InformationCard
              title="General Information"
              readonly
              description={trialWorkspace?.userTrial.trialDescription}
              therapeuticArea={trialWorkspace?.userTrial?.therapeuticArea?.id}
              indication={trialWorkspace?.userTrial.indicationId}
              indications={indications}
              studyPhase={trialWorkspace?.userTrial.phase?.id}
              studyType={trialWorkspace?.userTrial?.studyType?.id}
              trialTitle={trialWorkspace?.userTrial.trialTitle}
              pediatricStudy={
                trialWorkspace?.userTrial.pediatricStudy ? "yes" : "no"
              }
              molecule={trialWorkspace?.userTrial.molecule?.id}
              duration={trialWorkspace?.userTrial.duration}
              trialAlias={trialWorkspace?.userTrial.trialAlias}
              mode={Mode.Small}
              author={formatUserName(trialWorkspace?.trialUpdatedBy?.name || "")}
              indicationOptions={indications.filter(
                (indication: any) => indication.userDefined === false
              ) || []}
              phaseOptions={studyPhases}
              studyTypeOptions={studyTypes}
              therapeuticAreasOptions={theraPeuticAreas}
              moleculeOptions={molecules}
              dataVersion={trialWorkspace?.dataVersion?.name || ""}
            />
          </Information>
          {/* {renderDctCapability()} */}
          <OptionsContainer>
            <OptionsHeader>
              {showEditScenarioInput ? (
                <>
                  <ScenarioNameInput
                    value={editScenarioName}
                    variant="outlined"
                    multiline
                    placeholder="Input new scenario name"
                    onChange={(e: any) => {setEditScenarioName(e.target.value)}}
                  />
                  <IconButton onClick={() => {
                    if (editScenarioName) {
                      setSubmitLoading(true);
                      UpdateScenario({
                        input: {
                          id: scenarioId,
                          trialWorkspaceId: trialWorkspace?.id || "",
                          name: editScenarioName,
                        }
                      }).then((res: any) => {
                        setShowEditScenarioInput(false);
                        setEditScenarioName("");
                        getInfoByScenarioId(scenarioId);
                      }).catch((error: any) => {
                        handleError("change scenario name fialed");
                        console.log(error);
                      }).finally(() => { setSubmitLoading(false) });
                    }
                  }}>
                    <CheckRounded />
                  </IconButton>
                  <IconButton onClick={() => {
                    // setShowExportNote(false);
                    setShowEditScenarioInput(false);
                    setEditScenarioName("");
                  }}>
                    <ClearRounded />
                  </IconButton>
                </>
              ) : (
              <OptionTitle>
                {scenario?.name}
                {scenario && scenario.name && <IconButton onClick={() => handleEditScenarioName(scenario.name)}>
                  <Edit style={{ width: "20px", height: "20px"}} />
                </IconButton>}
              </OptionTitle>
              )}
            </OptionsHeader>
            {
              scenario && (
                <>
                  <OptionCard
                    title="Inclusion/Exclusion Criteria"
                    scenarioCriteria={scenario?.scenarioCriteria}
                    buttonTxt={
                      scenario &&
                        scenario.scenarioCriteria &&
                        scenario.scenarioCriteria.length > 0
                        ? "Edit"
                        : "Add"
                    }
                    handleClickButton={() => {
                      push(`/criteria-builder/${trialId}/${scenarioId}`);
                    }}
                    disabled={unsupportedTrial}
                  />
                  <OptionCard
                    title="Schedule of Activities"
                    buttonTxt={
                      scenario &&
                        scenario.soaActivities &&
                        scenario.soaActivities.length > 0
                        ? "Edit"
                        : "Add"
                    }
                    handleClickButton={() => {
                      if (scenario) {
                        if (
                          scenario.soaActivities &&
                          scenario.soaActivities.length > 0
                        ) {
                          push(
                            `/SoA/criteriaBuilder/${trialWorkspace?.id}/${scenarioId}`
                          );
                        } else {
                          setSubmitLoading(true);
                          initialScenarioSoA({ id: scenario.id })
                            .then((res: any) => {
                              push(
                                `/SoA/criteriaBuilder/${trialWorkspace?.id}/${scenarioId}`
                              );
                            })
                            .catch((error: any) => {
                              console.log(error);
                              setError(error.message);
                            })
                            .finally(() => {
                              setSubmitLoading(false);
                            });
                        }
                      }
                    }}
                    soaActivities={scenario?.soaActivities?.filter((soa: any) => soa.soaVisits?.length > 0)}
                  />
                </>
              )
            }

          </OptionsContainer>
        </Left>
        <Right item xs={3}>
          {!unsupportedTrial && <RightRow>
            <PercentageCard
              style={{ minWith: "12.5rem", minHeight: "5.125rem" }}
              // percentage="-"
              percentage={complexityScore ? `${complexityScore}` : "-"}

              name="I/E Complexity"
              disable
            />
          </RightRow>}
          <ViewScoreDetailsButton
            variant="outlined"
            onClick={() => handleViewScoreDetails(unsupportedTrial)}
          >
            {!unsupportedTrial ? 'View Score Details' : 'View SoA Impact'}
          </ViewScoreDetailsButton>
        </Right>
      </Grid>
    </>
  );
  return (
    <Frame>
      <CustomLoading open={submitLoading} />
      <CustomTabBar
        isBlackTheme
        tabTitles={["Draft", "Preview"]}
        changeTabValue={(value: number) => {
          if (value === 1) {
            push(`/preview-scenario/${scenarioId}`);
          }
        }}
        tabValue={0}
      />
      <Container>
        <CustomErrorBar
          open={Boolean(error)}
          content={error}
          onClose={handleDeleteError}
        />
        <BreadcrumbContainer>
          <AppBreadcrumb
            links={[
              { href: "/", text: "" },
              { href: "/trial-homepage/" + trialId, text: "Trial Homepage" },
              { text: "Edit Scenario", currentPage: true },
            ]}
          />
        </BreadcrumbContainer>
        {loading ? <EditScenarioSkeleton amount={10} /> : renderDataPage()}
      </Container>
    </Frame>
  );
};

const Frame = styled("div")({
  minHeight: "800px",
  width: "100%",
});
const Container = styled(Grid)({
  position: "relative",
  maxWidth: "65rem",
  margin: "auto",
  padding: "0 1rem",
  marginBottom: "10rem",
});
const Left = styled(Grid)({});
const Right = styled(Grid)({});
const Title = styled(Typography)({
  fontSize: "1.5rem",
  color: "#2D2D2D",
  lineHeight: "2rem",
  letterSpacing: "normal",
});
const BreadcrumbContainer = styled(Grid)({
  marginBottom: "2.125rem",
  marginTop: "3.25rem",
});
const SaveTime = styled(Typography)({
  color: "#A59D95",
  fontSize: "0.75rem",
  letterSpacing: 0,
  lineHeight: "1.375rem",
});
const Information = styled(Grid)({
  minHeight: "100px",
  marginTop: "2.438rem",
});
const OptionsContainer = styled("div")({
  marginTop: "2rem",
  borderTop: "1px solid #D5D2CA",
});
const OptionsHeader = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
  paddingTop: "2.75rem",
  paddingBottom: "0.625rem",
  marginBottom: "1.625rem",
});
const OptionTitle = styled(Typography)({
  fontSize: "1.25rem",
  fontWeight: 500,
  lineHeight: "1.625rem",
});
const ViewScoreDetailsButton = styled(Button)({
  width: "12.5rem",
  height: "2.25rem",
  borderRadius: "1.563rem",
  borderWidth: "1px !important",
  borderColor: "#cdcdcd !important",
  backgroundColor: "#FFF",
  lineHeight: "1.188rem",
  fontSize: "1rem",
  color: "#000000",
});
const RightRow = styled(Grid)({
  marginTop: "6px",
});
const ScenarioNameInput = styled(TextField)({
  minWidth: "530px",
  minHeight: "80px",
  borderRadius: "4px",
  border: "1px solid #D5D2CA",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-multiline": {
    background: "transparent",
  },
  "& textarea::placeholder": {
    fontSize: "12px",
    color: "#82786F",
    lineHeight: "16px",
  },
});
// const DctCapabilitiesContainer = styled(Grid)({
//   marginTop: "2.438rem",
//   display: "flex",
//   flexDirection: "column",
// });
// const SectionTitle = styled(Typography)({
//   color: "#2D2D2D",
//   fontWeight: 500,
//   fontSize: "1.25rem",
// });

export default EditScenario;
