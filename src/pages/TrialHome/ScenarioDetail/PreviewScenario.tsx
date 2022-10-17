/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect, useContext } from "react";
import { Grid, styled, Typography, Button } from "@material-ui/core";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import InformationCard from "../../TrialHome/components/InformationCard";
import { ExportReport } from "../../../components/icons";
import { useHistory, useParams } from "react-router-dom";
import { QueryByStringWithClient } from "../../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../../api/fetchByTypes";
import { ScenarioDetail } from "../../../@types/ScenarioDetail";
import { TrailWorkspaceDetail } from "../../../@types/TrailWorkspace";
import { formatUserName, formatCriterionDisplayName } from "../../../utils/getDataUtil";
import { reject, sortBy } from "lodash";
import UsersContext from "../../../provider/UsersContextProvider";
import { useJwtInfo } from "../../../hooks/JwtInfo";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { IESummaryType } from "../../IE/PredictedImpact/type/IESummaryType";
import { SoASummaryType } from "../../IE/PredictedImpact/type/SoASummaryType";
import PreviewOptionCard from "../../IE/components/PreviewOptionCard";
import CustomTabBar from "../../../components/CustomTabBar";
import { useUpdateScenario } from "../../../hooks/useCreateScenario";
import { filterSoaTaxonomyByShowChildren, transferResponseToSoaActivityModelArray } from "../../../utils/SoAUtils";
import { SoaActivityModel } from "../../SoA/type/SoaActivity";

interface AttrubutesProps {
  id: string;
  name: string;
}

