import React, { Suspense, lazy, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { styled, CircularProgress } from "@material-ui/core";
import AuthorizedContext from "../../provider/AuthorizedContextProvider";
import fetchIntercept from "fetch-intercept";
import CriteriaBuilder from "../../pages/IE/Criteria";

const HomePage = lazy(() => import("../../pages/HomePage"));
const NewTrial = lazy(() => import("../../pages/NewTrial"));
const NewTrialDetail = lazy(
  () => import("../../pages/NewTrial/NewTrialDetail")
);
const TrialHomePage = lazy(() => import("../../pages/TrialHome"));
const EditScenario = lazy(() => import("../../pages/TrialHome/ScenarioDetail/EditScenario"));
const PreviewScenario = lazy(() => import("../../pages/TrialHome/ScenarioDetail/PreviewScenario"));
const PrintScenario = lazy(() => import("../../pages/TrialHome/PrintPage"));
const PrintPreviewScenario = lazy(() => import("../../pages/TrialHome/PrintPreviewScenario"));
const PreviewTrialScenarios = lazy(() => import("../../pages/TrialHome/PreviewTrialScenarios"));
const CompareScenario = lazy(
  () => import("../../pages/TrialHome/CompareScenario")
);
const Endpoints = lazy(() => import("../../pages/Endpoints"));
const AssociateEndpoints = lazy(() => import("../../pages/AssociateEndpoints"));
const Dashboard = lazy(() => import("../../pages/Dashboard"));
// const ApiPortal = lazy(() => import("../../pages/ApiPortal"));
const IE = lazy(() => import("../../pages/IE"));
const SoA = lazy(() => import("../../pages/SoA"));
const UnauthorizedError = lazy(() => import("../../UnauthorizedError"));
const DctCapabilitySummary = lazy(() =>import("../../pages/SoA/DCTCapabilitySummary"));


const AppBody: React.FC = () => {
  const { authenticated, setAuthenticated } = useContext(AuthorizedContext);

  fetchIntercept.register({
    request: function (url, config) {
      // console.log("request interceptor");
      // Modify the url or config here
      return [url, config];
    },
    requestError: function (error) {
      return Promise.reject(error);
    },
    response: function (response) {

      if (
        response.status === 403 || response.status === 401
      ) {
        // console.log("error 403");
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }

      // Modify the reponse object
      return response;
    },
    responseError: function (error) {
      return Promise.reject(error);
    },
  });

  return (
    <Suspense
      fallback={
        <Loader>
          <CircularProgress />
        </Loader>
      }
    >
      {
        !authenticated ? (
          <UnauthorizedError />
        ) : (
          <Switch>
            <Route exact strict path="/" component={HomePage} />
            <Route path="/all-trials" component={HomePage} />
            <Route path="/create-new" component={NewTrial} />
            <Route path="/new-trial-detail/:type" component={NewTrialDetail} />
            <Route path="/trial-homepage" component={TrialHomePage} exact />
            <Route path="/trial-homepage/:id" component={TrialHomePage} />
            <Route path="/edit-scenario" component={EditScenario} exact />
            <Route path="/edit-scenario/:scenarioId" component={EditScenario} />
            <Route path="/preview-scenario/:scenarioId" component={PreviewScenario} />
            <Route path="/preview-trial-scenarios/:trialworkspaceId" component={PreviewTrialScenarios} />
            <Route path="/print-scenario/:scenarioId" component={PrintScenario} />
            <Route path="/print-preview-scenario/:scenarioId" component={PrintPreviewScenario} />
            <Route path="/compare-scenario" component={CompareScenario} exact />
            <Route
              path="/compare-scenario/:workspaceId"
              component={CompareScenario}
            />
            <Route path="/criteria-builder/:trialworkspaceId/:scenarioId" component={CriteriaBuilder} />
            <Route path="/ie/:type" component={IE} exact />
            <Route path="/ie/:type/:id" component={IE} />
            <Route path="/ie/:type/:id" component={IE} />
            <Route path="/SoA/:type" component={SoA} exact />
            <Route path="/SoA/:type/:workspaceId/:scenarioId" component={SoA} />
            <Route path="/endpoints/:type/:workspaceId/:scenarioId" component={Endpoints} exact />
            <Route
              path="/endpoints/:workspaceId/:scenarioId"
              component={Endpoints}
            />
            <Route
              path="/associate-endpoints"
              component={AssociateEndpoints}
              exact
            />
            <Route
              path="/associate-endpoints/:workspaceId/:scenarioId"
              component={AssociateEndpoints}
            />
            <Route path="/dashboard" component={Dashboard} />
            {/* <Route path="/api-portal" component={ApiPortal} /> */}
            <Route path="/dct-capability-summary-pdf" component={DctCapabilitySummary} />
          </Switch>
        )
      }
    </Suspense>
  );
};

const Loader = styled("div")({
  position: "absolute",
  zIndex: 99999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  height: "100%",
  width: "100%",
});

export default AppBody;
