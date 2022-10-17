import React, { useCallback, useEffect, useState } from "react";
import { Grid, styled } from "@material-ui/core";
import TopCard from "./components/TopCard";
import TopTitle from "../Endpoints/components/TopTitle";
import FormCard from "./components/FormCard";
import BottomNavigation from "../Endpoints/components/BottomNavigation";
import { useHistory, useParams } from "react-router-dom";
import { graphqlStringMap } from "../../api/fetchByTypes";
import { QueryByStringWithClient } from "../../api/apollo";
import { GroupedSoAActivityType } from "./Types";
import { useUpdateSoAActivity } from "../../hooks/useUpdateActivity/use-update-soa-activity";
import CustomErrorBar from "../../components/CustomErrorBar";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { SoASummaryType } from "../IE/PredictedImpact/type/SoASummaryType";
import { useDeleteSoAActivity } from "../../hooks/useUpdateActivity/use-delete-soa-activity";
import { formatUserName, formatTime } from "../../utils/getDataUtil";
import { filterSoaTaxonomyByShowChildren } from "../../utils/SoAUtils";
export interface NewProps {}

const AssociateEndpoints: React.FC<NewProps> = () => {
  const [groupedActivities, setGroupedActivities] = useState<
    GroupedSoAActivityType[]
  >([]);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [endpointAccountFor, setEndpointAccounteFor] = useState("-");
  const params = useParams();
  const { push } = useHistory();

  const { updateSoaActivity } = useUpdateSoAActivity();
  const { deleteSoaActivity } = useDeleteSoAActivity();
  const { scenarioId }: any = params;
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [soaSummary, setSoaSummary] = useState<SoASummaryType>();
  const [savedInfo, setSavedInfo] = useState("");
  const [soaWithVisitsNum, setSoAWithVisitsNum] = useState(0);

  const getScenarioById = (scenarioId: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {
        const soaActivities: GroupedSoAActivityType[] = [];
        const categories: { categoryName: string; categoryId: string }[] = [];
        const scenario = res.data.scenario;
        const time = scenario.soaUpdatedAt;
        const user = scenario.soaUpdatedBy?.name || "";
        const timeString = formatTime(time);
        const authorString = formatUserName(user);
        setSavedInfo(`${timeString} by ${authorString}`);
        const soaActivitiesWithVisits = res.data.scenario?.soaActivities
        .map((soaActivity: any) => {
          if (soaActivity.activity === null && soaActivity.soaTaxonomy) {
            const activity: any = {
              id: soaActivity.soaTaxonomy.id,
              name: soaActivity.soaTaxonomy.name,
              userDefined: "false",
              cost: soaActivity.soaTaxonomy.activityCost,
              activityCategoryId: soaActivity.soaTaxonomy.activityCategoryId,
              activityCategory: soaActivity.soaTaxonomy.activityCategory,
              isChild: false,
              isParent: soaActivity.soaTaxonomy.isParent,
              parentId: null,
              showChildren: soaActivity.soaTaxonomy.showChildren
            };
            if (soaActivity.soaTaxonomy.name.split(".").length > 1) {
              activity.isChild = true;
              const parentName = soaActivity.soaTaxonomy.name.split(".")[0];
              const parents = scenario.soaActivities.filter((soaActivity: any) => soaActivity.soaTaxonomy?.name === parentName);
              if (parents.length > 0) {
                activity.parentId = parents[0].soaTaxonomy.id;
              }
            }
            soaActivity.activity = activity;
          };
          return soaActivity;
        }) 
        .filter((soa: any) => soa.soaVisits.length > 0);
        const displaySoaActivityWithVisits = filterSoaTaxonomyByShowChildren(soaActivitiesWithVisits);
        displaySoaActivityWithVisits.forEach((soaActivity: any) => {
          const category = {
            categoryName: soaActivity.activity.activityCategory?.name || "",
            categoryId: soaActivity.activity.activityCategory?.id|| "",
          };
          const index = categories.findIndex(
            (obj) => obj.categoryId === category.categoryId
          );
          if (index === -1) {
            categories.push(category);
          }
        });
        setSoAWithVisitsNum(displaySoaActivityWithVisits.length);
        const accountedEndpoints: any[] = [];
        categories.forEach((group) => {
          if (group.categoryId !== "" && group.categoryName !== "") {
            const filterActivities = displaySoaActivityWithVisits.filter(
              (activity: any) =>
                activity.activity.activityCategoryId === group.categoryId
            );
            
            const activityArr : {
              id: any;
              activityId: any;
              activityName: string;
              endpointId: string;
              rationale: string;
              cost: string;
              frequency: string;
              soaVisitsCount: any;
            }[] = filterActivities.map((soaActivity: any) => {
                let totalCost = 0;
                if (
                  accountedEndpoints.findIndex(
                    (id: any) => id === soaActivity.endpointId
                  ) === -1 &&
                  soaActivity.endpointId
                ) {
                  accountedEndpoints.push(soaActivity.endpointId);
                }
                let frequency = "0%";
                if (
                  soaActivity.soaVisits.length !== 0 &&
                  scenario?.soaVisits.length !== 0
                ) {
                  const result =
                    (soaActivity.soaVisits.length / scenario.soaVisits.length) *
                    100;
                  frequency = `${result.toFixed()}%`;
                  if (soaActivity.activity?.cost !== null && soaActivity.activity?.cost !== undefined) {
                    totalCost = soaActivity.activity.cost * soaActivity.soaVisits.length;
                  } else if (soaActivity.soaTaxonomy?.activityCost) {
                    totalCost = soaActivity.soaTaxonomy.activityCost * soaActivity.soaVisits.length;
                  }
                }
                const soaVisitsCount = soaActivity.soaVisits.length;
                return {
                  activityId: soaActivity.activityId,
                  id: soaActivity.id,
                  activityName: soaActivity.activity.name.split(".").length > 1 ? soaActivity.activity.name.split(".")[1] : soaActivity.activity.name,
                  endpointId: soaActivity.endpointId,
                  rationale: soaActivity.rationale,
                  cost: soaActivity.activity?.cost || soaActivity.soaTaxonomy?.activityCost || 0,
                  totalCost,
                  frequency,
                  soaVisitsCount,
                };
              }) || [];
            const soaActivity: GroupedSoAActivityType = {
              categoryId: group.categoryId,
              categoryName: group.categoryName,
              activities: activityArr,
            };
            soaActivities.push(soaActivity);
          }
        });
        setGroupedActivities(soaActivities);
        const endpoints = res.data.scenario?.endpoints || [];
        setEndpoints(endpoints);
        const accountedFor = `${accountedEndpoints.length}/${endpoints.length}`;
        setEndpointAccounteFor(accountedFor);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchSoASummaryById = (scenarioId: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchSoASummary, {
      id: scenarioId,
    })
      .then((res: any) => {
        const summary = res.data.soaSummary;
        setSoaSummary(summary);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateSoAActivities = useCallback(
    (activityId: string, endpointId: string, rationale: any, id: any) => {
      setLoading(true);
      updateSoaActivity({
        input: {
          id,
          scenarioId,
          endpointId,
          activityId,
          rationale,
        },
      })
        .then((res: any) => {
          getScenarioById(scenarioId);
          fetchSoASummaryById(scenarioId);
        })
        .catch((error: any) => {
          console.log(error);
          setSysError(error.message || "There was an error, please try again");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenarioId, updateSoaActivity]
  );
  const deleteSoAActivities = useCallback((activityId: string) => {
    setLoading(true);
    deleteSoaActivity({ ids: [activityId] })
      .then((res: any) => {
        getScenarioById(scenarioId);
        fetchSoASummaryById(scenarioId);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, deleteSoaActivity])
  useEffect(() => {
    if (scenarioId) {
      getScenarioById(scenarioId);
      fetchSoASummaryById(scenarioId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  return (
    <Container>
      <CustomLoading open={loading} />
      <CustomErrorBar
        open={Boolean(sysError)}
        content={sysError}
        onClose={() => setSysError("")}
      />
      <TopTitle
        title={"Activity Relationship to Endpoints"}
        subTitle={
          "View your trials associated endpoints, and consider paying special attention to any activities not associated with an endpoint(s)."
        }
        saveInfo={savedInfo}
      />
      <Content>
        <TopCard
          soaSummary={soaSummary}
          soaWithVisitsNum={soaWithVisitsNum}
          endPointsAccountedFor={endpointAccountFor}
        />
        <FormCard
          groupedActivities={groupedActivities}
          endpoints={endpoints}
          totalSoaCost={soaSummary?.totalCost}
          deleteSoAActivities={deleteSoAActivities}
          updateSoAActivities={handleUpdateSoAActivities}
        />
      </Content>
      <BottomNavigation content={"Step 3 of 3 - Associate SoA Endpoints"} nextClick={() => {push(`/IE/draftScenario/${scenarioId}`)}} />
    </Container>
  );
};

const Container = styled(Grid)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "70px",
});
const Content = styled(Grid)({
  marginBottom: "140px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export default AssociateEndpoints;