const PreviewScenario: React.FC = () => {
  const { push } = useHistory();
  const { UpdateScenario } = useUpdateScenario();
  // const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const contextData = useContext<any>(UsersContext);
  const { jwtInfo } = useJwtInfo();
  const { scenarioId }: any = useParams();
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [ieSummary, setIESummary] = useState<IESummaryType>();
  const [scenario, setScenario] = useState<ScenarioDetail | undefined | null>(
    null
  );
  const [trialWorkspace, setTrialworkspace] = useState<
    TrailWorkspaceDetail | undefined | null
  >(null);
  const [complexityScore, setComplexityScore] = useState();
  const [soaSummary, setSoASummary] = useState<SoASummaryType>();
  const [studyPhases, setStudyPhases] = useState<AttrubutesProps[]>([]);
  const [studyTypes, setStudyTypes] = useState<AttrubutesProps[]>([]);
  const [indications, setIndications] = useState<AttrubutesProps[]>([]);
  const [theraPeuticAreas, setTheraPeuticAreas] = useState<AttrubutesProps[]>(
    []
  );
  const [molecules, setMolecules] = useState<AttrubutesProps[]>([]);
  const [unsupportedTrial, setUnsupportedTrial] = useState<Boolean>(false)

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
        setSysError(error.message || "fetch dictionary error");
        console.log(error);
      });
  };
  const getScenarioById = (scenarioId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {
        const currentScenario = res.data.scenario;
        setScenario(currentScenario);
        setTrialworkspace(currentScenario.trialWorkspace);
        setUnsupportedTrial(currentScenario.trialWorkspace?.userTrial?.unsupported)
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleOptionCardSelected = useCallback(
    (checked: boolean, scenarioId: string) => {
      setLoading(true);
      const trialWorkspaceId = scenario?.trialWorkspaceId || "";
      if (checked === true) {
        QueryByStringWithClient(graphqlStringMap.fetchScenarios, { trialWorkspaceId })
          .then((res: any) => {
            const scenarios = res.data.scenarios;
            const disableScenarioIds: any[] = [];
            scenarios.filter((scenario: any) => scenario.id !== scenarioId).forEach((scenario: any) => {
              if (scenario.final === true) {
                disableScenarioIds.push(scenario.id);
              }
            });
            const requests: any[] = [UpdateScenario({
              input: {
                id: scenarioId,
                trialWorkspaceId,
                final: true
              }
            })];
            disableScenarioIds.forEach((scenarioId: any) => {
              requests.push(UpdateScenario({
                input: {
                  id: scenarioId,
                  trialWorkspaceId,
                  final: false
                }
              }));
            });
            Promise.all(requests).then((res: any) => {
              refreshPage();
            }).catch((error: any) => {
              setSysError(error.message || "update final error");
              console.error(error);
            });
          })
          .catch((error: any) => {
            setSysError(error.message || "get trial scenarios error");
            console.error(error);
          })
          .finally(() => { setLoading(false) });
      } else {
        UpdateScenario({
          input: {
            id: scenarioId,
            trialWorkspaceId,
            final: checked
          }
        }).then((res: any) => {
          refreshPage();
        }).catch((error: any) => {
          setSysError(error.message || "change scenario final fialed");
          console.log(error);
        }).finally(() => { setLoading(false) });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scenario]);
  const handleChangeExportNotes = useCallback((value: string) => {
    setLoading(true);
    UpdateScenario({
      input: {
        id: scenarioId,
        trialWorkspaceId: scenario?.trialWorkspaceId || "",
        notes: value
      }
    }).then((res: any) => {
      refreshPage();
    }).catch((error: any) => {
      setSysError(error.message || "change scenario notes fialed");
      console.log(error);
    }).finally(() => { setLoading(false) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);
  const getUsers = () => {
    const collaborators: any =
      reject(contextData?.users, function (o) {
        return o.username === jwtInfo?.preferred_username;
      }) || [];
    return collaborators;
  }
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
  const getIESummary = (scenarioId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchIESummary, {
      id: scenarioId,
    })
      .then((res: any) => {
        const summary = res.data.ieSummary;
        const complexityScore = summary?.complexityScore.scenario;
        setIESummary(summary);
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
  const refreshPage = useCallback(() => {
    getScenarioById(scenarioId);
    getIESummary(scenarioId);
    getSoASummary(scenarioId);
  }, [scenarioId]);
  const handleExportScenario = (scenarioId: string) => {
    const url = `${window.location.origin}/print-preview-scenario/${scenarioId}`;
    window.open(url);
  }
  useEffect(() => {
    if (scenarioId) {
      refreshPage();
    }
    getDicionaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  const getVisitColumnByVisitNumber = (scenarioVisits: any[], visitNumber: number, soaPeriodId: string) => {
    const columnGroups = scenarioVisits;
    const groupIndex = columnGroups.findIndex((group: any) => group.soaPeriodId === soaPeriodId && group.visitNumber === visitNumber);
    return groupIndex + 1;
  };
  const criteriaData = (filterActivityData: SoaActivityModel[]) => {
    const ieData = [{
      title: "Inclusion",
      values: scenario?.scenarioCriteria?.filter((criterion: any) => criterion.type === "Include").map((criterion: any) => {
        criterion.name = criterion.criterion.name;
        return formatCriterionDisplayName(criterion);
      }) || []
    },
    {
      title: "Exclusion",
      values: scenario?.scenarioCriteria?.filter((criterion: any) => criterion.type === "Exclude").map((criterion: any) => {
        criterion.name = criterion.criterion.name;
        return formatCriterionDisplayName(criterion);
      }) || []
    }]
    const soaData = [{
      title: "SCHEDULE OF ACTIVITIES",
      columnHeaders: <SoADisplayContainer container>
        <Grid item xs={6} style={{ color: "#A59D95" }}>Name</Grid>
        <Grid item xs={6} style={{ color: "#A59D95", paddingLeft: "20px" }}>Visit Numbers</Grid>
      </SoADisplayContainer>,
      values: filterActivityData.filter((soa: any) => soa.soaVisits?.length > 0)?.map((soaObj: any, index) => {
        if (soaObj.activity || soaObj.soaTaxonomy) {
          const scenarioVisits = sortBy(scenario?.soaVisits || [], ['soaPeriodId', 'visitNumber']);
          const selectedVisits = soaObj.soaVisits.map((visit: any) => {
            const columnIndex = getVisitColumnByVisitNumber(scenarioVisits, visit.visitNumber, visit.soaPeriodId);
            return columnIndex;
          }).sort((a: any, b: any) => (a - b)).map((index: any) => `Visit ${index}`);
          let activityName = "";
          if (soaObj.activity) {
            activityName = soaObj.activity.name;
          } else if (soaObj.soaTaxonomy?.name) {
            activityName = soaObj.soaTaxonomy?.name.split(".").length > 1 ? soaObj.soaTaxonomy?.name.split(".")[1] : soaObj.soaTaxonomy?.name
          }
          return <SoADisplayContainer container key={index}>
            <Grid item xs={6}>{activityName}</Grid>
            <Grid item xs={6} style={{ paddingLeft: "20px" }}>{selectedVisits.toString()}</Grid>
          </SoADisplayContainer>
        }
        return "";
      }) || []
    }]

    if(unsupportedTrial) return soaData
    return [...ieData, ...soaData]
  }
  const indicatorData = () => {
    const ieData = [
      {
        title: "I/E Complexity Score",
        value: complexityScore || '-',
      },
      {
        title: "number of I/E resulting in screen failure",
        value: ieSummary ? `${ieSummary?.screenFailure.scenario}` : '-',
      },
      {
        title: "number of I/E resulting in amendment in similar trials",
        value: ieSummary ? `${ieSummary.protocolAmendment.scenario}` : '-',
      },
    ]
    const soaData = [
      {
        title: "Total SoA Cost per Patient",
        value: soaSummary ? `$${soaSummary?.totalCost}` : '-'
      }
    ]
    if(unsupportedTrial) return soaData
    return [...ieData, ...soaData]
  }
  const renderScenarioOption = (scenario: any) => {
    const acitvityData: SoaActivityModel[] = transferResponseToSoaActivityModelArray(scenario?.soaActivities || []);
    const filterActivityData: SoaActivityModel[] = filterSoaTaxonomyByShowChildren(acitvityData);
    return (
      <OptionsContainer>
        <OptionContainer>
          <PreviewOptionCard
            selected={Boolean(scenario && scenario.final === true)}
            key={scenario?.id || "scenario-option"}
            title={scenario?.name || ""}
            description={scenario?.description || ""}
            author={`by ${formatUserName(scenario?.scenarioUpdatedBy?.name || "")}`}
            criteriaData={criteriaData(filterActivityData)}
            indicatorData={indicatorData()}
            handleCheck={(val: boolean) => {
              handleOptionCardSelected(val, scenario?.id || "");
            }}
            handleChangeExportNotes={(value: string) => handleChangeExportNotes(value)}
          />
        </OptionContainer>
      </OptionsContainer>
    );
  }
  return (
    <Container>
      <CustomTabBar
        tabTitles={["Draft", "Preview"]}
        changeTabValue={(value: number) => {
          if (value === 0) {
            push(`/edit-scenario/${scenarioId}`);
          }
        }}
        tabValue={1}
      />
      <CustomLoading open={loading} />
      <CustomErrorBar
        open={Boolean(sysError)}
        content={sysError}
        onClose={() => setSysError("")}
      />
      <InformationContainer>
        <BreadcrumbContainer>
          <AppBreadcrumb
            links={[
              { href: "/", text: "" },
              { href: `/trial-homepage/${trialWorkspace?.id}`, text: "Trial Homepage" },
              { text: "Edit Scenario", currentPage: true },
            ]}
          />
        </BreadcrumbContainer>
        <Title variant="h3">{trialWorkspace?.userTrial.trialTitle}</Title>
        <Information>
          <InformationCard
            title="General Information"
            readonly
            users={getUsers()}
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
            author={formatUserName(trialWorkspace?.trialUpdatedBy?.name || "")}
            indicationOptions={indications.filter(
              (indication: any) => indication.userDefined === false
            ) || []}
            phaseOptions={studyPhases}
            studyTypeOptions={studyTypes}
            therapeuticAreasOptions={theraPeuticAreas}
            moleculeOptions={molecules}
            duration={trialWorkspace?.userTrial.duration}
            dataVersion={trialWorkspace?.dataVersion?.name || ""}
          />
        </Information>
      </InformationContainer>
      {scenario && renderScenarioOption(scenario)}
      <ExportButton variant="contained" color="primary" onClick={() => handleExportScenario(scenarioId)}>
        <ExportReport
          style={{ marginRight: "10px" }}
          htmlColor="white"
          fontSize="small"
        />
        Export Report
      </ExportButton>
    </Container>
  );
};
const SoADisplayContainer = styled(Grid)({});
const Container = styled(Grid)({
  position: "relative",
  padding: "0 1rem",
  marginBottom: "10rem",
});
const InformationContainer = styled(Grid)({
  maxWidth: "65rem",
  margin: "auto",
  marginBottom: "54px",
});
const OptionsContainer = styled("div")({
  paddingTop: "33px",
});
const OptionContainer = styled(Grid)({
  marginTop: "-33px",
});
const BreadcrumbContainer = styled(Grid)({
  marginBottom: "2.125rem",
  marginTop: "3.25rem",
});
const Title = styled(Typography)({
  fontSize: "1.5rem",
  color: "#2D2D2D",
  lineHeight: "2rem",
  letterSpacing: "normal",
  marginBottom: "34px",
});
const Information = styled(Grid)({
  minHeight: "100px",
});
const ExportButton = styled(Button)(({ theme }) => ({
  width: "20.5rem",
  height: "3.938rem",
  position: "fixed",
  bottom: 10,
  left: "calc(50% - 10.25rem)",
  borderRadius: "3rem",
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: "1.5rem",
  letterSpacing: 0,
}));
export default PreviewScenario;
