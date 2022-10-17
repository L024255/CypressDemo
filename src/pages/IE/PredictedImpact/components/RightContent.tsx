import { Grid, styled } from "@material-ui/core";
import React, { FC, useCallback, useEffect, useState } from "react";
import ScenarioCard from "./ScenarioCard";
import FairCard from "./FairCard";
import { FiberManualRecord } from "@material-ui/icons";
import { PredictImpactType } from "../PredictedImpact";
import { SoASummaryType } from "../type/SoASummaryType";
import { IESummaryType } from "../type/IESummaryType";
import { getRankByScore } from "../../../../utils/getDataUtil";
import { formatNumber } from "../../../../utils/formatUtil";
import TopActivitiesCard from "./TopActivitiesCard";
export interface RightContainerProps {
  pageType: PredictImpactType;
  soASummary?: SoASummaryType;
  ieSummary?: IESummaryType;
  topActivities: { name: string, overallCost: any, visitCount:any }[];
}
interface CompareDataType {
  description: any;
  scenarioTitle: any;
  scenarioTooltips: any;
  scenarioContentTitle: any;
  scenarioContentBody: any;
  scenarioOptionName: any;
  scenarioOptionValue: any;
  historicalScenarioOptionValue: any;
  scenarioOptionDescription: any;
  fairs: any[];
}

