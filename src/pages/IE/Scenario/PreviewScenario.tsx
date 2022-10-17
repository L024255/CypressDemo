/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect, useContext } from "react";
import { Grid, styled, Typography, Button } from "@material-ui/core";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import InformationCard from "../../TrialHome/components/InformationCard";
import PreviewOptionCard from "../components/PreviewOptionCard";
import { ExportReport } from "../../../components/icons";
import { useParams } from "react-router-dom";
import { QueryByStringWithClient } from "../../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../../api/fetchByTypes";
import { ScenarioDetail } from "../../../@types/ScenarioDetail";
import { TrailWorkspaceDetail } from "../../../@types/TrailWorkspace";
import { formatUserName, formatCriterionDisplayName } from "../../../utils/getDataUtil";
import { reject } from "lodash";
import UsersContext from "../../../provider/UsersContextProvider";
import { useJwtInfo } from "../../../hooks/JwtInfo";
import { IESummaryType } from "../PredictedImpact/type/IESummaryType";
import { SoASummaryType } from "../PredictedImpact/type/SoASummaryType";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { useUpdateScenario } from "../../../hooks/useCreateScenario";
import { filterSoaTaxonomyByShowChildren, transferResponseToSoaActivityModelArray } from "../../../utils/SoAUtils";
import { SoaActivityModel } from "../../SoA/type/SoaActivity";
interface AttrubutesProps {
  id: string;
  name: string;
}

const PreviewScenario: React.FC = () => {
  const { UpdateScenario } = useUpdateScenario();
  const contextData = useContext<any>(UsersContext);
  const { jwtInfo } = useJwtInfo();
  const { id: scenarioId }: any = useParams();
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

  const handleExportScenario = (scenarioId: string) => {
    const url = `${window.location.origin}/print-preview-scenario/${scenarioId}`;
    window.open(url);
  }
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
                trialWorkspaceId: scenario?.trialWorkspaceId || "",
                final: true
              }
            })];
            disableScenarioIds.forEach((scenarioId: any) => {
              requests.push(UpdateScenario({
                input: {
                  id: scenarioId,
                  trialWorkspaceId: scenario?.trialWorkspaceId || "",
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
  useEffect(() => {
    if (scenarioId) {
      refreshPage();
    }
    getDicionaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  const acitvityData: SoaActivityModel[] = transferResponseToSoaActivityModelArray(scenario?.soaActivities || []);
  const filterActivityData: SoaActivityModel[] = filterSoaTaxonomyByShowChildren(acitvityData);
  return (
    <Container>
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
              { href: `/edit-scenario/${scenarioId}`, text: "Edit Scenario" },
              { text: "Preview", currentPage: true },
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
            studyPhase={trialWorkspace?.userTrial.phase?.id}
            studyType={trialWorkspace?.userTrial?.studyType?.id}
            trialTitle={trialWorkspace?.userTrial.trialTitle}
            pediatricStudy={
              trialWorkspace?.userTrial.pediatricStudy ? "yes" : "no"
            }
            molecule={trialWorkspace?.userTrial.molecule?.id}
            trialAlias={trialWorkspace?.userTrial.trialAlias}
            author={formatUserName(trialWorkspace?.trialUpdatedBy?.name || "")}
            indicationOptions={indications}
            phaseOptions={studyPhases}
            studyTypeOptions={studyTypes}
            therapeuticAreasOptions={theraPeuticAreas}
            moleculeOptions={molecules}
            duration={trialWorkspace?.userTrial.duration}
            dataVersion={trialWorkspace?.dataVersion?.name || ""}
          />
        </Information>
      </InformationContainer>
      <OptionsContainer>
        <OptionContainer>
          <PreviewOptionCard
            selected={Boolean(scenario && scenario.final === true)}
            exportNotes={scenario?.notes}
            key={scenario?.id || "scenario-option"}
            title={scenario?.name || ""}
            description={scenario?.description || ""}
            author={`by ${formatUserName(scenario?.scenarioUpdatedBy?.name || "")}`}
            criteriaData={[
              {
                title: "Inclusion",
                values: scenario?.scenarioCriteria?.filter((criterion) => criterion.type === "Include").map((criterion) => {
                  return formatCriterionDisplayName(criterion.criterion);
                }) || []
              },
              {
                title: "Exclusion",
                values: scenario?.scenarioCriteria?.filter((criterion) => criterion.type === "Exclude").map((criterion) => {
                  return formatCriterionDisplayName(criterion.criterion);
                }) || []
              },
              {
                title: "SCHEDULE OF ACTIVITIES",
                values: filterActivityData.filter((soa: any) => soa.soaVisits?.length > 0)?.map((soaObj: any) => {
                  let activityName = "";
                  if (soaObj.activity) {
                    activityName = soaObj.activity.name;
                  } else if (soaObj.soaTaxonomy?.name) {
                    activityName = soaObj.soaTaxonomy?.name.split(".").length > 1 ? soaObj.soaTaxonomy?.name.split(".")[1] : soaObj.soaTaxonomy?.name
                  }
                  return activityName;
                }) || [],
              },
            ]}
            indicatorData={[
             
              {
                title: "Total SoA Cost per Patient",
                value: soaSummary ? `$${soaSummary?.totalCost}` : '-'
              },
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
            ]}
            handleCheck={(val: boolean) => {
              handleOptionCardSelected(val, scenario?.id || "");
            }}
            handleChangeExportNotes={(notes: string) => {
              handleChangeExportNotes(notes);
            }}
          />
        </OptionContainer>
      </OptionsContainer>
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
