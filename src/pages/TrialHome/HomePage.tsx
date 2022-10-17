import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  styled,
  Link,
  Button,
  Snackbar,
  Modal as MUIModal,
  Input,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Close } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import { TrailWorkspaceDetail } from "../../@types/TrailWorkspace";

import AppBreadcrumb from "../../components/AppBreadcrumb";
import InformationCard from "./components/InformationCard";
import ExsistingScenarioCard from "./components/ExistingScenarioCard";
import UsersContext from "../../provider/UsersContextProvider";
import HomePageSkeleton from "./components/HomePageSkeleton";
import CustomErrorBar from "../../components/CustomErrorBar";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import ReferenceTrialListModal, { ReferenceTableDataType, StatisticDataType, TableFilterType } from "./components/ReferenceTrialListModal";

import { TrialWorkspaceInputType, useUpdateWorkspace } from "../../hooks/useCreateWorkspace";
import { QueryByStringWithClient } from "../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap, ReferenceTrialSearchInputType } from "../../api/fetchByTypes";
import { useJwtInfo } from "../../hooks/JwtInfo";
import { useCreateScenario } from "../../hooks/useCreateScenario";

import { getRankByScore } from "../../utils/getDataUtil";
import { IESummaryType } from "../IE/PredictedImpact/type/IESummaryType";
import { useUpdateTrialWorkspaceReferenceTrial } from "../../hooks/useUpdateReferenceTrial";
import { unique } from "../../utils/formatUtil";
import { SoASummaryType } from "../IE/PredictedImpact/type/SoASummaryType";
import { cloneDeep as _cloneDeep } from 'lodash';
interface AttrubutesProps {
  id: string;
  name: string;
}
interface ReferenceTrial {
  id: string;
  trialAlias: string;
  nctId: string;
  therapeuticArea: string;
  phase: string;
  indications: string;
  pediatric: string;
  sponsor: string;
  approvalDate: string;
  status: string;
  studyTitle: string;
  moa: string;
  roa: string;
  internalTrial: boolean;
}
interface Statistics {
  sponsor: {
    name: string;
    count: number;
    percentage: number;
  }[]
  approvalDate: {
    name: string;
    count: number;
    percentage: number;
  }[]
}

