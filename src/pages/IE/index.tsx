import React, { useState, useEffect } from "react";
import { Grid, styled } from "@material-ui/core";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import CustomTabBar from "../../components/CustomTabBar";
import HistoricalSummary from "./IEHistorialSummary";
// import IECreteria from "./Criteria";
import EditScenario from "./Scenario/EditScenario";
import PreviewScenario from "./Scenario/PreviewScenario";
import PredictedImpact from "./PredictedImpact";
import { PredictImpactType } from "./PredictedImpact/PredictedImpact";

const IE: React.FC = () => {
  const { type, id }: any = useParams();
  const { push, location } = useHistory();
  const state:any = location?.state
  const [activeTab, setActiveTab] = useState("I/E Criteria Builder");
  const tabTitles = ["I/E Criteria Builder", "I/E Historical Summary"];
  const scheduleActivityTitles = state?.unsupportedTrial ? ["Schedule of Activities"] : ["I/E Criteria", "Schedule of Activities"];;
  const draftPreviewTitles = ["Draft", "Preview"];
  const tabTitleObjArr = [
    // {
    //   title: "I/E Criteria Builder",
    //   type: "criteriaBuilder",
    //   component: <IECreteria scenarioId={id} />,
    // },
    {
      title: "I/E Historical Summary",
      type: "historicalSummary",
      component: <HistoricalSummary scenarioId={id} />,
    },
    {
      title: "I/E Historical Summary",
      type: "editScenario",
      component: <EditScenario />,
    },
  ];
  const scenarioTabObj = [
    {
      title: "Draft",
      type: "draftScenario",
      component: <EditScenario />
    },
    {
      title: "Preview",
      type: "previewScenario",
      component: <PreviewScenario />,
    },
  ];
  const predictImpactTabObj = [
    {
      title: "I/E Criteria",
      type: "criteriaImpact",
      component: <PredictedImpact type={PredictImpactType.IECriteria} />,
    },
    {
      title: "Schedule of Activities",
      type: "predictImpact",
      component: <PredictedImpact type={PredictImpactType.SoA} />,
    },
  ];
  const handleChagneTabValue = (value: number, tabArr: any[]) => {
    const activeTabType = tabArr[value] && tabArr[value].type;
    const unsupportedTrial = state?.unsupportedTrial;

    if(unsupportedTrial) {
      push({
        pathname: `/IE/predictImpact/${id}`,
        state: {unsupportedTrial: state.unsupportedTrial}
      });
    }
    else push(`/IE/${activeTabType}/${id}`);
  };
  const getTabTitleObjByType = (type: string) => {
    if (type === "draftScenario" || type === "previewScenario") {
      return scenarioTabObj;
    }
    if (type === "predictImpact" || type === "criteriaImpact") {
      return predictImpactTabObj;
    }
    return tabTitleObjArr;
  };
  const findComponentByType = (type: string) => {
    let tabArr = getTabTitleObjByType(type);
    const componentObj = tabArr.find((obj) => obj.type === type);
    if (componentObj) {
      return componentObj.component;
    }
    return null;
  };

  useEffect(() => {
    let activeTab =
      type === "criteriaBuilder"
        ? "I/E Criteria Builder"
        : "I/E Historical Summary";
    if (type === "draftScenario") {
      activeTab = "Draft";
    }
    if (type === "previewScenario") {
      activeTab = "Preview";
    }
    if (type === "predictImpact") {
      activeTab = "Schedule of Activities";
    }
    if (type === "criteriaImpact") {
      activeTab = "I/E Criteria";
    }
    setActiveTab(activeTab);
  }, [type]);
  const renderDraftPriviewBar = () => {
    return (
      <CustomTabBar
        hasBackButton
        isBlackTheme={type !== "previewScenario"}
        tabTitles={draftPreviewTitles}
        changeTabValue={(value: number) =>
          handleChagneTabValue(value, scenarioTabObj)
        }
        tabValue={activeTab}
      />
    );
  };
  const renderIETabBar = () => {
    return (
      <CustomTabBar
        hasBackButton
        isBlackTheme
        tabTitles={tabTitles}
        changeTabValue={(value: number) =>
          handleChagneTabValue(value, tabTitleObjArr)
        }
        tabValue={activeTab}
      />
    );
  };
  const renderScheduleOfActivityBar = () => {
    return (
      <CustomTabBar
        hasBackButton
        isBlackTheme
        tabTitles={scheduleActivityTitles}
        changeTabValue={(value: number) =>
          handleChagneTabValue(value, predictImpactTabObj)
        }
        tabValue={activeTab}
      />
    );
  };
  const renderCustomBar = (type: string) => {
    if (type === "draftScenario" || type === "previewScenario") {
      return renderDraftPriviewBar();
    }
    if (type === "predictImpact" || type === "criteriaImpact") {
      return renderScheduleOfActivityBar();
    }
    return renderIETabBar();
  };
  return (
    <PageContainer>
      {renderCustomBar(type)}
      {findComponentByType(type)}
    </PageContainer>
  );
};

const PageContainer = styled(Grid)({});

export default IE;
