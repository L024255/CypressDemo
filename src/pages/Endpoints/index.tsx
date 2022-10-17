import React from "react";
import EnterEndpoints from "./Endpoints";
import ExternalEndpoints from "./ExternalEndpoints";
import { useHistory, useParams } from "react-router-dom";
import CustomTabBar from "../../components/CustomTabBar";

interface EndpointsProps { };
const Endpoints: React.FC<EndpointsProps> = () => {
  const { type, workspaceId, scenarioId }: any = useParams();
  const { push, location } = useHistory();
  const activeTab = type === "enter" ? 0 : 1
  const externalEndpointsInd = 'Alzheimer\'s Disease';
  const state:any = location?.state;

  return (
    <>
      <CustomTabBar
        hasBackButton
        isBlackTheme
        tabTitles={state?.unsupportedTrial || state?.trialIndication !== externalEndpointsInd
          ? ["Enter Endpoints"] : ["Enter Endpoints", "External Endpoints"]}
        changeTabValue={(value: number) => {
          if (value === 0) {
            push({
              pathname: `/endpoints/enter/${workspaceId}/${scenarioId}`,
              state: {unsupportedTrial: state?.unsupportedTrial}
            });
          } else {
            push(`/endpoints/external/${workspaceId}/${scenarioId}`)
          }
        }
        }
        tabValue={activeTab}
      />
      {
        activeTab === 0
          ? <EnterEndpoints />
          : <ExternalEndpoints trialWorkspaceId={workspaceId} scenarioId={scenarioId} />
      }
    </>
  )
};

export default Endpoints;
