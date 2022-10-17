import React, { useCallback, useEffect, useState } from "react";
import { Grid, styled } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SelectCriteriaContainer from "./components/SelectCriteriaContainer";
import CriteriaListContainer from "./components/CriteraListContainer";
import { CriteriaModel } from "../../../@types/Criteria";
import { ScenarioCriteriaModle } from "./type/ScenarioCriteriaModel";
import {
  fetchByGraphqlString,
  graphqlStringMap,
} from "../../../api/fetchByTypes";
import { useUpdateScenarioCriteria } from "../../../hooks/useUpdateScenarioCriteria";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { CriteriaCategoryModel } from "../../../@types/CriteriaCategory";
import { QueryByStringWithClient } from "../../../api/apollo";
import ButtonSubmit from "./components/ButtonSubmit";
import { CustomCriteriaFormModal } from "./components/CustomCriteriaFormModal";
export interface CriteriaProps {
  scenarioId: string;
}

const Criteria: React.FC<CriteriaProps> = ({ scenarioId }) => {
  const { push } = useHistory();
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [alert, setAllert] = useState("");
  const [dataVersion, setDataVersion] = useState("");
  const [criterias, setCriterias] = useState<CriteriaModel[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [customCriterion, setCustomCriterion] = useState<{
    category: {
      id: string;
      name: string;
      type: string;
    }
    criterion?: CriteriaModel;
    newCustomCriterionName?: string;
  }>();

  const [historicalCriteria, setHistoricalCriteria] = useState<any>({
    inclusion: [],
    exclusion: [],
  });
  const [historicalAggregateCriteria, setHistoricalAggregateCriteria] = useState<any>({
    inclusion: [],
    exclusion: []
  })
  const [criteriaCategories, setCriteriaCategories] = useState<
    CriteriaCategoryModel[]
  >([]);
  const [selectedCriterias, setSelectedCriterias] = useState<
    ScenarioCriteriaModle[]
  >([]);

  const {
    addScenarioCriteria,
    deleteSenarioCriteria,
    addCustomScenarioCriteria,
  } = useUpdateScenarioCriteria();
  const getScenarioInfo = () => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {
        const scenarioCriteria = res.data.scenario?.scenarioCriteria || [];
        const dataVersionId = res.data.scenario?.trialWorkspace?.dataVersionId;
        const dataVersionName = res.data.scenario?.trialWorkspace?.dataVersion.name;
        setDataVersion(dataVersionName);
        getCriterias(dataVersionId);

        const arr: any = [];
        scenarioCriteria.forEach((scenarioCriterion: any) => {
          const selectedCriteria: ScenarioCriteriaModle = {
            id: scenarioCriterion.id,
            categoryId: scenarioCriterion.criterion?.criteriaCategoryId || "",
            name: scenarioCriterion.criterion?.name || "",
            scenarioId: scenarioId,
            criterionId: scenarioCriterion.criterionId,
            type: scenarioCriterion.type,
            min: scenarioCriterion.min,
            max: scenarioCriterion.max,
            equal: scenarioCriterion.equal,
            tempModifier: scenarioCriterion.tempModifier,
            unit: scenarioCriterion.unit,
          };
          arr.push(selectedCriteria);
        });
        setSelectedCriterias(arr);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getCriteriaCategories = () => {
    setLoading(true);
    fetchByGraphqlString(graphqlStringMap.fetchCriteriaCategories)
      .then((res: any) => {
        const categories = res.data?.criteriaCategories || [];
        setCriteriaCategories(categories);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getCriterias = (dataVersionId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchAllCriterias, {
      dataVersionId
    })
      .then((res: any) => {
        const criterias = res.data?.criteria || [];
        setCriterias(criterias);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getHistoryCriteria = () => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchHistoricalCriteria, {
      id: scenarioId,
    })
      .then((res: any) => {
        const historicalCriteria = res.data?.historicalCriteria || {
          inclusion: [],
          exclusion: [],
        };
        setHistoricalCriteria(historicalCriteria);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getHistoryAggregateCriteria = () => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchHistoricalAggregateCriteria, {
      id: scenarioId,
    })
    .then((res: any) => {
      const historicalAggregateCriteria = res.data?.historicalCriteria || {
        inclusion: [],
        exclusion: [],
      };
      setHistoricalAggregateCriteria(historicalAggregateCriteria);
    })
    .catch((error: any) => {
      setSysError(error.message || "There was an error, please try again");
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }
  const handleAddCriteria = (criteria: any, type: string) => {
    setLoading(true);
    const selectedCriteria: ScenarioCriteriaModle = {
      scenarioId: scenarioId,
      criterionId: criteria.id,
      type,
      min: Number(criteria.min),
      max: Number(criteria.max),
      equal: Number(criteria.equal),
      tempModifier: criteria.tempModifier,
      unit: criteria.unit,
    };
    setLoading(true);
    handleCloseModal();
    addScenarioCriteria({ input: [selectedCriteria] })
    .then((res: any) => {
        refreshPage();
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleAddCustomCriteria = (criterion: ScenarioCriteriaModle) => {
    setLoading(true);
    handleCloseModal();
    criterion.scenarioId = scenarioId;
    addCustomScenarioCriteria({ input: criterion })
      .then((res: any) => {
        refreshPage();
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRemoveCriteria = (criterionId: string) => {
    setLoading(true);
    deleteSenarioCriteria({ ids: [criterionId] })
      .then((res: any) => {
        refreshPage();
      })
      .catch((error: any) => {
        setSysError(error.message || "Not able to delete criteria");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleAddCriteraFromLeft = (category: { id: string, name: string, type: string}, criterion?: CriteriaModel, newCustomCriterionName?: string) => {
    let criterionTemplate = criterion;
    let includeHisCriteria: any[] = [];
    let excludeHisCriteria: any[] = [];
    historicalCriteria.exclusion.forEach((exclusionObj: any) => {
      excludeHisCriteria = excludeHisCriteria.concat(exclusionObj.criteria);
      
    });
    historicalCriteria.inclusion.forEach((inclusionObj: any) => {
      includeHisCriteria = includeHisCriteria.concat(inclusionObj.criteria);
    });

    let historicalCrit = null

    if (category.type === 'Include') {
      const includeIndex = includeHisCriteria.findIndex((hisCriterion: any) => hisCriterion.id === criterion?.id);
      historicalCrit = includeHisCriteria[includeIndex];
    } else if (category.type === 'Exclude') {
      const excludeIndex = excludeHisCriteria.findIndex((hisCriterion: any) => hisCriterion.id === criterion?.id);
      historicalCrit = excludeHisCriteria[excludeIndex];
    }
    
    criterionTemplate = historicalCrit || criterion;
    setCustomCriterion({ category, criterion: criterionTemplate, newCustomCriterionName });
    setOpenModal(true);
  }
  const handleAddAllHistoricalCriteria = (criteria: CriteriaModel[], type: string) => {
    setLoading(true);
    const addCriteria: ScenarioCriteriaModle[] = criteria.map((criterion: CriteriaModel) => {
      const selectedCriteria: ScenarioCriteriaModle = {
        scenarioId: scenarioId,
        criterionId: criterion.id,
        type,
        min: Number(criterion.min),
        max: Number(criterion.max),
        equal: Number(criterion.equal),
        tempModifier: criterion.tempModifier,
        unit: criterion.unit,
      };
      return selectedCriteria;
    });
    addScenarioCriteria({ input: addCriteria })
      .then((res: any) => {
        refreshPage();
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refreshPage = () => {
    getHistoryCriteria();
    getHistoryAggregateCriteria();
    getCriteriaCategories();
    getScenarioInfo();
  };

  useEffect(() => {
    refreshPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  const filterHistoricalAggregateCirteria = useCallback(
    (aggregateCriteria: any) => {
      //replace historical criteria with aggregation criteria. when data version is 2.0.0 above.
      const inclusion = aggregateCriteria.inclusion.map((category: any) => {
        const criteria = dataVersion === "1.0.0"
          ? category.criteria?.filter((criterion: any) => criterion.freq * 100 >= 50) 
          : category.aggregatedCriteria?.filter((criterion: any) => criterion.criteria.findIndex((criterion: any) => criterion.freq * 100 >= 50) > -1);
        const includeCriteria: any[] = criteria
          .filter(
            (criterion: any) =>
              selectedCriterias.findIndex(
                (selected: ScenarioCriteriaModle) =>
                  selected.criterionId === criterion.id &&
                  selected.type === "Include"
              ) === -1
          )
        return {
          id: category.id,
          name: category.name,
          criteria: includeCriteria,
        };
      });
      const exclusion = aggregateCriteria.exclusion.map((category: any) => {
        const criteria = dataVersion === "1.0.0"
          ? category.criteria?.filter((criterion: any) => criterion.freq * 100 >= 50) 
          : category.aggregatedCriteria?.filter((criterion: any) => criterion.criteria.findIndex((criterion: any) => criterion.freq * 100 >= 50) > -1);
        const exclusionCriteria: any[] = criteria
          .filter(
            (criterion: any) =>
              selectedCriterias.findIndex(
                (selected: ScenarioCriteriaModle) =>
                  selected.criterionId === criterion.id &&
                  selected.type === "Exclude"
              ) === -1
          )
          // .filter((criterion: any) => criterion.freq * 100 >= 50);
        return {
          id: category.id,
          name: category.name,
          criteria: exclusionCriteria,
        };
      });
      return {
        inclusion,
        exclusion,
      };
    },
    [selectedCriterias, dataVersion]
  );
  // const filterCriteria = (
  //   criteria: CriteriaModel[],
  //   historicalCriteria: any
  // ) => {
  //   let result = criteria;
  //   // if (
  //   //   historicalCriteria.inclusion.length !== 0 ||
  //   //   historicalCriteria.exclusion.length !== 0
  //   // ) {
  //   //   result = criteria.filter((criterion: CriteriaModel) => {
  //   //     let inclusionCriteira: any[] = [];
  //   //     let exclusionCriteria: any[] = [];
  //   //     historicalCriteria.inclusion.forEach((category: any) => {
  //   //       inclusionCriteira = inclusionCriteira.concat(category.criteria);
  //   //     });
  //   //     historicalCriteria.exclusion.forEach((category: any) => {
  //   //       exclusionCriteria = exclusionCriteria.concat(category.criteria);
  //   //     });
  //   //     const inclusionIndex = inclusionCriteira
  //   //       .filter((criterion: any) => criterion.freq * 100 >= 50)
  //   //       .findIndex(
  //   //       (inclusionCriterion: any) => inclusionCriterion.id === criterion.id
  //   //     );
  //   //     const exclusionIndex = exclusionCriteria
  //   //     .filter((criterion: any) => criterion.freq * 100 >= 50)
  //   //     .findIndex(
  //   //       (exclusionCriteria: any) => exclusionCriteria.id === criterion.id
  //   //     );
  //   //     return inclusionIndex === -1 && exclusionIndex === -1;
  //   //   });
  //   // }
  //   return result;
  // };
  const filterHistoricalAggregateCriteriaList = dataVersion === "1.0.0" ? filterHistoricalAggregateCirteria(
    historicalCriteria
  ) : filterHistoricalAggregateCirteria(
    historicalAggregateCriteria
  );
  // const filterCriteriaList = filterCriteria(
  //   criterias,
  //   filterHistoricalCriteriaList
  // );
  const handleCloseModal = () => {
    setCustomCriterion(undefined);
    setOpenModal(false);
  }

  return (
    <Container>
      <CustomCriteriaFormModal
        open={openModal}
        handleClose={() => {
          handleCloseModal();
        }}
        category={customCriterion?.category}
        templateCriterion={customCriterion?.criterion}
        newCustomCriterionName={customCriterion?.newCustomCriterionName}
        handleAddCriterion={handleAddCriteria}
        handleAddCustomCriterion={handleAddCustomCriteria}
      />
      <Grid item xs={4} xl={3} lg={3} md={4}>
        <CustomLoading open={loading} />
        <CustomErrorBar
          open={Boolean(sysError)}
          content={sysError}
          onClose={() => {
            setSysError("");
          }}
        />
        <CustomErrorBar
          open={Boolean(alert)}
          content={alert}
          isSuccess
          onClose={() => {
            setAllert("");
          }}
        />
        <SelectCriteriaContainer
          scenarioId={scenarioId}
          criterias={criterias}
          historicalCriteria={historicalCriteria}
          selectedCriterias={selectedCriterias}
          criteriaCategories={criteriaCategories}
          handleAddCriteria={handleAddCriteraFromLeft}
          handleRemoveCriteria={handleRemoveCriteria}
        />
      </Grid>
      <Grid item xs={8} xl={9} lg={9} md={8} style={{ marginBottom: "10rem" }}>
        <CriteriaListContainer
          dataVersion={dataVersion}
          criteriaList={filterHistoricalAggregateCriteriaList}
          addCriteriaToScenario={(criteria, type, dataVersion) => {
            if (dataVersion === "1.0.0") {
              handleAddCriteria(criteria, type);
            } else {
              setCustomCriterion({ 
                category: {
                  id: criteria.criteriaCategoryId,
                  name: criteria.category,
                  type: type,
                },
                criterion: criteria,
              });
              setOpenModal(true);
            }
          }
        }
          addAllHistoricalToScenario={handleAddAllHistoricalCriteria}
        />
      </Grid>
      <ButtonSubmit
        content={"Submit"}
        onClick={() => { push(`/IE/historicalSummary/${scenarioId}`) }}
      />
    </Container>
  );
};

const Container = styled(Grid)({
  minHeight: "100vh",
  display: "flex",
});

export default Criteria;
