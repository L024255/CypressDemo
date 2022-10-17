import React, { useState, useEffect, useCallback } from "react";
import { Grid, styled } from "@material-ui/core";
import LeftContainer from "./components/LeftContainer";
import RightContent from "./components/RightContent";
import ButtonSubmit from "./../Criteria/components/ButtonSubmit";
import { SoASummaryType } from "./type/SoASummaryType";
import { useHistory, useParams } from "react-router-dom";
import { QueryByStringWithClient } from "../../../api/apollo";
import { graphqlStringMap } from "../../../api/fetchByTypes";
import { IESummaryType } from "./type/IESummaryType";
import { useDeleteSoAActivity } from "../../../hooks/useUpdateActivity/use-delete-soa-activity";
import { useUpdateScenarioCriteria } from "../../../hooks/useUpdateScenarioCriteria";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { ScenarioCriteriaModlePredicted } from "../Criteria/type/ScenarioCriteriaModel"
import { filterSoaTaxonomyByShowChildren, transferResponseToSoaActivityModelArray } from "../../../utils/SoAUtils";
import { SoaActivityModel } from "../../SoA/type/SoaActivity";
export enum PredictImpactType {
  SoA,
  IECriteria,
}
export interface PredictedImpactProps {
  type: PredictImpactType;
}

