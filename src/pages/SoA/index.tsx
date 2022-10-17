import React, { useState, useEffect, Profiler } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router";
import { Grid, styled } from "@material-ui/core";
import CustomTabBar from "../../components/CustomTabBar";
import SoACriteriaBuilder from "./SoACriteriaBuilder";
import SoAHistoricalSummary from "./SoAHistoricalSummary";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import { ActivityCategoryModel } from "./type/ActivityCategory";
import { ActivityModel } from "./type/Activity";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../components/CustomErrorBar";
import { QueryByStringWithClient } from "../../api/apollo";
import { useCreateVisits } from "../../hooks/useUpdateVisits/use-create-visits";
import { useDeleteVisits } from "../../hooks/useUpdateVisits/use-delete-visits";
import { useCreateSoAActivity } from "../../hooks/useUpdateActivity/use-create-soa-activity";
import { SoaActivityModel } from "./type/SoaActivity";
import { SoaVisitInput, UpdateSoaActivityVisitsDctCapabilityInputObjectType, useSoaActivityVisits } from "../../hooks/useUpdateSoAActiviyVisits/use-soa-activity-visits";
import { useDeleteSoAActivity } from "../../hooks/useUpdateActivity/use-delete-soa-activity";
import { useUpdateSoAActivity } from "../../hooks/useUpdateActivity/use-update-soa-activity";
import { CustomSoAFormModal } from "./components/CustomSoAModal";
import { useCreateSoA } from "../../hooks/useCreateSoA/use-create-soa";
import { ScenarioDetail } from "../../@types/ScenarioDetail";
import { formatTime, formatUserName, getDownloadFileFromBase64Data } from "../../utils/getDataUtil";
import { DctCapabilityRelation, SoaActivityVisitCapability } from "./type/DctCapabilityRelation";
import { filterSoaTaxonomyByShowChildren } from "../../utils/SoAUtils";
import { SelectedTrialLevelCapability } from "./components/TrialLevelCapabilitiesCard";
import { useUpdateScenario } from "../../hooks/useCreateScenario";
const SoA: React.FC = () => {
  const { type, workspaceId, scenarioId }: any = useParams();
  const { push } = useHistory();
  const tabTitles = ["SoA Builder", "SoA Historical Summary"];
  const tabTypes = ["criteriaBuilder", "historicalSummary"]
  const tabs = [
    {
      title: tabTitles[0],
      type: tabTypes[0],
    },
    {
      title: tabTitles[1],
      type: tabTypes[1],
    },
  ];
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [currentTabTitle, setCurrentTabTitle] = useState(tabTitles[0]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [activityCategories, setActivityCategories] = useState<
    ActivityCategoryModel[]
  >([]);
  const [activities, setActivities] = useState<ActivityModel[]>([]);
  const [historicalActivities, setHistoricalActivities] = useState<ActivityModel[]>([]);
  const [selectedVisits, setSelectedVisits] = useState(0);
  const [summaryInfo, setSummaryInfo] = useState<{ avgActivities: any, avgVisits: any }>();
  const [soaActivities, setSoaActivities] = useState<SoaActivityModel[]>([]);
  const [soaActivitiesWithVisits, setSoaActivitiesWithVisits] = useState<SoaActivityModel[]>([]);
  const [soaVisits, setSoaVisits] = useState<any[]>([]);
  const [soaPeriods, setSoaPeriods] = useState<any[]>([]);
  const [customSoA, setCustomSoA] = useState<{
    activityCategoryName: string,
    activityCategoryId: string,
    userDefinedActivityName: string,
    scenarioId: string,
  }>();
  const [editCustomSoA, setEditCustomSoA] = useState<{
    activityName: string,
    activityId: string,
    cost: any,
    scenarioId: string,
  }>();
  const { addCustomScenarioSoA } = useCreateSoA();
  const { createSoaVisit } = useCreateVisits();
  const { deleteSoaVisit } = useDeleteVisits();
  const { createSoaActivity } = useCreateSoAActivity();
  const { deleteSoaActivity } = useDeleteSoAActivity();
  const {
    updateSoaVisit,
    updateSoaActivityVisitsDctCapability
  } = useSoaActivityVisits();
  const { updateUserDefinedActivity, updateUserDefinedActivityCost, updateSoaTaxonomies, } = useUpdateSoAActivity();
  const [queryLoadingCount, setQueryLoadingCount] = useState(0);
  const [scenario, setScenario] = useState<ScenarioDetail>();
  const [internalTrialsCount, setInternalTrialsCount] = useState<number>(0);
  const [dctCapabilities, setDctCapabilities] = useState<any[]>([]);
  const [soaDctCapabilityRelations, setSoaDctCapabilityRelations] = useState<DctCapabilityRelation[]>([]);
  const [activityVisitCapabilities, setActivityVisitCapabilities] = useState<SoaActivityVisitCapability[]>([]);
  const [unsupportedTrial, setUnsupportedTrial] = useState<Boolean>(false);
  const [trialIndication, setTrialIndication] = useState<string>('');
  const { UpdateScenario } = useUpdateScenario();

  const addQueryLoadingCount = () => {
    const count = queryLoadingCount + 1;
    setQueryLoadingCount(count);
  };
  const reduceQueryLoadingCount = () => {
    const count = queryLoadingCount - 1 < 0 ? 0 : queryLoadingCount - 1;
    setQueryLoadingCount(count);
  };
  const getDctCapabilitiesAndRelations = () => {
    fetchByGraphqlString(graphqlStringMap.fetchCapabilityAndRelations)
      .then((res: any) => {
        const relations = res?.data?.soaTaxonomyDctCapabilities || []
        const dctCapabilities = res?.data?.dctCapabilities;
        setSoaDctCapabilityRelations(relations);
        setDctCapabilities(dctCapabilities);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const fetchScenario = () => {
    addQueryLoadingCount();
    QueryByStringWithClient(graphqlStringMap.fetchSoAActivityVisitsCapabilitiesAndScenario, { id: scenarioId })
      .then((res: any) => {
        const scenario = res.data?.scenario;
        const soaActivityVisitsDctCapabilities = res.data?.soaActivityVisits;
        if (scenario) {
          const dataVersion = scenario?.trialWorkspace?.dataVersion?.name;
          const dataVersionId = scenario?.trialWorkspace?.dataVersion?.id;
          const userDefinedIndication = scenario?.trialWorkspace?.userTrial?.unsupported;
          const visits = scenario.soaVisits || [];
          const soaActivityArray = scenario.soaActivities
            .map((soaActivity: any) => {
              if (soaActivity.activity === null && soaActivity.soaTaxonomy) {
                const activity: any = {
                  id: soaActivity.soaTaxonomy.id,
                  name: soaActivity.soaTaxonomy.name,
                  userDefined: "false",
                  cost: soaActivity.soaTaxonomy.activityCost,
                  activityCategoryId: soaActivity.soaTaxonomy.activityCategoryId,
                  isChild: false,
                  parentId: null,
                  isParent: soaActivity.soaTaxonomy.isParent,
                  standardComment: soaActivity.soaTaxonomy.standardComment,
                };
                if (soaActivity.soaTaxonomy.name.split(".").length > 1) {
                  activity.isChild = true;
                  soaActivity.isChild = true;
                  const parentName = soaActivity.soaTaxonomy.name.split(".")[0];
                  const parents = scenario.soaActivities.filter((soaActivity: any) => soaActivity.soaTaxonomy?.name === parentName);
                  if (parents.length > 0) {
                    activity.parentId = parents[0].soaTaxonomy.id;
                    soaActivity.parentId = parents[0].id;
                  }
                }
                soaActivity.activity = activity;
              };
              return soaActivity;
            }) || [];
          setSelectedVisits(scenario.soaVisits?.length || 0);
          setSoaActivities(soaActivityArray);
          const soaWithVisits = filterSoaTaxonomyByShowChildren(soaActivityArray
            .filter((soa: any) => soa.soaVisits?.length > 0));
          setSoaActivitiesWithVisits(soaWithVisits);
          setSoaVisits(visits);
          setScenario(scenario);
          if (soaActivityVisitsDctCapabilities) {
            setActivityVisitCapabilities(soaActivityVisitsDctCapabilities);
          }
          fetchPeriodsAndCategoriesAndActivities(dataVersion, dataVersionId);
          setUnsupportedTrial(userDefinedIndication);
          setTrialIndication(scenario?.trialWorkspace?.userTrial?.indication?.name);
        }
      })
      .catch((error: any) => {
        setSysError("There was an error, please try again");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        reduceQueryLoadingCount();
      });
  };
  const fetchActivityVisitsCapabilities = () => {
    addQueryLoadingCount();
    return QueryByStringWithClient(graphqlStringMap.fetchSoAActivityVisitsCapabilities, { id: scenarioId })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        reduceQueryLoadingCount();
      });
  };
  const fetchInternalTrialsCount = () => {
    addQueryLoadingCount();
    QueryByStringWithClient(graphqlStringMap.fetchSoaSummaryInternalTrialsCount, { id: scenarioId })
      .then((res: any) => {
        const trialCount = res.data?.soaSummary.internalRelatedTrialsCount;
        if (trialCount !== null || trialCount !== undefined) {
          setInternalTrialsCount(trialCount);
        }
      })
      .catch((error: any) => {
        setSysError("There was an error, please try again");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        reduceQueryLoadingCount();
      });
  };
  const fetchPeriodsAndCategoriesAndActivities = (dataVersion: string, dataVersionId: string) => {
    addQueryLoadingCount();
    QueryByStringWithClient(graphqlStringMap.fetchActivityAndCategoriesAndPeriods, { dataVersionId })
      .then((res: any) => {
        const activityCategories = res.data?.activityCategories || [];
        const soaPeriods = res.data?.soaPeriods || [];
        const activities = res.data?.activities || [];
        const soaTaxonomy = res.data?.soaTaxonomy;
        const taxonomyActivities = soaTaxonomy.map((item: any) => {
          const result: any = {
            id: item.id,
            name: item.name,
            archived: item.archived,
            userDefined: false,
            cost: item.activityCost,
            activityCategoryId: item.activityCategoryId,
            activityCategory: {
              id: item.activityCategoryId,
              name: item.category
            },
            isParent: item.isParent,
          }
          if (!item.isParent) {
            if (item.name.split(".").length > 1) {
              const parentTaxonomy = soaTaxonomy.filter((taxonomy: any) => taxonomy.isParent);
              const parent = parentTaxonomy.find((parent: any) => parent.name === item.name.split(".")[0]);
              if (parent) {
                result.parentId = parent.id
              }
            }
          }
          return result;
        });

        setActivityCategories(activityCategories);
        setSoaPeriods(soaPeriods);
        if (dataVersion === "1.0.0" || dataVersion === undefined || dataVersion === null) {
          setActivities(activities);
        } else {
          const userDefinedActivitiesR2 = activities.filter(
            (activity: any) => activity.userDefined && activity.dataVersion !== '1.0.0'
          );
          setActivities([...taxonomyActivities, ...userDefinedActivitiesR2]);
        }
      })
      .catch((error: any) => {
        setSysError("fetch category and periods");
      })
      .finally(() => {
        setLoading(false);
        reduceQueryLoadingCount();
      });
  }
  const getPageData = () => {
    setLoading(true);
    fetchScenario();
  };
  const getHistoryActicity = () => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchHistoricalActivities, {
      id: scenarioId,
    })
      .then((res: any) => {
        const result = res.data?.historicalActivities;
        const historyActivities = result?.activities.map((activity: any) => {
          return {
            id: activity.id,
            name: activity.name,
            userDefined: "false",
            cost: activity.activityCost,
            appears: activity.appears,
            frequency: activity.frequency,
            visitFrequency: activity.visitFrequency,
            activityCategoryId: activity.activityCategoryId,
          }
        }) || [];

        setSummaryInfo({
          avgActivities: result?.avgActivities,
          avgVisits: result?.avgVisits
        })
        setHistoricalActivities(historyActivities);
      })
      .catch((e: any) => {
        setSysError("There was an error, please try again");
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleCreateSoaActivity = (inputArray: { scenarioId: string, activityId: string }[]) => {
    const args = {
      input: inputArray
    };
    callUpdateFunction(
      args,
      createSoaActivity,
      "There was an error, please try again",
      getPageData
    );
  };

  const handleAddCustomSoA = (scenarioId: string, activityName: string, categoryId: string, categoryName: string) => {
    setCustomSoA({
      activityCategoryName: categoryName,
      activityCategoryId: categoryId,
      userDefinedActivityName: activityName,
      scenarioId,
    })
  }
  const handleUpdateUserCustomSoACost = (scenarioId: string, activityId: string, activityName: any, cost: any) => {
    setEditCustomSoA({
      scenarioId,
      activityId,
      activityName,
      cost
    });
  }
  const handleUpdateUserdefinedActivity = (activityId: string, newCategoryId: string, nextAction: Function) => {
    const args = {
      input: {
        id: activityId,
        activityCategoryId: newCategoryId
      }
    };
    callUpdateFunction(
      args,
      updateUserDefinedActivity,
      "There was an error, please try again",
      nextAction
    );
  }
  const handleDeleteSoaActivity = (ids: string[]) => {
    const args = { ids };
    callUpdateFunction(
      args,
      deleteSoaActivity,
      "There was an error, please try again",
      getPageData
    );
  };
  const handleUpdateSoaTaxonomies = (taxonomyId: any, standardComment: any) => {
    const args = {
      input: [{
        id: taxonomyId,
        standardComment,
      }]
    };
    return callUpdateFunction(args, updateSoaTaxonomies, "Update taxonomy Failed", fetchScenario);
  }
  const handleUpdateSoaTaxonomyCapability = (inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[]) => {
    const args = {
      input: inputArray
    };
    return callUpdateFunction(args, updateSoaActivityVisitsDctCapability, "Update dct capabilities failed.");
  }
  const handleUpdateAllSoaTaxonomyCapability = (inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[]) => {
    const args = {
      input: inputArray
    };
    return callUpdateFunction(args, updateSoaActivityVisitsDctCapability, "Update all dct capabilities failed.");
  }
  const handleUpdateScenarioCapability = (selectedCapabilities: SelectedTrialLevelCapability[]) => {
    const args = {
      input: {
        id: scenarioId,
        trialWorkspaceId: scenario?.trialWorkspaceId || "",
        dctCapabilities: selectedCapabilities.map((capability: SelectedTrialLevelCapability) => capability.dctCapabilityId)
      }
    };
    return callUpdateFunction(args, UpdateScenario, "Update scenario capability failed.");
  }
  const handleCreateVisit = (
    scenarioId: string,
    visitNumber: any,
    soaPeriodId: string
  ) => {
    setLoading(true);
    return createSoaVisit({
      input: [
        {
          scenarioId: scenarioId,
          soaPeriodId: soaPeriodId,
          visitNumber: visitNumber,
          weekNum: 0,
        },
      ],
    })
      .catch((error: any) => {
        setSysError(error.message);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDeleteVisit = (visitId: string) => {
    setLoading(true);
    const args = {
      ids: [visitId],
    };
    return deleteSoaVisit(args)
    .catch((error: any) => {
      setSysError(error.message || "Delete SoA Visits Error!");
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    })
  };
  const handleUpdateSoaVisit = (input: SoaVisitInput) => {
    const args = {
      input,
    };
    return callUpdateFunction(args, updateSoaVisit, "Update SoA Visit Error!", fetchScenario);
  }

  const updateCustomSoACost = (editSoA: {
    id: any;
    cost: any;
  }) => {

    const args = {
      input: editSoA
    };
    callUpdateFunction(
      args,
      updateUserDefinedActivityCost,
      "Update Custom Activity Cost Error!",
      () => {
        setEditCustomSoA(undefined);
        getPageData();
      }
    );
  };
  const addCustomSoA = (customSoA: {
    activityCategoryId: string;
    userDefinedActivityName: string;
    cost: number;
    scenarioId: string;
  }) => {
    const args = {
      input: customSoA
    };
    callUpdateFunction(
      args,
      addCustomScenarioSoA,
      "Add Custom Activity Error !",
      () => { setCustomSoA(undefined); getPageData() }
    );
  }
  const callUpdateFunction = (
    args: any,
    serverFunction: Function,
    sysErrorString: string,
    successCallback?: Function,
    hideLoading?: boolean,
  ) => {
    if (!hideLoading) {
      setLoading(true);
    }
    return serverFunction(args)
      .then((res: any) => {
        successCallback && successCallback();
      })
      .catch((error: any) => {
        setSysError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const downloadSoA = (scenarioId: string) => {
    if (scenarioId) {
      QueryByStringWithClient(graphqlStringMap.fetchExportSoA, { id: scenarioId })
        .then((res: any) => {
          if (res.data.exportSoa) {
            const { base64data, contentType, filename } = res.data.exportSoa;
            getDownloadFileFromBase64Data(base64data, contentType, filename);
          }
        });
    }
  };
  useEffect(() => {
    const tabTitle = tabs.find((tab) => tab.type === type)?.title;
    const tabIndex = tabs.findIndex(tab => tab.type === type);
    setCurrentTabTitle(tabTitle || currentTabTitle);
    setCurrentTabIndex(tabIndex > -1 ? tabIndex : 0);
    getPageData();
    getHistoryActicity();
    fetchInternalTrialsCount();
    getDctCapabilitiesAndRelations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, scenarioId]);
  return (
    <>
      <CustomTabBar
        hasBackButton
        isBlackTheme
        tabTitles={tabTitles}
        tabValue={currentTabIndex}
        changeTabValue={(value: number) => {
          const newType = tabs[value]?.type;
          if (newType) {
            push(`/SoA/${newType}/${workspaceId}/${scenarioId}`);
          }
        }}
      />
      <Container>
        <CustomLoading open={loading} />
        <CustomErrorBar
          open={Boolean(sysError)}
          content={sysError}
          onClose={() => {
            setSysError("");
          }}
        />
        {currentTabTitle === "SoA Builder" ? (
          <>
            <Profiler id="soa-builder-profiler" onRender={(
              id,
              phase, 
              actualDuration, 
            ) => {
              // console.log(`${id}-${phase}-${actualDuration}`);
            }}>
              <SoACriteriaBuilder
                loadingData={queryLoadingCount > 0}
                activities={activities}
                activityCategories={activityCategories}
                historicalActivities={historicalActivities}
                lastSavedAuthor={formatUserName(scenario?.soaUpdatedBy?.name || "")}
                lastSavedTime={formatTime(scenario?.soaUpdatedAt || "")}
                soaPeriods={soaPeriods}
                scenarioVisits={soaVisits}
                scenarioActivities={soaActivities}
                scenarioId={scenarioId}
                workspaceId={workspaceId}
                dctCapabilities={dctCapabilities}
                scenarioCapabilityIds={scenario?.dctCapabilities || []}
                soaDctCapabilityRelations={soaDctCapabilityRelations}
                activityVisitCapabilities={activityVisitCapabilities}
                createVisit={handleCreateVisit}
                deleteVisit={handleDeleteVisit}
                addSoAActivities={handleCreateSoaActivity}
                addCustomSoAActivity={handleAddCustomSoA}
                updateUserCustomSoACost={handleUpdateUserCustomSoACost}
                removeSoAActivity={handleDeleteSoaActivity}
                fetchActivityVisitsCapabilities={fetchActivityVisitsCapabilities}
                showError={(errorMessage: string) => setSysError(errorMessage)}
                updateUserdefinedActivity={handleUpdateUserdefinedActivity}
                updateSoaVisit={handleUpdateSoaVisit}
                updateSoaTaxonomies={handleUpdateSoaTaxonomies}
                updateSoaTaxonomyCapability={handleUpdateSoaTaxonomyCapability}
                updateAllSoaTaxonomyCapability={handleUpdateAllSoaTaxonomyCapability}
                downLoadSoaData={downloadSoA}
                unsupportedTrial={unsupportedTrial}
                trialIndication={trialIndication}
                updateScenarioCapability={handleUpdateScenarioCapability}
              />
              <CustomSoAFormModal
                open={customSoA !== undefined || editCustomSoA !== undefined}
                activityCategoryId={customSoA?.activityCategoryId || ""}
                activityCategoryName={customSoA?.activityCategoryName || ""}
                userDefinedActivityName={customSoA?.userDefinedActivityName || editCustomSoA?.activityName || ""}
                scenarioId={customSoA?.scenarioId || editCustomSoA?.scenarioId || ""}
                userEditSoA={editCustomSoA}
                handleClose={() => {
                  setCustomSoA(undefined);
                  setEditCustomSoA(undefined);
                }
                }
                handleAddCustomSoA={addCustomSoA}
                handleUpdateCustomSoACost={updateCustomSoACost}
              />
            </Profiler>
          </>
        ) : (
          <SoAHistoricalSummary
            summaryInfo={summaryInfo}
            scenarioVisits={soaVisits}
            soaPeriods={soaPeriods}
            selectedVisitsNum={selectedVisits}
            selectedActivities={soaActivitiesWithVisits}
            historicalActivities={historicalActivities}
            savedInfo={`Last saved ${formatTime(scenario?.soaUpdatedAt || "")} by ${formatUserName(scenario?.soaUpdatedBy?.name || "")}`}
            scenarioId={scenarioId}
            workspaceId={workspaceId}
            internalTrialsCount={internalTrialsCount}
          />
        )}
      </Container>
    </>
  );
};
const Container = styled(Grid)({});

export default SoA;