const RightContainer: FC<RightContainerProps> = ({
  pageType,
  soASummary,
  ieSummary,
  topActivities,
}) => {
  // -----------------IE criteria initial data---------------
  const ieDescription = `Review the impact analysis of your protocol feature design
  scenario. For additional detail on your composite score or the impact
  associated with individual criteria, click into the associated impact
  metrics cards.`;
  const ieContentTitle = "Your I/E Complexity Score is N/A";
  const ieContentBody =
    "Your score is calculated based on your selection of I/E criteria. The score rating (fair/good/poor) indicates how the complexity of your selected I/E criteria compare to the complexity of I/E criteria from past Lilly similar historical trials.";
  const ieScenarioTitle = "Scenario Score";
  const ieScenarioOptionName = "N/A";
  const ieScenarioOptionValue = 0;
  const ieHistoricalScenarioOptionValue = 0;
  const ieScenarioOpitonDescription = "There is not enough historical data for a comparison";
  const ieScenarioTooltips = "";
  const ieFairs: any[] = [];
  // ------------------SoA initial data-------------------------
  const soaDescription = `Review the predicted impact analysis of your protocol feature design scenario. For additional detail on your composite score or the impact associated with individual criteria, click into the associated impact metrics cards.`;
  const soaContentTitle = (
    <>
      Your overall cost per patient is <b>-</b>
    </>
  );
  const soaContentBody = `Your score is calculated using predictive models driven by
  historical data. Right now, your score of 'Fair' demonstrates
  disproportionate influence exerted by your Screening Failure and
  Patient Burden predicted metrics. Consider revising or analyzing
  these selections accordingly to change your composite score.`;
  const soaScenarioTitle = "Overall SoA Cost per patient";
  const soaScenarioOptionName = "N/A";
  const soaScenarioOptionValue = 0;
  const soaHistoricalScenarioOptionValue = 0;
  const soaScenarioOpitonDescription = "There is not enough historical data for a comparison";

  const soaScenarioTooltips = `The overall cost of your selected activities and visit schedule per patient, based on 2020 Lilly Fair Market Value data.`;
  const soaFairs = [
    {
      title: "Activities Linked to Endpoints:",
      sliderValue: 0,
      sliderDisplayValue: "-/-",
      tooltips:
        "Displays the number of activities you have selected which are not linked to endpoints, and gives you an opportunity to review any and all justifications you have provided for each activity.",
      contentTitle: "",
      contents: `- of your trial's - activities have not been linked to endpoints or otherwise justified. Consider assessing any noncritical activities to reduce patient burden and cost.`,
    },
  ];
  
  const initialSoAData = {
    description: soaDescription,
    scenarioTitle: soaScenarioTitle,
    scenarioTooltips: soaScenarioTooltips,
    scenarioContentTitle: soaContentTitle,
    scenarioContentBody: soaContentBody,
    scenarioOptionName: soaScenarioOptionName,
    scenarioOptionValue: soaScenarioOptionValue,
    historicalScenarioOptionValue: soaHistoricalScenarioOptionValue,
    scenarioOptionDescription: soaScenarioOpitonDescription,
    fairs: soaFairs,
  };
  const initialIEData = {
    description: ieDescription,
    scenarioTitle: ieScenarioTitle,
    scenarioTooltips: ieScenarioTooltips,
    scenarioContentTitle: ieContentTitle,
    scenarioContentBody: ieContentBody,
    scenarioOptionName: ieScenarioOptionName,
    scenarioOptionValue: ieScenarioOptionValue,
    historicalScenarioOptionValue: ieHistoricalScenarioOptionValue,
    scenarioOptionDescription: ieScenarioOpitonDescription,
    fairs: ieFairs,
  };
  const [soAData, setSoAData] = useState<CompareDataType>(initialSoAData);
  const [ieData, setIEData] = useState<CompareDataType>(initialIEData);
  const changeSoADataBySoASummary = (soASummary: SoASummaryType) => {
    const data = { ...soAData };
    let totalCost = `$${formatNumber(soASummary.totalCost)}`;
    const fairTableData =
    soASummary.activities.map((soaActivity) => {
        let activityName = "";
        if (soaActivity.activity ) {
          activityName = soaActivity.activity.name;
        } else if (soaActivity.soaTaxonomy) {
          activityName = soaActivity.soaTaxonomy.name.split(".").length > 1 ? soaActivity.soaTaxonomy.name.split(".")[1] : soaActivity.soaTaxonomy.name;
        }
        return [activityName, soaActivity.rationale || ""];
      }) || [];
    data.scenarioOptionName = getRankByScore(
      soASummary.totalCost,
      soASummary.tertiles || [],
      ["Good", "Fair", "Poor"]
    );
    data.scenarioContentBody = <>Your cost per patient is the sum of the cost of the activities you have entered multiplied by their frequency over the course of the trial. Your score is calculated relative to historical direct patient cost budgets from your similar trial list. Your score of <b style={{ textTransform: "uppercase" }}>{data.scenarioOptionName}</b> demonstrates <b>{data.scenarioOptionName}</b> performance relative to this list. If you believe your cost is too high, consider reducing the frequency or removing activities not linked to an endpoint.</>;
    if (soASummary?.tertiles && soASummary?.tertiles[1]) {
      if (soASummary?.tertiles[2]) {
        data.historicalScenarioOptionValue = soASummary.historicalTotalCost / soASummary?.tertiles[2] * 100
        data.scenarioOptionValue = soASummary.totalCost / soASummary.tertiles[2] * 100
      } else {
        data.historicalScenarioOptionValue = soASummary.historicalTotalCost / (soASummary.tertiles[1] * 3 / 2) * 100;
        data.scenarioOptionValue = soASummary.totalCost / (soASummary.tertiles[1] * 3 / 2) * 100;
      }
    }
    data.scenarioContentTitle = (
      <>
        Your overall cost per patient is <b>{totalCost}</b>
      </>
    );
    const histricalAverage = formatNumber(soASummary.historicalTotalCost)
    data.scenarioOptionDescription = histricalAverage ? `HISTORICAL AVERAGE: $${histricalAverage}` : 'HISTORICAL AVERAGE: N/A';
    const fair: any = { ...data.fairs[0] };
    fair.sliderDisplayValue = `${soASummary.mappedActivities}/${soASummary.totalActivities}`;

    fair.sliderValue =
      (soASummary.mappedActivities / soASummary.totalActivities) * 100;

    fair.tableColumns = [
      "unlinked activities",
      "Select justification / rationale",
    ];

    fair.tableData = fairTableData;

    fair.contents = `${
      // soASummary.totalActivities - soASummary.mappedActivities
      soASummary.mappedActivities
      } of your trial's ${soASummary.totalActivities
      } activities are linked to endpoints. Below is a list of the unlinked endpoints and justification. Consider assessing any noncritical activities to reduce patient burden and cost. ${soASummary.tertiles ? "" : "There is not enough historical data for a comparison"}`;
    data.fairs = [fair];
    setSoAData(data);
  };
  const changeIEDataByIESummary = (ieSummary: IESummaryType) => {
    const data = { ...ieData };
    data.scenarioContentTitle = `Your I/E Complexity Score is ${ieSummary.complexityScore.scenario}`;

    if (ieSummary.complexityScore.tertiles) {
      data.scenarioOptionName = getRankByScore(
        ieSummary.complexityScore.scenario,
        ieSummary.complexityScore.tertiles,
        ["Good", "Fair", "Poor"]
      );
      data.scenarioContentBody = <>Your score is calculated based on your selection of I/E criteria. The score rating <b>{data.scenarioOptionName}</b> indicates how the complexity of your selected I/E criteria compare to the complexity of I/E criteria from past Lilly similar historical trials.</>;
      if (ieSummary.complexityScore.tertiles[1]) {
        if (ieSummary.complexityScore.tertiles[2]) {
          data.scenarioOptionValue = ieSummary.complexityScore.scenario / ieSummary.complexityScore.tertiles[2] * 100
          data.historicalScenarioOptionValue = ieSummary.complexityScore.historical / ieSummary.complexityScore.tertiles[2] * 100
        } else {
          data.scenarioOptionValue = ieSummary.complexityScore.scenario / (ieSummary.complexityScore.tertiles[1] * 3 / 2) * 100;
          data.historicalScenarioOptionValue = ieSummary.complexityScore.historical / (ieSummary.complexityScore.tertiles[1] * 3 / 2) * 100;
        }
      } else {
        data.scenarioOptionValue = ieSummary.complexityScore.scenario;
      }
    }
    data.scenarioOptionDescription = `Historical Average: ${ieSummary.complexityScore.historical || 'N/A'}`;
    const screenFailureTableData = ieSummary.screenFailure.criteria.map(
      (criterion) => {
        const rate = (criterion.rate * 100).toFixed();
        return [criterion.name, `${rate}%`];
      }
    );
    const screenFailureFair = {
      title: "Screen Failure Rate",
      sliderValue: ieSummary.screenFailure.scenario,
      degree: getRankByScore(
        ieSummary.screenFailure.scenario,
        ieSummary.screenFailure.tertiles,
        ["Good", "Fair", "Poor"]
      ),
      tooltips: "This panel displays the number of criteria you have selected which have a historical average screen failure rate in similar trials above 1%, compared to the average.",
      tableData: screenFailureTableData,
      tableColumns: [
        "Your Selected Criteria",
        "Average Screen Failure Rate",
      ],
      // contentTitle: "View Your Score Details",
      contentTitle: "",
      contents: `${ieSummary.screenFailure.scenario} of the criteria you selected have a screen failure rate above 1%, compared to ${ieSummary.screenFailure.historical} in similar historical trials. ${ieSummary.screenFailure.tertiles ? "" : "There is not enough historical data for a comparison"}`,
      historicalMarks: [
        {
          value: ieSummary.screenFailure.historical > 100 ? 100 : ieSummary.screenFailure.historical,
          label: `HISTORICAL AVERAGE: ${ieSummary.screenFailure.historical || 'N/A'}`,
        },
      ],
    };
    const protocolAmendmentFairTableData = ieSummary.protocolAmendment.criteria.map(
      (criterion) => {
        const rate = (criterion.rate * 100).toFixed();
        
        const amendments = criterion.amendments?.map((record) => {
          return {
            textBefore: record.beforeText,
            textAfter: record.afterText,
            beforeIndex: record.beforeIndex,
            afterIndex: record.afterIndex,
          }
        }) || [];
        return [
          criterion.name, 
          `${rate}%`, 
          amendments,
        ];
      }
    );
    const protocolAmendmentFair = {
      title: "PROTOCOL AMENDMENT",
      sliderValue: ieSummary.protocolAmendment.scenario,
      degree: getRankByScore(
        ieSummary.protocolAmendment.scenario,
        ieSummary.protocolAmendment.tertiles,
        ["Good", "Fair", "Poor"]
      ),
      tooltips:
        "This panel displays the number of criteria you have selected which have been amended at least once in past similar Lilly trials, compared to the average number of criteria amended at least once.",
      tableData: protocolAmendmentFairTableData,
      tableColumns: ["Your Selected Criteria", "Amendment rate in Past Similar Trials", "View Amendment Text"],
      contentTitle: "",
      contents: `${ieSummary.protocolAmendment.scenario} of the criteria you selected have been amended, compared to ${ieSummary.protocolAmendment.historical} in similar historical trials. ${ieSummary.protocolAmendment.tertiles ? "" : "There is not enough historical data for a comparison"}`,
      historicalMarks: [
        {
          value: ieSummary.protocolAmendment.historical > 100 ? 100 : ieSummary.protocolAmendment.historical,
          label: `HISTORICAL AVERAGE: ${ieSummary.protocolAmendment.historical || 'N/A'}`,
        },
      ],
    };
    data.fairs = [screenFailureFair, protocolAmendmentFair];
    setIEData(data);
  };
  useEffect(() => {
    if (soASummary) {
      changeSoADataBySoASummary(soASummary);
    }
    if (ieSummary) {
      changeIEDataByIESummary(ieSummary);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soASummary, ieSummary]);
  const renderContainerByParam = useCallback((data: any) => {
    const {
      description,
      scenarioTitle,
      scenarioTooltips,
      scenarioContentTitle,
      scenarioContentBody,
      scenarioOptionName,
      scenarioOptionValue,
      historicalScenarioOptionValue,
      scenarioOptionDescription,
      fairs,
    } = data;
    return (
      <RightStuff>
        <Title>Impact Analysis</Title>
        <Description>{description}</Description>
        <ScenarioCard
          style={{
            maxWidth: "5.813rem",
            width: "100%",
          }}
          title={scenarioTitle}
          tooltips={scenarioTooltips}
          contentTitle={scenarioContentTitle}
          contentBody={scenarioContentBody}
          optionName={scenarioOptionName}
          optionValue={scenarioOptionValue}
          historicalOptionValue={historicalScenarioOptionValue}
          optionDescription={scenarioOptionDescription}
          colors={["#00AF3F", "#F7D355", "#D52B1E"]}
          avatar={
            <CustomDot
              style={{ color: "red", width: "0.625rem", height: "0.625rem" }}
            />
          }
        />
        {
          pageType === PredictImpactType.SoA  && (
            <TopActivitiesCard
              title="Top 10 Activities"
              activities={topActivities}
            />
          )
        }
        
        {fairs.map((fair: any) => {
          let degreeStyle = { color: "#00AF3F", marginLeft: "5px" };
          if (fair.degree?.toLowerCase() === "good") {
            degreeStyle = { color: "#00AF3F", marginLeft: "5px" };
          } else if (fair.degree?.toLowerCase() === "fair") {
            degreeStyle = { color: "#FFA900", marginLeft: "5px" };
          } else if (fair.degree?.toLowerCase() === "poor") {
            degreeStyle = { color: "#D52B1E", marginLeft: "5px" };
          }
          return (
            <FairCard
              title={
                <>
                  {fair.title}
                  <span style={degreeStyle}>
                    {fair.degree}
                  </span>
                </>
              }
              tooltips={fair.tooltips}
              tableColumns={fair.tableColumns}
              tableData={fair.tableData}
              contentTitle={fair.contentTitle}
              contents={fair.contents}
              historicalMarks={fair.historicalMarks}
              sliderValue={fair.sliderValue}
              sliderDisplayValue={fair.sliderDisplayValue || fair.sliderValue}
            />
          )
        })}
      </RightStuff>
    );
  }, [topActivities, pageType]);
  const renderData = pageType === PredictImpactType.SoA ? soAData : ieData;
  return renderContainerByParam(renderData);
};
const RightStuff = styled(Grid)({
  marginTop: "3.375rem",
  padding: "0 3.813rem",
  background: "#ffffff",
  marginBottom: "8rem",
});
const Title = styled(Grid)({
  fontSize: "1.5rem",
  fontFamily: "Helvetica",
  color: "#000000",
});
const Description = styled(Grid)({
  fontSize: "1rem",
  fontFamily: "Helvetica",
  color: "#000000",
  marginTop: "8px",
  width: "100%",
});
const CustomDot = styled(FiberManualRecord)(({ theme }) => ({}));
export default RightContainer;
