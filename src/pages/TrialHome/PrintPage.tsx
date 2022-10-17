import React, { useEffect, useState, useContext } from "react";
import { Grid, Typography, styled, Button } from "@material-ui/core";
// import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import AppBreadcrumb from "../../components/AppBreadcrumb";
import InformationCard, { Mode } from "./components/InformationCard";
import PercentageCard from "./components/PercentageCard";
import { TrailWorkspaceDetail } from "../../@types/TrailWorkspace";
import { ScenarioDetail } from "../../@types/ScenarioDetail";
import { QueryByStringWithClient } from "../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import EditScenarioSkeleton from "./components/EditScenarioPageSkeleton";
import UsersContext from "../../provider/UsersContextProvider";
import { getUserNameFromContextById } from "../../utils/getDataUtil";
import { formatTime } from "../../utils/formatUtil";
import CustomErrorBar from "../../components/CustomErrorBar";
interface AttrubutesProps {
  id: string;
  name: string;
}

const PrintScenario: React.FC = () => {
  // const { push } = useHistory();
  const { scenarioId }: any = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  const [molecules, setMolecules] = useState<AttrubutesProps[]>([]);
  const contextData = useContext(UsersContext);
  // const [trialId, setTrialId] = useState("");

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
          soaActivities: currentScenario.soaActivities?.filter((soa: any) => soa.soaVisits.length > 0),
        };
        setScenario(current);
        setTrialworkspace(currentScenario.trialWorkspace);
        // setTrialId(currentScenario.trialWorkspaceId);
      })
      .catch((error: any) => {
        console.log(error);
        handleError("There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
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
  const handleError = (err: any) => {
    setError(err);
  };
  const handleDeleteError = () => {
    setError("");
  };
  // const handleViewScoreDetails = useCallback(() => {
  //   push(`/IE/criteriaImpact/${scenarioId}`);
  // }, [push, scenarioId]);
  useEffect(() => {
    if (scenarioId) {
      getInfoByScenarioId(scenarioId);
      getDicionaries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  useEffect(() => {
    if (scenario && !loading) {
      window.print();
    }
  }, [scenario, loading])
  const renderDataPage = () => (
    <>
      <Grid container spacing={6}>
        <Left item xs={9}>
          <Title variant="h3">{trialWorkspace?.userTrial.trialTitle}</Title>
          <SaveTime>
            Last Saved {formatTime(trialWorkspace?.userTrial?.updatedAt)} By{" "}
            {getUserNameFromContextById(
              trialWorkspace?.ownerId || "",
              contextData
            )}
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
              trialAlias={trialWorkspace?.userTrial.trialAlias}
              mode={Mode.Small}
              author={getUserNameFromContextById(
                trialWorkspace?.ownerId || "",
                contextData
              )}
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
        </Left>
        <Right item xs={3}>
          <RightRow>
            <PercentageCard
              style={{ minWith: "12.5rem", minHeight: "5.125rem" }}
              percentage="-"
              name="I/E Complexity"
              disable
            />
          </RightRow>
          <ViewScoreDetailsButton variant="outlined" disabled>
            View Score Details
          </ViewScoreDetailsButton>
        </Right>
      </Grid>
    </>
  );
  return (
    <Frame>
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
              { text: "Trial Homepage" },
              { text: "Print Scenario", currentPage: true },
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
// const OptionsContainer = styled("div")({
//   marginTop: "2rem",
//   borderTop: "1px solid #D5D2CA",
// });
// const OptionsHeader = styled(Grid)({
//   display: "flex",
//   justifyContent: "space-between",
//   paddingTop: "2.75rem",
//   paddingBottom: "0.625rem",
//   marginBottom: "1.625rem",
// });
// const OptionTitle = styled(Typography)({
//   fontSize: "1.25rem",
//   fontWeight: 500,
//   lineHeight: "1.625rem",
// });
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

export default PrintScenario;
