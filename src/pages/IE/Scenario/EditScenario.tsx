import React, { useCallback, useState, useEffect, useContext } from "react";
import { Grid, Typography, styled, Button } from "@material-ui/core";
import { Sync, FiberManualRecord as CustomDot } from "@material-ui/icons";
import { useParams } from "react-router";

import AppBreadcrumb from "../../../components/AppBreadcrumb";
import InformationCard, { Mode } from "../components/InformationCard";
import OptionalInfoCard from "../components/OptionInfoCard";
import PercentageCard from "../components/PercentageCard";
import { useHistory } from "react-router-dom";
import { QueryByStringWithClient } from "../../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../../api/fetchByTypes";
import { ScenarioDetail } from "../../../@types/ScenarioDetail";
import { TrailWorkspaceDetail } from "../../../@types/TrailWorkspace";
import { formatTime } from "../../../utils/formatUtil";
import { reject } from "lodash";
import { TrialWorkspaceInputType, useUpdateWorkspace } from "../../../hooks/useCreateWorkspace";
import UsersContext from "../../../provider/UsersContextProvider";
import { useJwtInfo } from "../../../hooks/JwtInfo";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { CriteriaCategoryModel } from "../../../@types/CriteriaCategory";
import { ScenarioCriteriaModle } from "../Criteria/type/ScenarioCriteriaModel";
import { CriteriaModel } from "../../../@types/Criteria";
import { useUpdateScenarioCriteria } from "../../../hooks/useUpdateScenarioCriteria";
import { useDeleteSoAActivity } from "../../../hooks/useUpdateActivity/use-delete-soa-activity";
import { useCreateSoA } from "../../../hooks/useCreateSoA/use-create-soa";
const EditScenario: React.FC = () => {
  const { updateTrial } = useUpdateWorkspace();
  const { push } = useHistory();
  const { 
    id: scenarioId, 
    // type: pageType 
  }: any = useParams();
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const { initialScenarioSoA } = useCreateSoA();


  const [trialWorkspaceId, setTrialWorkspaceId] = useState("");

  const [scenario, setScenario] = useState<ScenarioDetail | undefined | null>(
    null
  );
  const [trialWorkspace, setTrialworkspace] = useState<
    TrailWorkspaceDetail | undefined | null
  >(null);
  const [complexityScore, setComplexityScore] = useState();
  const [criteriaOptions, setCriteriaOptions] = useState<CriteriaCategoryModel[]>([]);
  const contextData = useContext<any>(UsersContext);
  const { jwtInfo } = useJwtInfo();

  const {
    addScenarioCriteria,
    deleteSenarioCriteria,
  } = useUpdateScenarioCriteria();
  const { deleteSoaActivity } = useDeleteSoAActivity();
  const getScenarioById = (scenarioId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {

        const currentScenario = res.data.scenario;

        setTrialWorkspaceId(currentScenario.trialWorkspaceId);

        const current: ScenarioDetail = {
          trialWorkspaceId: currentScenario.trialWorkspaceId,
          id: currentScenario.id,
          name: currentScenario.name,
          description: currentScenario.description,
          createdAt: currentScenario.createdAt,
          scenarioCriteria: currentScenario.scenarioCriteria,
          soaActivities: currentScenario.soaActivities?.filter((soa: any) => soa.soaVisits.length > 0),
        };
        setScenario(current);
        setTrialworkspace(currentScenario.trialWorkspace);
        // setTrialId(currentScenario.trialWorkspaceId);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }
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
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const getUsers = () => {
    const collaborators: any =
      reject(contextData?.users, function (o) {
        return o.username === jwtInfo?.preferred_username;
      }) || [];
    return collaborators;
  }
  const getCriteriaCategories = () => {
    setLoading(true);
    fetchByGraphqlString(graphqlStringMap.fetchCriteriaCategories)
      .then((res: any) => {
        const categories = res.data?.criteriaCategories || [];
        setCriteriaOptions(categories);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleViewScoreDetails = useCallback(() => {
    push(`/IE/criteriaImpact/${scenarioId}`);
  }, [push, scenarioId]);
  const refreshPage = useCallback(() => {
    getScenarioById(scenarioId);
    getIESummary(scenarioId);
    getCriteriaCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  useEffect(() => {
    if (scenarioId) {
      refreshPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  const handleUpdateTrial = (input: TrialWorkspaceInputType) => {
    setLoading(true);
    updateTrial(input)
      .then((res: any) => {
        getScenarioById(scenarioId);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "update trial failed.");
      })
      .finally(() => {
        setLoading(false);
      })
  }
  const handleAddCriteria = (criteria: CriteriaModel, type: string) => {
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
  const handleRemoveSoA = (activityId: string) => {
    setLoading(true);
    deleteSoaActivity({ ids: [activityId] })
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
  return (
    <Container>
      <BreadcrumbContainer>
        <AppBreadcrumb
          links={[
            { href: "/", text: "" },
            { href: `/trial-homepage/${trialWorkspaceId}`, text: "Trial Homepage" },
            { href: `/edit-scenario/${scenarioId}`, text: "Edit Scenario" },
            { text: "Scenario Details", currentPage: true },
          ]}

        />
      </BreadcrumbContainer>
      <CustomLoading open={loading} />
      <CustomErrorBar
        open={Boolean(sysError)}
        content={sysError}
        onClose={() => setSysError("")}
      />
      <Grid container spacing={6}>
        <Left item xs={9}>
          <Title variant="h3">{trialWorkspace?.userTrial.trialTitle}</Title>
          <SaveTime>
            Last Saved {formatTime(trialWorkspace?.userTrial?.updatedAt)} By{" "}
            {trialWorkspace?.users?.map((user: any) => user?.name.split(" -")[0] || "").toString()}
          </SaveTime>
          <Information>
            <InformationCard
              title="General Information"
              showEditUI
              mode={Mode.Small}
              subtitle={
                <>
                  <Sync fontSize="small" style={{ marginRight: "5px" }} />
                  Last Saved {formatTime(trialWorkspace?.userTrial?.updatedAt)} By{" "}
                  {trialWorkspace?.users?.map((user: any) => user?.name.split(" -")[0] || "").toString()}
                </>
              }
              trialWorkspace={trialWorkspace}
              updateTrial={handleUpdateTrial}
              users={getUsers()}
              description=""
            />
          </Information>
          <OptionsContainer>
            <OptionsHeader>
              <OptionTitle>
                <CustomDot
                  style={{
                    color: "#FF6D22",
                    width: "15px",
                    height: "15px",
                    marginRight: "7px",
                  }}
                />
                {scenario?.name}
              </OptionTitle>
            </OptionsHeader>
            <OptionalInfoCard
              title="Inclusion Criteria"
              showEditUI
              scenarioCriteria={scenario?.scenarioCriteria || []}
              criteriaOptions={criteriaOptions}
              handleAddCriteria={handleAddCriteria}
              handleRemoveCriteria={handleRemoveCriteria}
            />
          </OptionsContainer>
          {scenario?.soaActivities && scenario?.soaActivities.filter((soa:any)=>soa.soaVisits?.length > 0 ).length > 0 ? (
            <OptionsContainer>
              <OptionalInfoCard
                title="Schedule of Activities "
                showEditUI
                scenarioSoA={scenario?.soaActivities.filter((soa:any)=>soa.soaVisits?.length > 0 ) || []}
                handleRemoveSoA={handleRemoveSoA}
              />
            </OptionsContainer>
          ) : (
            <AddSoAButton
              variant="outlined"
              onClick={() => {
                setLoading(true);
                initialScenarioSoA({ id: scenario?.id || "" })
                  .then((res: any) => {
                    push(
                      `/SoA/criteriaBuilder/${trialWorkspace?.id}/${scenarioId}`
                    );
                  })
                  .catch((error: any) => {
                    console.log(error);
                    setSysError(error.message || "There was an error, please try again");
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}>
              Add SoA
            </AddSoAButton>
          )}


        </Left>
        <Right item xs={3}>
          <RightRow>
            <PercentageCard
              style={{ minWith: "12.5rem", minHeight: "5.125rem" }}
              percentage={complexityScore ? `${complexityScore}` : "-"}
              name="I/E Complexity"
              tooltips="A score summarizing the overall complexity of your selected I/E criteria based on the category and modifier complexity for each criterion."
            />
          </RightRow>
          <ViewScoreDetailsButton
            variant="outlined"
            onClick={handleViewScoreDetails}
          >
            View Score Details
          </ViewScoreDetailsButton>
        </Right>
      </Grid>
    </Container>
  );
};

const Container = styled(Grid)({
  position: "relative",
  maxWidth: "65rem",
  margin: "auto",
  marginBottom: "10rem",
  padding: "0 1rem",
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
  display: "flex",
  alignItems: "center",
});
const ViewScoreDetailsButton = styled(Button)({
  width: "12.5rem",
  height: "2.25rem",
  borderRadius: "1.563rem",
  borderWidth: "1px !important",
  background: "#F9F9F9",
  lineHeight: "1.188rem",
  fontSize: "1rem",
  color: "#000000",
});
const AddSoAButton = styled(Button)({
  width: "12.5rem",
  height: "2.25rem",
  borderRadius: "1.563rem",
  borderWidth: "1px !important",
  background: "#F9F9F9",
  lineHeight: "1.188rem",
  fontSize: "1rem",
  color: "#000000",
  margin: "2rem 0",
});
const RightRow = styled(Grid)({
  marginTop: "6px",
});

export default EditScenario;