const PredictedImpact: React.FC<PredictedImpactProps> = ({ type }) => {
  const initialSelectedSoAData: any[] = [];
  const { id: scenarioId }: any = useParams();
  const { push } = useHistory();
  const { deleteSoaActivity } = useDeleteSoAActivity();
  const { deleteSenarioCriteria } = useUpdateScenarioCriteria();
  const [soaSummary, setSoASummary] = useState<SoASummaryType>();
  const [ieSummary, setieSummary] = useState<IESummaryType>();
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [selectedSoAData, setSelectedSoAData] = useState(
    initialSelectedSoAData
  );
  const [workspaceId, setWorkspaceId] = useState("");
  const [
    selectedInclustionCriteriaData,
    setSelectedInclustionCriteriaData,
  ] = useState<any[]>([]);

  const [
    selectedExclusionCriteriaData,
    setSelectedExclusionCeriaData,
  ] = useState<any[]>([]);
  const [topActivities, setTopActivities] = useState<{
    name: string,
    overallCost: any,
    visitCount: any,
  }[]>([]);
  const formatSelectedCriteria = (criteria?: ScenarioCriteriaModlePredicted) => {
    let result = "";
    let quantMod = true;
    if (criteria) {
      if (criteria.min && criteria.max) {
        result = `${criteria.criterion.name} ${criteria.min}-${criteria.max}`;
      } else if (criteria.min) {
        result = `${criteria.criterion.name} ≥ ${criteria.min}`;
      } else if (criteria.max) {
        result = `${criteria.criterion.name} ≤ ${criteria.max}`;
      } else if (criteria.equal) {
        result = `${criteria.criterion.name} = ${criteria.equal}`;
      } else {
        result = `${criteria.criterion.name}`;
        quantMod = false;
      }
      if (criteria.unit) {
        result += ` ${criteria.unit}`;
      }
      if (criteria.tempModifier) {
        if (quantMod) {
          result += ';';
        }
        result += ` ${criteria.tempModifier}`;
      }
    }
    return result;
  };

  const getIESummary = (scenarioId: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchIESummary, {
      id: scenarioId,
    })
      .then((res: any) => {
        const summary = res.data.ieSummary;
        setieSummary(summary);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const getSoASummary = (scenarioId: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchSoASummary, {
      id: scenarioId,
    })
      .then((res: any) => {
        const summary = res.data.soaSummary;
        setSoASummary(summary);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const getTopActivities = (scenarioId: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchTopTenActivitiesOfScenario, {
      id: scenarioId,
    })
    .then((res: any) => {
      const topActivities = res?.data?.topActivities?.activities || [];
      setTopActivities(topActivities);
    })
  }
  const initialActivitiesByScenario = (soaActivities: SoaActivityModel[]) => {
    const selectedSoaActivities: any[] = [];
    const categories: { categoryName: string; categoryId: string }[] = [];
    const soaActivityArray: SoaActivityModel[] = filterSoaTaxonomyByShowChildren(soaActivities);
    soaActivityArray.forEach((soaActivity: any) => {
      const activity = soaActivity.activity ? {
        id: soaActivity.activity.id,
        name: soaActivity.activity?.name,
        activityCategory: soaActivity.activity.activityCategory ? soaActivity.activity.activityCategory : {
          id: soaActivity.activity.activityCategoryId,
          name: soaActivity.soaTaxonomy.category,
        }
      } : {
        id: soaActivity.soaTaxonomyId,
        name: soaActivity.soaTaxonomy?.name,
        activityCategory: {
          id: soaActivity.soaTaxonomy.activityCategoryId,
          name: soaActivity.soaTaxonomy.category,
        }
      }
      const category = {
        categoryName: activity?.activityCategory?.name || "",
        categoryId: activity?.activityCategory?.id || "",
      };
      const index = categories.findIndex(
        (obj) => obj.categoryId === category.categoryId
      );
      if (index === -1) {
        categories.push(category);
      }
    });
    categories.forEach(
      (category: { categoryId: string; categoryName: string }) => {
        const chips =
        soaActivityArray
            ?.filter(
              (soaActivity: any) =>
                soaActivity.activity 
                ? soaActivity.activity.activityCategoryId === category.categoryId 
                : soaActivity.soaTaxonomy?.activityCategoryId === category.categoryId
            )
            .map((soaActivity: any) => {
              let activityName = "";
              if (soaActivity.activity) {
                activityName = soaActivity.activity.name;
              } else if (soaActivity.soaTaxonomy?.name) {
                activityName = soaActivity.soaTaxonomy?.name.split(".").length > 1 ? soaActivity.soaTaxonomy?.name.split(".")[1] : soaActivity.soaTaxonomy?.name
              }
              return {
                soaId: soaActivity.id,
                name: activityName,
              };
            }) || [];
        selectedSoaActivities.push({
          title: category.categoryName,
          chips,
        });
      }
    );
    setSelectedSoAData(selectedSoaActivities);
  };
  const initialIECriteriaByScenario = (criteria: any[]) => {
    const ieExclusionCriteria: any[] = [];
    const ieInclusionCriteria: any[] = [];
    const categories: {
      categoryName: string;
      categoryId: string;
      categoryType: string;
    }[] = [];
    criteria.forEach((criterion: any) => {
      const category = {
        categoryName: criterion.criterion?.criteriaCategory?.name || "",
        categoryId: criterion.criterion?.criteriaCategoryId,
        categoryType: criterion?.type,
      };
      const index = categories.findIndex(
        (obj) => obj.categoryId === category.categoryId && obj.categoryType === category.categoryType
      );
      if (index === -1) {
        categories.push(category);
      }
    });
    categories.forEach(
      (category: {
        categoryId: string;
        categoryName: string;
        categoryType: string;
      }) => {
        const chips = criteria
          .filter(
            (criterion: any) =>
              criterion.criterion?.criteriaCategoryId === category.categoryId &&
              criterion.type === category.categoryType
          )
          .map((criterion: any) => {
            return {
              scenarioCriterionId: criterion.id,
              // name: criterion.criterion?.name
              name: formatSelectedCriteria(criterion)
            };
          });
        if (category.categoryType === "Include") {
          ieInclusionCriteria.push({
            title: category.categoryName,
            type: category.categoryType,
            chips,
          });
        } else if (category.categoryType === "Exclude") {
          ieExclusionCriteria.push({
            title: category.categoryName,
            type: category.categoryType,
            chips,
          });
        }
      }
    );
    setSelectedInclustionCriteriaData(ieInclusionCriteria);
    setSelectedExclusionCeriaData(ieExclusionCriteria);
  };
  const getScenarioById = (scenarioId: string, type: PredictImpactType) => {
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {
        const soaActivities = res.data.scenario?.soaActivities?.filter((soa:any)=>soa.soaVisits?.length > 0 ) || [];
        const scenarioCriteria = res.data.scenario?.scenarioCriteria || [];
        const workspaceId = res.data.scenario?.trialWorkspaceId || "";
        setWorkspaceId(workspaceId);
        if (type === PredictImpactType.SoA) {
          const activityArray: SoaActivityModel[] = transferResponseToSoaActivityModelArray(soaActivities);
          initialActivitiesByScenario(activityArray);
        } else {
          initialIECriteriaByScenario(scenarioCriteria);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const handleCompareScenarios = () => {
    push(`/compare-scenario/${workspaceId}`);
  };
  const handleRemoveSoA = (activityId: string) => {
    setLoading(true);
    deleteSoaActivity({ ids: [activityId]})
      .then((res: any) => {
        refreshPage();
      })
      .catch((error: any) => {
        setSysError(error.message || "Not able to delete soa");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const refreshPage = useCallback(() => {
    if (type === PredictImpactType.SoA) {
      getSoASummary(scenarioId);
      getTopActivities(scenarioId);
    } else {
      getIESummary(scenarioId);
    }
    getScenarioById(scenarioId, type);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
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
  useEffect(() => {
    if (scenarioId) {
      if (type === PredictImpactType.SoA) {
        getSoASummary(scenarioId);
        getTopActivities(scenarioId);
      } else {
        getIESummary(scenarioId);
      }
      getScenarioById(scenarioId, type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, type]);
  return (
    <Container>
      <CustomLoading open={loading} />
      <CustomErrorBar
          open={Boolean(sysError)}
          content={sysError}
          onClose={() => setSysError("")}
        />
      <Grid item xs={4} xl={3} lg={3} md={3}>
        {type === PredictImpactType.SoA ? (
          <LeftContainer title={"Selected SoA"} contentData={selectedSoAData} handleRemoveSoA={handleRemoveSoA} />
        ) : (
          <>
            <LeftContainer
              title={"Selected Inclusion Criteria"}
              contentData={selectedInclustionCriteriaData}
              handleRemoveCriterion={handleRemoveCriteria}
            />
            <LeftContainer
              title={"Selected Exclusion Criteria"}
              contentData={selectedExclusionCriteriaData}
              handleRemoveCriterion={handleRemoveCriteria}
            />
          </>
        )}
      </Grid>
      <Grid item xs={8} xl={9} lg={9} md={9}>
        <RightContent
          pageType={type}
          soASummary={soaSummary}
          ieSummary={ieSummary}
          topActivities={topActivities}
        />
      </Grid>
      <ButtonSubmit
        content={"Compare Scenarios"}
        onClick={handleCompareScenarios}
      />
    </Container>
  );
};

const Container = styled(Grid)({
  minHeight: "100vh",
  display: "flex",
});

export default PredictedImpact;
