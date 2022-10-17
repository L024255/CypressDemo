/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Grid, styled, Typography, Chip, Button, Menu, MenuItem } from "@material-ui/core";
import { FiberManualRecord, ExpandMore } from "@material-ui/icons";
import OptionScenarioInfoCard from "./components/OptionScenarioInfoCard";
import CustomTabBar from "../../components/CustomTabBar";
import { useHistory, useParams } from "react-router-dom";
import { graphqlStringMap } from "../../api/fetchByTypes";
import { QueryByStringWithClient } from "../../api/apollo";
import { getRankByScore } from "../../utils/getDataUtil";
import { IESummaryType } from "../IE/PredictedImpact/type/IESummaryType";
import { SoASummaryType } from "../IE/PredictedImpact/type/SoASummaryType";
import CustomErrorBar from "../../components/CustomErrorBar";
import CustomLoading from "../../components/CustomLoading/CustomLoading";

interface ProgressDataType {
  scenarioId?: string;
  title: string;
  degree: string;
  value: number;
  historicalAverage: number;
  historicalDisplay: string;
  format?: (value: number) => any;
}
const CompareScenario: React.FC = () => {
  const { workspaceId }: any = useParams();
  const { push }: any = useHistory();
  const [loading, setLoading] = useState(false);
  const [scenarioList, setScenarioList] = useState<
    { id: string; name: string }[]
  >([]);
  const [hideScenarioList, setHideScenarioList] = useState<
  { id: string; name: string }[]
  >([]);
  const [showHideScenarios, setShowHideScenarios] = useState(false);
  const [sysError, setSysError] = useState("");
  const [progressData, setProgressData] = useState<{
    [x: string]: ProgressDataType[];
  }>({});
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const compareScenariosDotColor = ["#FF6D22", "#00A1DE", "#B1059D"];

  const getTrialScenarios = (trialWorkspaceId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchScenarios, {
      trialWorkspaceId,
    })
      .then((res: any) => {
        const scenarios = res.data.scenarios;
        const scenarioList =
          scenarios?.map((scenario: any) => {
            return { id: scenario.id, name: scenario.name };
          }) || [];
        if (scenarioList.length > 3) {
          const hideList = scenarioList.splice(3);
          setHideScenarioList(hideList);
        }
        setScenarioList(scenarioList);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const calculatePercentage = (value: number, totalValue: number)  => {
    return value / totalValue * 100;
  }
  const getScenariosIESummary = (scenarioIds: string[]) => {
    const progressData: { [x: string]: ProgressDataType[] } = {};
    if (scenarioIds.length > 0) {
      const requests = scenarioIds.map((id: string) =>
        QueryByStringWithClient(graphqlStringMap.fetchScenarioSummary, { id })
      );
      Promise.all(requests)
        .then((resArr) => {
          resArr.forEach((res: any, index) => {
            const ieSummary: IESummaryType = res.data.ieSummary;
            const soaSummary: SoASummaryType = res.data.soaSummary;
            const screenFailureInfo: ProgressDataType = {
              title: "Screening Failure",
              degree: getRankByScore(
                ieSummary?.screenFailure.scenario,
                ieSummary?.screenFailure.tertiles,
                ["Good", "Fair", "Poor"]
              ),
              value: ieSummary?.screenFailure?.tertiles && ieSummary?.screenFailure?.tertiles[2] ? calculatePercentage(ieSummary?.screenFailure.scenario, ieSummary?.screenFailure?.tertiles[2]) : ieSummary?.screenFailure.scenario,
              format: (value: number) => {
                if (!ieSummary || !ieSummary.screenFailure ||(isNaN(ieSummary.screenFailure.scenario))) {
                  return "N/A"
                }
                return ieSummary.screenFailure.scenario;
              },
              historicalAverage: ieSummary?.screenFailure?.tertiles && ieSummary?.screenFailure?.tertiles[2] ? calculatePercentage(ieSummary?.screenFailure.historical, ieSummary?.screenFailure?.tertiles[2] ) :ieSummary?.screenFailure.historical,
              historicalDisplay:
                ieSummary?.screenFailure.historical?.toString() || "N/A",
            };
            const costInfo: ProgressDataType = {
              title: "Cost",
              degree: getRankByScore(
                soaSummary?.totalCost,
                soaSummary?.tertiles || [],
                ["Good", "Fair", "Poor"]
              ),
              value: soaSummary?.tertiles && soaSummary?.tertiles[2] ? calculatePercentage(soaSummary?.totalCost, soaSummary?.tertiles[2]) : soaSummary?.totalCost,
              historicalAverage: soaSummary?.tertiles && soaSummary?.tertiles[2] ?  calculatePercentage(soaSummary?.historicalTotalCost, soaSummary.tertiles[2]) : soaSummary?.historicalTotalCost,
              historicalDisplay: `$${soaSummary?.historicalTotalCost}`,
              format: (value: number) => {
                if (!soaSummary || isNaN(soaSummary.totalCost)) {
                  return "N/A";
                }
                return `$${soaSummary?.totalCost}`;
              },
            };
            const protocolAmendment = {
              title: "Protocal Amendment",
              degree: getRankByScore(
                ieSummary?.protocolAmendment.scenario,
                ieSummary?.protocolAmendment.tertiles,
                ["Good", "Fair", "Poor"]
              ),
              value: ieSummary?.protocolAmendment.tertiles && ieSummary?.protocolAmendment.tertiles[2] ? calculatePercentage(ieSummary?.protocolAmendment.scenario, ieSummary?.protocolAmendment.tertiles[2])  : ieSummary?.protocolAmendment.scenario,
              historicalAverage: ieSummary?.protocolAmendment?.tertiles && ieSummary?.protocolAmendment?.tertiles[2] ? calculatePercentage(ieSummary?.protocolAmendment.historical, ieSummary?.protocolAmendment?.tertiles[2] ) :ieSummary?.protocolAmendment.historical,
              historicalDisplay: ieSummary?.protocolAmendment.historical?.toString() || "N/A",
              format: (value: number) => {
                if (!ieSummary || !ieSummary.protocolAmendment ||(isNaN(ieSummary.protocolAmendment.scenario))) {
                  return "N/A"
                }
                return ieSummary.protocolAmendment.scenario;
              },
            };
            const complexity = {
              title: "I/E complexity score",
              degree: getRankByScore(
                ieSummary?.complexityScore.scenario,
                ieSummary?.complexityScore.tertiles,
                ["Good", "Fair", "Poor"]
              ),
              value: ieSummary?.complexityScore.tertiles && ieSummary?.complexityScore.tertiles[2] ? calculatePercentage(ieSummary?.complexityScore.scenario, ieSummary?.complexityScore.tertiles[2]) : ieSummary?.complexityScore.scenario,
              historicalAverage: ieSummary?.complexityScore?.tertiles && ieSummary?.complexityScore?.tertiles[2] ? calculatePercentage(ieSummary?.complexityScore.historical, ieSummary?.complexityScore?.tertiles[2] ) :ieSummary?.complexityScore.historical,
              historicalDisplay: ieSummary?.complexityScore.historical?.toString() || "N/A",
              format: (value: number) => {
                if (!ieSummary || !ieSummary.complexityScore ||(isNaN(ieSummary.complexityScore.scenario))) {
                  return "N/A"
                }
                return ieSummary.complexityScore.scenario;
              },
            };
            progressData[scenarioIds[index]] = [
              complexity,
              screenFailureInfo,
              protocolAmendment,
              costInfo,
            ];
          });
          setProgressData(progressData);
        })
        .catch((errors) => {
          console.log(errors);
          setSysError("There was an error, please try again");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const handleAddHideScenario = (scenario: any) => {
    const hideList = [...hideScenarioList];
    const showList = [...scenarioList];
    if (showList.findIndex((obj: any) => obj.id === scenario.id) < 0) {
      showList.push(scenario);
    }
    setHideScenarioList(hideList.filter((obj) => obj.id !== scenario.id));
    setScenarioList(showList);
    setShowHideScenarios(false);
  }
  useEffect(() => {
    getTrialScenarios(workspaceId);
  }, [workspaceId]);
  useEffect(() => {
    const scenarioIds = scenarioList.map((scenario) => scenario.id);
    getScenariosIESummary(scenarioIds);
  }, [scenarioList]);
  const optionInfoCardStyle = {
    minWidth: "10.813rem",
    background: "#FFFFFF rgba(255, 255, 255, 0.09)",
    boxShadow:
      "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14)",
    borderRadius: "4px",
  };
  return (
    <>
      <CustomTabBar
        tabTitles={[]}
        tabValue=""
        hasBackButton
        changeTabValue={() => {}}
      />
      <CustomLoading open={loading} />
      <CustomErrorBar
        open={Boolean(sysError)}
        content={sysError}
        onClose={() => {
          setSysError("");
        }}
      />
      <Container container>
        <Left xs={3} item>
          <LeftTitleContainer>
            <LeftTitle variant="caption">Selected Scenarios</LeftTitle>
            <SeperateLine />
          </LeftTitleContainer>
          <ScenarioCardContainer>
            {scenarioList.map((scenario, index) => (
              <ScenarioCard
                key={`scenario-${scenario.id}`}
                variant="outlined"
                label={scenario.name}
                onDelete={() => {
                  const showList = [...scenarioList];
                  const optionList = [...hideScenarioList];
                  if (optionList.findIndex((obj: any) => obj.id === scenario.id) < 0) {
                    optionList.push(scenario);
                  }
                  setScenarioList(showList.filter((obj: any) => obj.id !== scenario.id));
                  setHideScenarioList(optionList);

                }}
                avatar={<CustomDot style={{ color: compareScenariosDotColor[index]}} />}
              />
            ))}
            <div>
            <AddScenarioButton disabled={scenarioList.length >= 3 || hideScenarioList.length === 0} onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setShowHideScenarios(true);
            }}>
              Add Exsisting scenario <ExpandMore />
            </AddScenarioButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={showHideScenarios}
              onClose={() => setShowHideScenarios(false)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {
                hideScenarioList.map((scenario: any) => <MenuItem onClick={() => handleAddHideScenario(scenario)}>{scenario.name}</MenuItem>)
              }
            </Menu>
            </div>
          </ScenarioCardContainer>
        </Left>
        <Right xs={9} item>
          <RightTitle>Compare Scenario Performance</RightTitle>
          <RightDescirption>
            Select up to three existing scenarios to compare and contrast
            predicted impact across multiple trial protocol feature designs
            scenarios. The comparison point is the historical average for the
            past similar trials. For additional detail, click into each
            predicted metric card.
          </RightDescirption>
          <OpitonCardContainer container spacing={2}>
            {scenarioList.map((scenario, index) => {
              return (
                <Grid item xs={4}>
                  <OptionScenarioInfoCard
                    key={`scenario-option-${scenario.id}`}
                    style={optionInfoCardStyle}
                    title={scenario.name}
                    optionName=""
                    optionValue={62}
                    progressData={progressData[scenario.id] || []}
                    handleViewScenario={() =>
                      push(`/edit-scenario/${scenario.id}`)
                    }
                    avatar={
                      <CustomDot
                        style={{
                          color: compareScenariosDotColor[index],
                          width: "0.625rem",
                          height: "0.625rem",
                        }}
                      />
                    }
                  />
                </Grid>
              );
            })}
          </OpitonCardContainer>
        </Right>
      </Container>
    </>
  );
};

const Container = styled(Grid)({
  maxWidth: "90rem",
  margin: "auto",
});
const Left = styled(Grid)({
  backgroundColor: "#F1F1F1",
});
const Right = styled(Grid)({
  padding: "3.75rem",
});
const LeftTitleContainer = styled(Grid)({
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});
const LeftTitle = styled(Typography)({
  fontSize: "1.5rem",
  marginBottom: "10px",
  color: "#2D2D2D",
  lineHeight: "1.813rem",
});
const SeperateLine = styled("hr")({
  margin: 0,
  width: "14.5rem",
  backgroundColor: "#979797",
});
const ScenarioCardContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
const ScenarioCard = styled(Chip)({
  display: "flex",
  justifyContent: "flex-start",
  position: "relative",
  border: "none",
  borderRadius: 1,
  boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.08)",
  paddingLeft: "10px",
  marginTop: "20px",
  background: "#fff",
  fontSize: "0.75rem",
  width: "14.5rem",
  minHeight: "2.5rem",
  "&& .MuiChip-label": {
    fontSize: "0.625rem",
    color: "#666",
    lineHeight: "1rem",
    letterSpacing: "0.063rem",
    paddingLeft: "0.313rem",
    whiteSpace: "break-spaces",
  },
  "&& .MuiChip-avatar": {
    marginRight: "5px",
    width: "10px",
    height: "10px",
  },
  "&& .MuiChip-deleteIcon": {
    position: "absolute",
    right: "10px",
    width: "15px",
    color: "#DBD9D9",
  },
});
const CustomDot = styled(FiberManualRecord)(({ theme }) => ({}));
const AddScenarioButton = styled(Button)({
  background: "#DBD9D9",
  textTransform: "uppercase",
  width: "14.5rem",
  height: "40px",
  boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.08)",
  borderRadius: "4px",
  opacity: 0.4,
  marginTop: "20px",
  fontSize: "10px",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
});
const OpitonCardContainer = styled(Grid)({
  display: "flex",
  justifyContent: "flex-start",
  marginTop: "30px",
});
const RightTitle = styled(Typography)({
  fontSize: "1.5rem",
  color: "#2D2D2D",
  marginBottom: "0.75rem",
  lineHeight: "1.813rem",
});
const RightDescirption = styled(Typography)({
  fontSize: "1rem",
  color: "#2D2D2D",
  lineHeight: "1.5rem",
});

export default CompareScenario;
