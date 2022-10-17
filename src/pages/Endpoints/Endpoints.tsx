import React, { useEffect, useState } from "react";
import { Grid, styled } from "@material-ui/core";
import TopTitle from "./components/TopTitle";
import EndpointsContent from "./components/EndpointsContent";
import { useParams } from "react-router";
import { QueryByStringWithClient } from "../../api/apollo";
import { graphqlStringMap } from "../../api/fetchByTypes";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../components/CustomErrorBar";
import { formatTime, formatUserName } from "../../utils/getDataUtil";
export interface NewProps {}

const Endpoints: React.FC<NewProps> = () => {
  const { workspaceId, scenarioId }: any = useParams();
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [savedInfo, setSavedInfo] = useState("");

  useEffect(() => {
    if (scenarioId) {
      setLoading(true);
      QueryByStringWithClient(graphqlStringMap.fetchScenario, {
        id: scenarioId,
      })
      .then((res: any) => {
        const scenario = res.data.scenario;
        const time = scenario.soaUpdatedAt;
        const user = scenario.soaUpdatedBy?.name || "";
        const timeString = formatTime(time);
        const authorString = formatUserName(user);
        setSavedInfo(`${timeString} by ${authorString}`);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");

      })
      .finally(() => {
        setLoading(false);
      });
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
        title={"Enter Trial Endpoints"}
        subTitle={
          "Enter your trial associated endpoints to move forward with the endpoint analysis. Your entries will be saved for optional use in future scenario exploration."
        }
        saveInfo={savedInfo}
      />
      <EndpointsContent
        scenarioId={scenarioId}
        trialWorkspaceId={workspaceId}
      />
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

export default Endpoints;