const NewTrialHome: React.FC = () => {
  const { push } = useHistory();
  const { id: trialId }: any = useParams();
  const { updateTrial } = useUpdateWorkspace();
  const { cloneNewScenario } = useCreateScenario();
  const contextData = useContext<any>(UsersContext);
  const [error, setError] = useState<any>();
  const [showError, setShowError] = useState(true);
  const [alert, setAlert] = useState("");
  const [trialWorkspace, setTrialworkspace] = useState<
    TrailWorkspaceDetail | undefined | null
  >(null);
  const [scenarios, SetScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [studyPhases, setStudyPhases] = useState<AttrubutesProps[]>([]);
  const [studyTypes, setStudyTypes] = useState<AttrubutesProps[]>([]);
  const [indications, setIndications] = useState<AttrubutesProps[]>([]);
  const [theraPeuticAreas, setTheraPeuticAreas] = useState<AttrubutesProps[]>(
    []
  );
  const [molecules, setMolecules] = useState<AttrubutesProps[]>([]);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showReferenceTrialList, setShowReferenceTrialList] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [referenceTrialTableData, setReferenceTrialTableData] = useState<ReferenceTableDataType[]>([]);
  const [referenceTrialStatisticData, setReferenceTrialStatisticData] = useState<StatisticDataType>({ sponsor: [], date: [] });
  const [tableFilter, setTableFilter] = useState<TableFilterType>({
    sponsor: [],
    status: [],
    pediatric: [],
    date: [],
    moa: [],
    roa: [],
  })
  const [allReferenceTrials, setAllReferenceTrials] = useState<ReferenceTableDataType[]>([]);
  const [cloneModalName, setCloneModalName] = useState<any>(null);
  const [cloneScenarioId, setCloneScenarioId] = useState("");
  const [scenarioMetricsArr, setScenarioMetricsArr] = useState<any[]>([]);
  const { jwtInfo } = useJwtInfo();
  const { createTrialWorkspaceReferenceTrials } = useUpdateTrialWorkspaceReferenceTrial();

  const getUserNameById = (id: string) => {
    if (id && contextData && contextData.users) {
      const user = contextData.users.find((user: any) => user.id === id);
      if (user && user.name) {
        const result = user.name.split("-")[0];
        return result;
      }
    }
    return "";
  };
  const checkIsCollaborators = (collaborators: any[]) => {
    const index = collaborators.findIndex((collaborator: any) => collaborator.username === jwtInfo?.preferred_username);
    return index > -1;
  }
  const getAuthors = (userName: string) => {
    const name = userName.split(" -")[0] || "";
    return name;
  };
  const getTrialWorkspaceById = (id: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchTrailWorkspace, {
      id,
    })
      .then((res: any) => {
        setTrialworkspace(res.data.trialWorkspace);
      })
      .catch((error: any) => {
        console.log(error);
        handleError("There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getScenariosByTrial = (id: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchScenarios, {
      trialWorkspaceId: id,
    })
      .then((res: any) => {
        SetScenarios(res?.data?.scenarios || []);
      })
      .catch((error: any) => {
        console.log(error);
        handleError("There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const getReferenceTrialList = (params: ReferenceTrialSearchInputType) => {
    setLoading(true);
    const searchReferenceTrial = QueryByStringWithClient(graphqlStringMap.fetchReferenceTrialSearch, params);
    const fetchTrialReferenceTrial = QueryByStringWithClient(graphqlStringMap.fetchTrialReferenceTrials, { id: trialId });
    Promise.all([searchReferenceTrial, fetchTrialReferenceTrial]).then((resArr: any) => {
      const searchReferenceTrialRes = resArr[0];
      const fetchTrialReferenceTrialRes = resArr[1];
      const trialReferenceTrialArr: ReferenceTrial[] = fetchTrialReferenceTrialRes?.data?.trialWorkspace.referenceTrials || [];
      const data: ReferenceTrial[] = searchReferenceTrialRes?.data?.referenceTrialSearch.data || [];
      const statisticData: Statistics = searchReferenceTrialRes.data.referenceTrialSearch.statistics;
      const statisticDataSponsors = statisticData.sponsor?.map((sponsorItem: any) => {
        sponsorItem.value = (sponsorItem.percentage * 100).toFixed(0).toString();
        return sponsorItem;
      }) || [];
      const statisticDataDate = statisticData.approvalDate?.map((dateItem: any) => {
        dateItem.value = (dateItem.percentage * 100).toFixed(0).toString();
        return dateItem;
      }) || [];
      const referenceTrialData: ReferenceTableDataType[] = [];
      data.forEach((referenceTrial: ReferenceTrial) => {
        let includeTrial = !trialReferenceTrialArr.length
          ? true
          : trialReferenceTrialArr.findIndex((referTrial: ReferenceTrial) => referTrial.id === referenceTrial.id) > -1;
        
        if (allReferenceTrials.length) {
          includeTrial = allReferenceTrials
            .filter((referTrial) => referTrial.includeTrial)
            .findIndex((referTrial: ReferenceTableDataType) => referTrial.id === referenceTrial.id) > -1;
        }
        
        const record: ReferenceTableDataType = {
          id: referenceTrial.id,
          trialId: referenceTrial.nctId || referenceTrial.trialAlias,
          includeTrial,
          studyTitle: referenceTrial.studyTitle,
          sponsor: referenceTrial.sponsor,
          status: referenceTrial.status,
          pediatric: referenceTrial.pediatric ? "Yes" : "No",
          date: referenceTrial.approvalDate,
          moa: referenceTrial.moa || "",
          roa: referenceTrial.roa || ""
        };
        referenceTrialData.push(record);
      });

      if (
        params.input.moaList.length === 0 &&
        params.input.approvalDateList.length === 0 &&
        params.input.pediatric === undefined &&
        params.input.roaList.length === 0 &&
        params.input.sponsorList.length === 0 &&
        params.input.statusList.length === 0
      ) {
        setAllReferenceTrials(_cloneDeep(referenceTrialData));
      }

      setReferenceTrialTableData(referenceTrialData);
      const referenceTrialStatisiticData: StatisticDataType = {
        sponsor: statisticDataSponsors.sort((a, b) => b.value - a.value)
          .map((sponsorItem, index) => {
            const value = (sponsorItem.percentage * 100).toFixed(0).toString();
            return {
              itemName: sponsorItem.name !== 'null' ? sponsorItem.name : 'N/A',
              itemValue: value,
              indicator: sponsorItem.percentage ? `${value}%` : `0%`
            }
          }) || [],
        date: statisticDataDate.sort((a, b) => b.value - a.value)
          .map((dateItem, index) => {
            const value = (dateItem.percentage * 100).toFixed(0).toString();
            return {
              itemName: dateItem.name !== 'null' ? dateItem.name : 'N/A',
              itemValue: value,
              indicator: dateItem.percentage ? `${value}%` : `0%`
            }
          }) || [],
      };
      if (referenceTrialStatisiticData.sponsor.length && referenceTrialStatisiticData.sponsor.length > 5) {
        referenceTrialStatisiticData.sponsor.length = 5;
      }
      if (referenceTrialStatisiticData.date.length && referenceTrialStatisiticData.date.length > 5) {
        referenceTrialStatisiticData.date.length = 5;
      }
      setReferenceTrialStatisticData(referenceTrialStatisiticData);
      if (
        params.input.moaList.length === 0 &&
        params.input.approvalDateList.length === 0 &&
        params.input.pediatric === undefined &&
        params.input.roaList.length === 0 &&
        params.input.sponsorList.length === 0 &&
        params.input.statusList.length === 0
      ) {
        const tableData = referenceTrialData;
        const filterOptions: TableFilterType = {
          sponsor: unique(tableData.map((record: ReferenceTableDataType) => {
            return record.sponsor;
          }).filter((item) => item !== null))
          .map(item => {
            return { id: item, name: item, label: item};
          }),
          status: unique(tableData.map((record: ReferenceTableDataType) => {
            return record.status;
          }).filter((item) => item !== null))
          .map(item => {
            return { id: item, name: item, label: item};
          }),
          pediatric: unique(tableData.map((record: ReferenceTableDataType) => {
            return record.pediatric;
          }).filter((item) => item !== null))
          .map(item => {
            return { id: item, name: item, label: item};
          }),
          date: unique(tableData.map((record: ReferenceTableDataType) => {
            return record.date;
          }).filter((item) => item !== null))
          .map(item => {
            return { id: item, name: item, label: item};
          }),
          moa: unique(tableData.map((record: ReferenceTableDataType) => {
            return record.moa;
          }).filter((item) => item !== null))
          .map(item => {
            return { id: item, name: item, label: item};
          }),
          roa: unique(tableData.map((record: ReferenceTableDataType) => {
            return record.roa;
          }).filter((item) => item !== null))
          .map(item => {
            return { id: item, name: item, label: item};
          }),
        };
        setTableFilter(filterOptions);
      }
    })
    QueryByStringWithClient(graphqlStringMap.fetchReferenceTrialSearch, params)
      .then((res: any) => {
        const data: ReferenceTrial[] = res.data.referenceTrialSearch.data;
        const statisticData: Statistics = res.data.referenceTrialSearch.statistics;
        const referenceTrialData: ReferenceTableDataType[] = [];
        data.forEach((referenceTrial: ReferenceTrial) => {
          const record: ReferenceTableDataType = {
            id: referenceTrial.id,
            trialId: referenceTrial.nctId || referenceTrial.trialAlias,
            includeTrial: referenceTrial.internalTrial,
            studyTitle: referenceTrial.studyTitle,
            sponsor: referenceTrial.sponsor,
            status: referenceTrial.status,
            pediatric: referenceTrial.pediatric ? "Yes" : "No",
            date: referenceTrial.approvalDate,
            moa: referenceTrial.moa || "",
            roa: referenceTrial.roa || ""
          };
          referenceTrialData.push(record);
        });
        setReferenceTrialTableData(referenceTrialData);
        const referenceTrialStatisiticData: StatisticDataType = {
          sponsor: statisticData.sponsor?.sort((a, b) => a.name.localeCompare(b.name))?.map((sponsorItem, index) => {
              const value = (sponsorItem.percentage * 100).toFixed(0).toString();
              return {
                itemName: sponsorItem.name,
                itemValue: value,
                indicator: index < 2 ? (sponsorItem.percentage ? `${value}%` : `0%`) : undefined
              }
            }) || [],
          date: statisticData.approvalDate?.sort((a, b) => a.name.localeCompare(b.name))?.map((dateItem, index) => {
              const value = (dateItem.percentage * 100).toFixed(0).toString();
              return {
                itemName: dateItem.name,
                itemValue: value,
                indicator: index < 2 ? (dateItem.percentage ? `${value}%` : `0%`) : undefined
              }
            }) || [],
        };
        setReferenceTrialStatisticData(referenceTrialStatisiticData);
      })
      .catch((error: any) => {
        console.log(error);
        handleError("There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const getDictionaries = () => {
    fetchByGraphqlString(graphqlStringMap.fetchAllDictionaries)
      .then((res: any) => {
        const phases = res.data?.phases || [];
        const studyTypes = res.data?.studyTypes || [];
        const indications = res.data?.indications || [];
        const therapeuticAreasDic = res.data?.therapeuticAreas || [];
        const molecules = res.data?.molecules || [];
        setMolecules(molecules);
        setStudyPhases(phases);
        setStudyTypes(studyTypes);
        setIndications(indications);
        setTheraPeuticAreas(therapeuticAreasDic);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const handleFilterReferenceTrials = (filterValues: { name: string, value: any[] }[], trialId: string) => {
    const params: ReferenceTrialSearchInputType = {
      input: {
        trialWorkspaceId: trialId,
        sponsorList: [],
        statusList: [],
        pediatric: undefined,
        approvalDateList: [],
        moaList: [],
        roaList: [],
      }
    }
    filterValues.forEach(({ name, value }) => {
      switch (name) {
        case "sponsor":
          params.input.sponsorList = value || [];
          break;
        case "status":
          params.input.statusList = value || [];
          break;
        case "pediatric":
          params.input.pediatric = value && value.length === 1 ? value[0] === "Yes" : undefined;
          break;
        case "date":
          params.input.approvalDateList = value || [];
          break;
        case "moa":
          params.input.moaList = value || [];
          break;
        case "roa":
          params.input.roaList = value || [];
          break;
      }
    });
    getReferenceTrialList(params);
  };
  const handleUpdateReferenceTrial = (trialId: string) => {
    setTableLoading(true);
    createTrialWorkspaceReferenceTrials({
      input: {
        trialWorkspaceId: trialId,
        referenceTrialIds: allReferenceTrials.filter((row) => row.includeTrial).map((row) => row.id),
      }
    }).then((res: any) => {
        handleFilterReferenceTrials([], trialId);
    }).catch((error: any) => {
      console.log(error);
      const errorMessage = error.message ? error.message : "System Error";
      handleError(errorMessage);
    }).finally(() => {
      setTableLoading(false);
      setShowReferenceTrialList(false);
    })
  }
  useEffect(() => {
    if (trialId) {
      getTrialWorkspaceById(trialId);
      getScenariosByTrial(trialId);
      const params = {
        input: {
          trialWorkspaceId: trialId,
          sponsorList: [],
          statusList: [],
          pediatric: undefined,
          approvalDateList: [],
          moaList: [],
          roaList: [],
        }
      }
      getReferenceTrialList(params);
    }
    getDictionaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialId]);
  useEffect(() => {
    if (scenarios.length > 0) {
      const requests = scenarios.map((scenario: any) =>
        QueryByStringWithClient(graphqlStringMap.fetchScenarioSummary, { id: scenario.id })
      );
      const scenariosMetrics: any = [];
      Promise.all(requests)
        .then((resArr) => {
          resArr.forEach((res: any, index) => {
            const ieSummary: IESummaryType = res.data.ieSummary;
            const soaSummary: SoASummaryType = res.data.soaSummary;
            const screenFailureInfo: any = {
              degree: getRankByScore(
                ieSummary?.screenFailure.scenario,
                ieSummary?.screenFailure.tertiles,
                ["Good", "Fair", "Poor"]
              ),
              score: ieSummary?.screenFailure.scenario,
            };
            const protocolAmendment = {
              degree: getRankByScore(
                ieSummary?.protocolAmendment.scenario,
                ieSummary?.protocolAmendment.tertiles,
                ["Good", "Fair", "Poor"]
              ),
              score: ieSummary?.protocolAmendment.scenario,
            };
            const complexity = {
              degree: getRankByScore(
                ieSummary?.complexityScore.scenario,
                ieSummary?.complexityScore.tertiles,
                ["Good", "Fair", "Poor"]
              ),
              score: ieSummary?.complexityScore.scenario,
            };
            const overallCostPerPatient = soaSummary?.totalCost;
            scenariosMetrics.push({
              ieComplexityScoreRank: complexity.degree,
              ieComplexityScore: complexity.score,
              screenFailureRateRank: screenFailureInfo.degree,
              screenFailureRate: screenFailureInfo.score,
              protocolAmendmentRank: protocolAmendment.degree,
              protocolAmendment: protocolAmendment.score,
              overallCostPerPatient,
            });
          });
          setScenarioMetricsArr(scenariosMetrics);
        })
        .catch((errors) => {
          console.log(errors);
          // setSysError("There was an error, please try again");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [scenarios]);
  const refreshPage = () => {
    getTrialWorkspaceById(trialId);
    getScenariosByTrial(trialId);
    const params = {
      input: {
        trialWorkspaceId: trialId,
        sponsorList: [],
        statusList: [],
        pediatric: undefined,
        approvalDateList: [],
        moaList: [],
        roaList: [],
      }
    }
    getReferenceTrialList(params);
    getDictionaries();
  }
  const trialAuthors = getAuthors(
    trialWorkspace?.trialUpdatedBy?.name || ""
  );
  const formatTime = (timestring?: string) => {
    if (timestring) {
      const date = new Date(timestring);
      const timeString = date.toLocaleTimeString().replace(/:\d+ /, " ");
      const result = `${date.toDateString()} ${timeString}`;
      return result;
    }
    return "";
  };
  const userTrialTime = formatTime(trialWorkspace?.userTrial.updatedAt);
  const handleCompareScenarios = () => {
    push(`/compare-scenario/${trialId}`);
  };
  const handleCloseErrorTips = () => {
    setShowError(false);
  };
  const handleAddNewScenario = () => {
    if (trialId) {
      push(`/new-trial-detail/scenario?workspaceId=${trialId}`);
    }
  };
  const handleViewReferenceTrials = () => {
    setShowReferenceTrialList(true);
  };
  const handleModifyTrialworkspace = (values: { [x: string]: any }) => {
    const {
      trialTitle,
      trialDescription,
      trialAlias,
      indication,
      studyType,
      studyPhase,
      therapeuticArea,
      pediatricStudy,
      collaborators,
      molecule,
      moleculeName,
      duration,
    } = values;
    const durationValue = duration !== undefined ? parseInt(duration) : duration;
    const moleculeId = molecule ? molecule : null;
    const params: TrialWorkspaceInputType = {
      input: {
        id: trialId,
        userTrial: {
          trialTitle: trialTitle,
          trialDescription: trialDescription,
          trialAlias: trialAlias,
          therapeuticAreaId: therapeuticArea,
          indicationId: indication?.length > 0 ? indication[0] : "",
          phaseId: studyPhase,
          studyTypeId: studyType,
          pediatricStudy: pediatricStudy === "Yes",
          moleculeId: moleculeName ? undefined : moleculeId,
          moleculeName: moleculeName,
          duration: durationValue,
        },
        users: collaborators,
      },
    }

    // If user ads indication manually remove indicationId and add otherIndication
    const existingIndication = indications.some(i => i.id === indication.toString())
    if(!existingIndication) {
      params.input.userTrial = {
        ...params.input.userTrial,
        otherIndication: indication.toString() || undefined,
      }

      delete params.input.userTrial.indicationId
    }

    updateTrial(params)
      .then((res: any) => {
        setAlert("Changes have been saved successfully");
      })
      .catch((error: any) => {
        console.log(error);
        const errorMessage = error.message ? error.message : "System Error";
        handleError(errorMessage);
      });
  };
  const handleCloneScenario = () => {
    const scenarioId = cloneScenarioId;
    setShowCloneModal(false);
    setLoading(true);
    const params = cloneModalName ? {
      id: scenarioId,
      name: cloneModalName
    } : {
      id: scenarioId
    }
    cloneNewScenario(params).then((res: any) => {
      refreshPage();
    }).catch((error: any) => {
      console.log(error);
      handleError("There was an error, please try again");
    }).finally(() => {
      setCloneScenarioId("");
      setCloneModalName(null);
      setLoading(false);
    });
  };
  const handleExportScenario = (scenarioId: string) => {
    const url = `${window.location.origin}/print-preview-scenario/${scenarioId}`;

    window.open(url);
  }
  const handleError = (e: string) => {
    setError(e);
  };
  const renderSkeleton = () => {
    return (
      <Frame>
        <HomePageSkeleton amount={10} />
      </Frame>
    );
  };
  const renderDataPage = () => {
    const unsupportedTrial = trialWorkspace?.userTrial?.unsupported;
    const filtredIndications = indications.filter(
      (indication: any) => indication.userDefined === false
    ) || [];

    return (
      <>
        <BreadcrumbContainer>
          <AppBreadcrumb
            links={[
              { href: "/", text: "" },
              { text: "Trial Homepage", currentPage: true },
            ]}
          />
        </BreadcrumbContainer>
        <CustomLoading open={loading} />
        <Title variant="h3">
          {trialWorkspace?.userTrial.trialTitle || "-"}
        </Title>
        <SaveTime>{`Last Saved ${userTrialTime} By ${trialAuthors}`}</SaveTime>
        <Information>
          <InformationCard
            title="General Information"
            description={trialWorkspace?.userTrial.trialDescription}
            therapeuticArea={trialWorkspace?.userTrial?.therapeuticArea?.id}
            indication={trialWorkspace?.userTrial?.indicationId}
            indications={indications}
            studyPhase={trialWorkspace?.userTrial.phase?.id}
            studyType={trialWorkspace?.userTrial?.studyType?.id}
            trialTitle={trialWorkspace?.userTrial.trialTitle}
            duration={trialWorkspace?.userTrial.duration}
            pediatricStudy={
              trialWorkspace?.userTrial.pediatricStudy ? "Yes" : "No"
            }
            molecule={trialWorkspace?.userTrial.molecule?.id}
            collaborators={
              trialWorkspace?.users || []
            }
            trialAlias={trialWorkspace?.userTrial?.trialAlias}
            phaseOptions={studyPhases}
            studyTypeOptions={studyTypes}
            indicationOptions={filtredIndications}
            therapeuticAreasOptions={theraPeuticAreas}
            moleculeOptions={molecules}
            users={contextData?.users || []}
            dataVersion={trialWorkspace?.dataVersion?.name || ""}
            handleSubmit={handleModifyTrialworkspace}
            handleError={handleError}
            handleRefresh={() => refreshPage()}
          />
        </Information>
        <ExistingScenariosContainer>
          <ExistingScenarioHeader>
            <ExistingScenariosHeaderTitle>
              Existing Scenarios
            </ExistingScenariosHeaderTitle>
            <ExistingScenariosHeaderLinkButton href="#" underline="always" onClick={() => { push(`/preview-trial-scenarios/${trialId}`) }}>
              Preview All
            </ExistingScenariosHeaderLinkButton>
          </ExistingScenarioHeader>
          {scenarios?.map((scenario, index) => {
            const scenarioOwnerUserName = getUserNameById(
              scenario.scenarioUpdatedById
            );
            return (
              <ExsistingScenarioCard
                key={index}
                isFinal={scenario.final}
                title={scenario.name}
                author={scenarioOwnerUserName}
                description={scenario.description}
                time={scenario.updatedAt}
                id={scenario.id}
                trialImpactMatrics={scenarioMetricsArr[index]}
                handleCloneScenario={() => {
                  setCloneScenarioId(scenario.id);
                  setShowCloneModal(true);
                }}
                handleExportScenario={() => handleExportScenario(scenario.id)}
              />
            );
          })}
          <AddButton
            disabled={!checkIsCollaborators(trialWorkspace?.users || [])}
            variant="outlined"
            onClick={handleAddNewScenario}>
            Add New Scenario
          </AddButton>
          {!unsupportedTrial && <ViewReferencedTrialButton
            variant="outlined"
            onClick={handleViewReferenceTrials}
          >
            View Reference Trials
          </ViewReferencedTrialButton>}
        </ExistingScenariosContainer>
        {
          scenarios && scenarios.length > 0 && !unsupportedTrial && (
            <CreateButton
              variant="contained"
              color="primary"
              onClick={handleCompareScenarios}
            >
              Compare Scenarios
            </CreateButton>
          )
        }
      </>
    );
  };
  return (
    <Frame>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(error) && showError}
        onClose={handleCloseErrorTips}
        autoHideDuration={6000}
      >
        <Alert onClose={handleCloseErrorTips} severity="error">
          {error ? error : "There was an error, please try again"}
        </Alert>
      </Snackbar>
      <CustomErrorBar
        open={Boolean(alert)}
        content={alert}
        isSuccess
        onClose={() => setAlert("")}
      />
      <Modal
        open={showCloneModal}
        onClose={() => {
          setCloneModalName(null);
          setCloneScenarioId("");
          setShowCloneModal(false);
        }}>
        <CustomModalWrapper>
          <CustomModalDataContainer>
            <CustomModalHeading>
              <CloseIcon
                tabIndex={0}
                onClick={() => {
                  setCloneModalName(null);
                  setCloneScenarioId("");
                  setShowCloneModal(false);
                }}
                onKeyPress={() => {
                  setCloneModalName(null);
                  setCloneScenarioId("");
                  setShowCloneModal(false);
                }}
              />
            </CustomModalHeading>
            <ModalContentWraper>
              <Grid>
                <label>Clone Scenario Name:</label>
                <Input id="clone-scenario-name" value={cloneModalName} onChange={(e) => setCloneModalName(e.target.value)} />
              </Grid>
            </ModalContentWraper>
            <Grid style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px"
            }}>
              <CloneScenarioButton
                disabled={!Boolean(cloneModalName)}
                variant="outlined"
                onClick={handleCloneScenario}>
                Clone Scenario
              </CloneScenarioButton>
            </Grid>
          </CustomModalDataContainer>
        </CustomModalWrapper>
      </Modal>
      <ReferenceTrialListModal
        open={showReferenceTrialList}
        tableLoading={tableLoading}
        tableData={referenceTrialTableData}
        statisticData={referenceTrialStatisticData}
        tableFilter={tableFilter}
        title="Reference Trials List"
        handleFilterChange={(filterValues) => {
          handleFilterReferenceTrials(filterValues, trialId);
        }}
        handleUpdateReferenceTrial={() => handleUpdateReferenceTrial(trialId)}
        onClose={() => {
          handleFilterReferenceTrials([], trialId);
          setShowReferenceTrialList(false);
        }}
        handleUpdateCheckbox={(id: string) => {
          setAllReferenceTrials(allReferenceTrials.map((row) => {
            if (id === row.id) {
              row.includeTrial = !row.includeTrial;
            }
            
            return row;
          }));
          setReferenceTrialTableData(referenceTrialTableData.map((row) => {
            if (id === row.id) {
              row.includeTrial = !row.includeTrial;
            }
            
            return row;
          }));
        }}
      />
      <Container>{loading ? renderSkeleton() : renderDataPage()}</Container>
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
  paddingBottom: "3rem",
});
const CloneScenarioButton = styled(Button)({
  width: "195px",
  height: "38px",
  borderRadius: "20px",
  borderWidth: "1px !important",
  fontWeight: 500,
  padding: "6px 32px",
  backgroundColor: "#FFF",
  lineHeight: "1.188rem",
})
const CloseIcon = styled(Close)(({ theme }) => ({
  borderRadius: 20,
  outline: "none",
  "&&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
  "&&:focus": {
    backgroundColor: theme.palette.grey[200],
  },
  cursor: "pointer",
  float: "right",
  position: "relative",
  top: "8px",
  fontSize: "30px",
}));

const Modal = styled(MUIModal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const CustomModalWrapper = styled("div")({
  width: 400,
  height: 250,
  border: "1px solid #DDDDDD",
  boxShadow: "0 1px 5px 0 rgba(0,0,0,0.12)",
  backgroundColor: "#ffffff",
  padding: "1rem 2rem",
  borderRadius: 12,
});
const CustomModalDataContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});
const CustomModalHeading = styled("div")({
  color: "#252525",
  fontSize: 30,
  letterSpacing: "0.15px",
  marginTop: "1rem",
  fontWeight: 500,
});
const ModalContentWraper = styled(Grid)({
  color: "#252525",
  letterSpacing: "0.15px",
  marginTop: "1rem",
  fontWeight: 500,
})

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
});
const ExistingScenariosContainer = styled("div")({
  marginTop: "3.306rem",
});
const ExistingScenarioHeader = styled(Grid)({
  borderBottom: "1px solid #D5D2CA",
  display: "flex",
  justifyContent: "space-between",
  paddingBottom: "0.625rem",
  marginBottom: "1.625rem",
});
const ExistingScenariosHeaderTitle = styled(Typography)({
  textTransform: "uppercase",
  color: "#666666",
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.094rem",
  lineHeight: "1rem",
});
const ExistingScenariosHeaderLinkButton = styled(Link)({
  color: "#D52B1E",
  lineHeight: "1rem",
});
const AddButton = styled(Button)({
  width: "195px",
  height: "38px",
  borderRadius: "20px",
  borderWidth: "1px !important",
  fontWeight: 500,
  padding: "6px 32px",
  backgroundColor: "#FFF",
  marginRight: "20px",
  marginBottom: "5rem",
  lineHeight: "1.188rem",
});
const CreateButton = styled(Button)(({ theme }) => ({
  borderRadius: "3rem",
  margin: "auto",
  left: 0,
  right: 0,
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  lineHeight: "1.313rem",
  letterSpacing: "normal",
  color: "#FFF",
  width: "20.5rem",
  height: "3.938rem",
  position: "fixed",
  bottom: "1.688rem",
}));
const ViewReferencedTrialButton = styled(AddButton)({
  padding: "6px 20px"
});

export default NewTrialHome;
