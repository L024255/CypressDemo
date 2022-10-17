/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect, useContext } from "react";
import { Grid, styled, Typography } from "@material-ui/core";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import InformationCard from "./components/InformationCard";
// import { ExportReport } from "../../components/icons";
import { useParams } from "react-router-dom";
import { QueryByStringWithClient } from "../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import { TrailWorkspaceDetail } from "../../@types/TrailWorkspace";
import { formatUserName, formatCriterionDisplayName } from "../../utils/getDataUtil";
import { reject, sortBy } from "lodash";
import UsersContext from "../../provider/UsersContextProvider";
import { useJwtInfo } from "../../hooks/JwtInfo";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../components/CustomErrorBar";
import PreviewOptionCard from "../IE/components/PreviewOptionCard";
import { useUpdateScenario } from "../../hooks/useCreateScenario";
import { filterSoaTaxonomyByShowChildren, transferResponseToSoaActivityModelArray } from "../../utils/SoAUtils";
import { SoaActivityModel } from "../SoA/type/SoaActivity";
interface AttrubutesProps {
  id: string;
  name: string;
}

const PreviewTrialScenarios: React.FC = () => {
  const { UpdateScenario } = useUpdateScenario();
  const contextData = useContext<any>(UsersContext);
  const { jwtInfo } = useJwtInfo();
  const { trialworkspaceId }: any = useParams();
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [scenarioOptionList, setScenarioOptionList]=useState<any[]>([]);
  const [trialScenarioIds, setTrialScenarioIds] = useState<any[]>([]);
  const [trialWorkspace, setTrialworkspace] = useState<
    TrailWorkspaceDetail | undefined | null
  >(null);
  const [studyPhases, setStudyPhases] = useState<AttrubutesProps[]>([]);
  const [studyTypes, setStudyTypes] = useState<AttrubutesProps[]>([]);
  const [indications, setIndications] = useState<AttrubutesProps[]>([]);
  const [theraPeuticAreas, setTheraPeuticAreas] = useState<AttrubutesProps[]>(
    []
  );
  // const [tipsCritera, setTipsCriteria] = useState<any[]>([]);
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
  const getScenarioAndSummaryByIds = (scenarioIds: any[]) => {
    setLoading(true);
    const requestArr: any[] = [];
    scenarioIds.forEach((scenarioId: string) => {
      requestArr.push(QueryByStringWithClient(graphqlStringMap.fetchScenarioAndSummaryInfo, {
        id: scenarioId,
      }));
    });
    Promise.all(requestArr)
      .then((resArr: any[]) => {
        const optionList: any[] = [];
        resArr.forEach((res: any) => {
          optionList.push(res.data);
        });
        setScenarioOptionList(optionList);
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
      if (checked === true) {
        QueryByStringWithClient(graphqlStringMap.fetchScenarios, { trialWorkspaceId: trialworkspaceId })
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
              trialWorkspaceId: trialworkspaceId,
              final: true
            }
          })];
          disableScenarioIds.forEach((scenarioId: any) => {
            requests.push(UpdateScenario({
              input: {
                id: scenarioId,
                trialWorkspaceId: trialworkspaceId,
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
            trialWorkspaceId: trialworkspaceId,
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
    }, [ trialworkspaceId]);
  const handleChangeExportNotes = useCallback((value: string, scenarioId: string) => {
    setLoading(true);
      UpdateScenario({
        input: {
          id: scenarioId,
          trialWorkspaceId: trialworkspaceId,
          notes: value
        }
      }).then((res: any) => {
        refreshPage();
      }).catch((error: any) => {
        setSysError(error.message || "change scenario notes fialed");
        console.log(error);
      }).finally(() => { setLoading(false) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialworkspaceId]);
  const getUsers = () => {
    const collaborators: any =
      reject(contextData?.users, function (o) {
        return o.username === jwtInfo?.preferred_username;
      }) || [];
    return collaborators;
  }
  const getTrialWorkspaceById = (id: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchTrailWorkspace, {
      id,
    })
      .then((res: any) => {
        setTrialworkspace(res.data.trialWorkspace);
        setUnsupportedTrial(res.data?.trialWorkspace?.userTrial?.unsupported)
        const scenarioOption: any = {};
        const scenarioIds = res.data.trialWorkspace?.scenarios.map((scenario: any) => {
          scenarioOption[scenario.id] = {};
          return scenario.id;
        }) || [];
        setTrialScenarioIds(scenarioIds);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
    };
  const refreshPage = useCallback(() => {
    if (trialworkspaceId) {
      getTrialWorkspaceById(trialworkspaceId);
    }
  }, [trialworkspaceId]);
  useEffect(() => {
    if (trialworkspaceId) {
      refreshPage();
    }
    getDicionaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialworkspaceId]);
  useEffect(() => {
    getScenarioAndSummaryByIds(trialScenarioIds);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialScenarioIds])
  // useEffect(() => {
  //   const scenarios = scenarioOptionList.map((option) => option.scenario);
  //   const criteriaList: any[] = [];
  //   scenarios.forEach((scenario: any) => {
  //     scenario.scenarioCriteria.forEach((criterion: any) => {
  //       criteriaList.push(criterion);
  //     });
  //   });
  //   const tipsCriterion: any[] = [];
  //   criteriaList.forEach((criterion: any) => {
  //     const sameCriteria = criteriaList.filter((criterion1: any) => criterion1.criterionId === criterion.criterionId);
  //     const criterionCount = sameCriteria.length;
  //     if (criterionCount > 1) {
  //       if (sameCriteria.filter((sameCriterion: any) => {
  //         return (criterion.min !== sameCriterion.min || criterion.max !== sameCriterion.max || criterion.equal !== sameCriterion.equal || criterion.tempModifier !== sameCriterion.tempModifier);
  //       }).length > 0) {
  //         tipsCriterion.push(criterion);
  //       }
  //     }
  //   });
  //   setTipsCriteria(tipsCriterion);
  // }, [scenarioOptionList]);

  const criteriaData = (scenario: any, filterActivityData: SoaActivityModel[]) => {
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
      values: filterActivityData.filter((soa: any) => soa.soaVisits?.length > 0)?.map((soaObj: any) => {
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
          return <SoADisplayContainer container>
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
  const indicatorData = (ieSummary: any, soaSummary: any) => {
    const ieData = [
      {
        title: "I/E Complexity Score",
        value: ieSummary?.complexityScore || '-',
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
  const renderScenarioOption = (scenario: any, ieSummary: any, soaSummary: any) => {
    const acitvityData: SoaActivityModel[] = transferResponseToSoaActivityModelArray(scenario?.soaActivities || []);
    const filterActivityData: SoaActivityModel[] = filterSoaTaxonomyByShowChildren(acitvityData);
    return (
      <OptionsContainer>
        <OptionContainer>
          <PreviewOptionCard
            // tipsCriterion
            exportNotes={scenario.notes}
            selected={Boolean(scenario && scenario.final === true)}
            key={scenario?.id || "scenario-option"}
            title={scenario?.name || ""}
            description={scenario?.description || ""}
            author={`by ${formatUserName(scenario?.scenarioUpdatedBy?.name || "")}`}
            criteriaData={criteriaData(scenario, filterActivityData)}
            indicatorData={indicatorData(ieSummary, soaSummary)}
            handleCheck={(val: boolean) => {
              handleOptionCardSelected(val, scenario?.id);
            }}
            handleChangeExportNotes={(notes: string) => {
              handleChangeExportNotes(notes, scenario?.id);
            }}
          />
        </OptionContainer>
      </OptionsContainer>
    );
  }
  const getVisitColumnByVisitNumber = (scenarioVisits: any[], visitNumber: number, soaPeriodId: string) => {
    const columnGroups = scenarioVisits;
    const groupIndex = columnGroups.findIndex((group: any) => group.soaPeriodId === soaPeriodId && group.visitNumber === visitNumber);
    return groupIndex + 1;
  };
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
              { href: `/trial-homepage/${trialworkspaceId}`, text: "Trial Homepage" },
              { text: "Preview All Scenarios", currentPage: true },
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
      {
        scenarioOptionList.map((option: any) => renderScenarioOption(option?.scenario, option?.ieSummary, option?.soaSummary))
      }
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
// const ExportButton = styled(Button)(({ theme }) => ({
//   width: "20.5rem",
//   height: "3.938rem",
//   position: "fixed",
//   bottom: 10,
//   left: "calc(50% - 10.25rem)",
//   borderRadius: "3rem",
//   padding: "0.75rem 1.75rem",
//   fontSize: "1rem",
//   fontWeight: 500,
//   lineHeight: "1.5rem",
//   letterSpacing: 0,
// }));
export default PreviewTrialScenarios;
