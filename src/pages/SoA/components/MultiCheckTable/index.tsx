import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Checkbox,
  Typography,
  Button,
  styled,
  TextField,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {
  Close,
  Add,
  FiberManualRecord,
  ExpandMore,
  ExpandLess,
  Edit,
  InfoOutlined,
  SearchOutlined,
} from "@material-ui/icons";
import { Popover, Table } from "antd";
import { ActivityModel } from "../../type/Activity";
import { SoaVisitInput, UpdateSoaActivityVisitsDctCapabilityInputObjectType, useSoaActivityVisits } from "../../../../hooks/useUpdateSoAActiviyVisits/use-soa-activity-visits";
import "antd/dist/antd.css";
import "./index.css";
import VisitsPopoverForm from "../VisitsPopoverForm";
import CommentsPopoverForm from "../CommentsPopoverForm";
import CapabilityBages, { SelectedCapability } from "../CapabilityBadges";
import { DctCapabilityRelation, SoaActivityVisitCapability } from "../../type/DctCapabilityRelation";
import { DctCapability } from "../../type/DctCapability";
import { filterSoaTaxonomyByShowChildren, getRecordChildrenDisplayCapabilities } from "../../../../utils/SoAUtils";
import CustomNumberInput from "../../../../components/CustomNumberInput";
import { TableColumnType, TableRecordType } from "./TableType";
interface CheckBoxTableProps {
  tableData: {
    columnGroups: any[];
    visitsGroups: any[];
  };
  activitiesArray: ActivityModel[];
  historicalActivities: ActivityModel[];
  expandRowKeys: string[];
  dctCapabilities: DctCapability[];
  dctCapabilityRelations: DctCapabilityRelation[];
  activityVisitCapabilityArray: SoaActivityVisitCapability[];
  unsupportedTrial: Boolean
  createVisit: (
    scenarioId: string,
    visitNumber: any,
    soaPeriod: string
  ) => Promise<any>;
  deleteVisit: (visitId: string) => Promise<any>;
  addSoAActivities: (inputArray: { scenarioId: string, activityId: string }[]) => void;
  addCustomSoAActivity: (scenarioId: string, activityName: string, categoryId: string, categoryName: string) => void;
  removeSoAActivity: (ids: string[]) => void;
  fetchActivityVisitsCapabilities: () => Promise<any>;
  updateUserdefinedActivity: (activityId: string, newCategoryId: string, nextAction: Function) => void;
  showError: (errorMessage: string) => void;
  handleUpdateSoaVisit: (input: SoaVisitInput) => Promise<any>;
  handleUpdateUserCustomSoACost: (scenarioId: string, activityId: string, activityName: string, cost: any) => void;
  handleUpdateSoaTaxonomies: (taxonomyId: any, standardComment: string) => Promise<any>;
  handleUpdateSoaTaxonomyCapability: (inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[]) => Promise<any>;
  handleUpdateAllSoaTaxonomyCapability: (inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[]) => Promise<any>;
}

const { Column, ColumnGroup } = Table;
const MultiCheckTable: React.FC<CheckBoxTableProps> = ({
  tableData,
  activitiesArray,
  dctCapabilities,
  dctCapabilityRelations,
  activityVisitCapabilityArray,
  historicalActivities,
  expandRowKeys,
  unsupportedTrial,
  createVisit,
  deleteVisit,
  addSoAActivities,
  addCustomSoAActivity,
  removeSoAActivity,
  fetchActivityVisitsCapabilities,
  showError,
  updateUserdefinedActivity,
  handleUpdateSoaVisit,
  handleUpdateUserCustomSoACost,
  handleUpdateSoaTaxonomies,
  handleUpdateSoaTaxonomyCapability,
  handleUpdateAllSoaTaxonomyCapability,
}) => {
  const [dataSet, setDataSet] = useState<any[]>([]);
  const [editGroup, setEditGroup] = useState("");
  const autoCompleteRef = useRef<HTMLInputElement>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>(expandRowKeys);
  const [userAddedActivityIds, setUserAddedActivityIds] = useState<any[]>([]);
  const [collapsedKeys, setCollapsedKeys] = useState<any[]>([]);
  const [headerExpand, setHeaderExpand] = useState(true);
  const [scrollHeight, SetScrollHeight] = useState<any>(document.body.scrollHeight - 450);
  const [columnGroups, setColumnGroups] = useState<any[]>([]);
  const [visitsGroups, setVisitsGroups] = useState<any[]>([]);
  const [disableAddVisit, setDisableAddVisit] = useState(false);
  const [activityVisitCapabilities, setActivityVisitCapabilities] = useState<SoaActivityVisitCapability[]>([]);
  const { createSoaActivityVisit, deleteSoaActivityVisit } = useSoaActivityVisits();


  useEffect(() => {
    if (tableData) {
      setColumnGroups(tableData.columnGroups);
      setVisitsGroups(tableData.visitsGroups);
    }
  }, [tableData]);
  useEffect(() => {
    setActivityVisitCapabilities(activityVisitCapabilityArray);
  }, [activityVisitCapabilityArray]);
  useEffect(() => {
    let data: any[] = [
      {
        key: "weeks-from-randomization",
        itemName: "Weeks",
        activityWeekes: true,
        tooltips: "Weeks from randomization or week relative to study drug start date",
      },
      {
        key: "visit-activities-count",
        itemName: "Activities Per Visit",
        activitySummary: true,
        tooltips: "The total number of activities you have selected for this visit. Red flagging indicates an activity count of 1 or fewer; consider adding additional activities or deleting the visit."
      },
      {
        key: "visit-interval-tolerance",
        itemName: "Visit Interval Tolerance (+/- days)",
        acitivityInveralTolerance: true,
      },
      {
        key: "visit-detial",
        itemName: "Visit Detail",
        activityDetail: true,
      }
    ];
    visitsGroups.forEach((visitGroup) => {
      const childrenActivies = visitGroup.activities.filter((soaActivity: any) => soaActivity.isChild && soaActivity.parentId);
      const groupItems: TableRecordType[] =
        visitGroup?.activities?.filter((soaActivity: any) => !soaActivity.isChild).map((soaActivity: any) => {
          const children = childrenActivies.filter((childActivity: any) => childActivity.parentId === soaActivity.id).map((childActivity: any) => {
            return {
              key: childActivity.id,
              activityId: childActivity.activity ? childActivity.activity.id : childActivity.soaTaxonomyId,
              groupName: visitGroup.categoryName,
              itemName: childActivity.activity.name,
              visitData: childActivity.soaVisits?.sort(
                (a: any, b: any) => a.visitNumber - b.visitNumber
              ) || [],
              soaActivityId: childActivity.id,
              isChild: true,
              parentId: childActivity.parentId,
              standardComment: childActivity.soaTaxonomy?.standardComment,
              taxonomyId: childActivity.soaTaxonomy?.id,
            }
          });
          const result: any = {
            key: soaActivity.id,
            activityId: soaActivity.activity ? soaActivity.activity.id : soaActivity.soaTaxonomyId,
            groupName: visitGroup.categoryName,
            itemName: soaActivity.activity?.name,
            visitData: soaActivity.soaVisits?.sort(
              (a: any, b: any) => a.visitNumber - b.visitNumber
            ) || [],
            soaActivityId: soaActivity.id,
            standardComment: soaActivity.soaTaxonomy?.standardComment,
            taxonomyId: soaActivity.soaTaxonomy?.id,
          };
          if (children.length > 0) {
            result.children = children;
            result.isParent = true;
          }
          return result;
        }) || [];
      groupItems.push({
        groupName: visitGroup?.categoryName,
        key: `${visitGroup.categoryName}-action`,
        categoryId: visitGroup.categoryId,
        scenarioId: visitGroup.scenarioId,
        isAction: true,
      });

      const groupTitle = {
        key: visitGroup.categoryId,
        groupName: visitGroup.categoryName,
        itemName: visitGroup.categoryName,
        isGroupTitle: true,
        children: groupItems,
      };
      let result: any = [];
      result.push(groupTitle);
      data = data.concat(result);
    });
    setDataSet(data);
  }, [visitsGroups]);
  useEffect(() => {
    const defaultExpandedRowKeys = expandRowKeys;
    visitsGroups.forEach((group: any) => {
      group.activities.forEach((soaActivity: any) => {
        defaultExpandedRowKeys.push(soaActivity.id);
      });
    });
    const newExpandedKeys = defaultExpandedRowKeys.filter((key) => collapsedKeys.findIndex((collapsedKey) => collapsedKey === key) === -1);
    setExpandedKeys(newExpandedKeys);
  }, [collapsedKeys, expandRowKeys, visitsGroups]);
  useEffect(() => {
    const newExpandedKeys = expandRowKeys.filter((key) => collapsedKeys.findIndex((collapsedKey) => collapsedKey === key) === -1);
    setExpandedKeys(newExpandedKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedKeys]);
  useEffect(() => {
    const handleResize = () => {
      const scrollHeight = document.body.offsetHeight - 450;
      SetScrollHeight(scrollHeight);
    }
    window.addEventListener("resize", handleResize)
  });
  const handleClickCollapse = (key: any) => {
    const newCollapsedKeys = [...collapsedKeys];
    const index = collapsedKeys.findIndex((collapseKey: any) => collapseKey === key);
    if (index > -1) {
      // remove collapse row key
      newCollapsedKeys.splice(index, 1);
    } else {
      // add collapse row key
      newCollapsedKeys.push(key);
    }
    setCollapsedKeys(newCollapsedKeys)
  }
  const handleAddSoaVisit = useCallback((soaActivityId: any, soaVisitId: any, groupName: any, parentId: string, isChild?: boolean) => {
    const inputArray = [{
      soaActivityId,
      soaVisitId
    }]
    const activities = visitsGroups?.find((group: any) => group.categoryName === groupName)?.activities || [];
    // Checkbox logic for uncheck action.
    // if soaActivity is parent, check all children which is not checked
    if (!isChild) {
      const children = activities.filter((soaActivity: any) => soaActivity.parentId === soaActivityId);
      children?.forEach((child: any) => {
        if (child.soaVisits?.findIndex((visit: any) => visit.id === soaVisitId) < 0) {
          inputArray.push({
            soaActivityId: child.id,
            soaVisitId
          });
        }
      });
    } else {
      // if soaActiviy is child and parent activity is also unchecked
      const parentActivity = activities.find((soaActivity: any) => soaActivity.id === parentId);
      if (parentActivity && parentActivity.soaVisits.findIndex((visit: any) => visit.id === soaVisitId) < 0) {
        inputArray.push({
          soaActivityId: parentId,
          soaVisitId,
        });
      }
    }
    // addSoAActivityVisits(inputArray);
    createSoaActivityVisit({ input: inputArray }).then(() => {
      const newVisitGroups = [...visitsGroups];
      // const updatedCpabilities: UpdateSoaActivityVisitsDctCapabilityInputObjectType[] = [];
      inputArray.forEach(({ soaActivityId, soaVisitId }) => {
        const groupIndex = newVisitGroups.findIndex((group: any) => group.categoryName === groupName);
        if (groupIndex > -1) {
          const group = newVisitGroups[groupIndex];
          const activityIndex = group.activities.findIndex((activity: any) => activity.id === soaActivityId);
          if (activityIndex > -1) {
            const activity = group.activities[activityIndex];
            const soaVisits = activity.soaVisits;
            const visitIndex = soaVisits.findIndex((visit: any) => visit.id === soaVisitId);
            if (visitIndex === -1) {
              // soaVisits.splice(visitIndex, 1);
              const periodIndex = columnGroups.findIndex((period: any) => period.columns.findIndex((column: any) => column.visitId === soaVisitId) > -1)
              if (periodIndex > -1) {
                const column = columnGroups[periodIndex].columns.find((column: any) => column.visitId === soaVisitId);
                soaVisits.push(
                  {
                    id: column.visitId,
                    scenarioId: column.scenarioId,
                    soaPeriodId: column.soaPeriodId,
                    visitNumber: column.visitNumber,
                    weekNum: column.weekNum,
                    intervalTolerance: column.intervalTolerance,
                    detail: column.detail,
                    alias: column.alias,
                  }
                )
              }
            }
            activity.soaVisits = soaVisits;
            group.activities[activityIndex] = activity;
          }
          newVisitGroups[groupIndex] = group;
        }
      });
      setVisitsGroups(newVisitGroups);

      fetchActivityVisitsCapabilities().then((res: any) => {
        const soaActivityVisitsDctCapabilities = res.data?.soaActivityVisits;
        if (soaActivityVisitsDctCapabilities) {
          setActivityVisitCapabilities(soaActivityVisitsDctCapabilities);
        }
      })
    })
  }, [columnGroups, createSoaActivityVisit, fetchActivityVisitsCapabilities, visitsGroups]);
  const renderCheckboxByValue = useCallback(
    (checked: boolean, soaActivityId: string, soaVisitId: string, groupName, isChild?: boolean, parentId?: any) => {
      if (checked) {
        return (
          <Checkbox
            checked
            onClick={() => {
              const inputArray = [{
                soaActivityId,
                soaVisitId
              }];
              // Checkbox logic for uncheck action.
              // If activity is parent, uncheck all children
              const activities = visitsGroups?.find((group: any) => group.categoryName === groupName)?.activities || [];
              if (!isChild) {
                const children = activities.filter((soaActivity: any) => soaActivity.parentId === soaActivityId);
                children?.forEach((child: any) => {
                  if (child.soaVisits?.findIndex((visit: any) => visit.id === soaVisitId) > -1) {
                    inputArray.push({
                      soaActivityId: child.id,
                      soaVisitId
                    });
                  }
                });
              } else {
                // If activity is the last checked child, uncheck parent
                const parentActivity = activities.find((soaActivity: any) => soaActivity.id === parentId);
                const parentActivityChildrenCount = activities.filter((soaActivity: any) => {
                  const checkedVisitIndex = soaActivity.soaVisits.findIndex((soaVisit: any) => soaVisit.id === soaVisitId);
                  return soaActivity.parentId === parentId && checkedVisitIndex > -1
                }).length;
                if (parentActivity && parentActivityChildrenCount < 2 && parentActivity.soaVisits?.findIndex((visit: any) => visit.id === soaVisitId) > -1) {
                  inputArray.push({
                    soaActivityId: parentId,
                    soaVisitId,
                  });
                }
              }
              deleteSoaActivityVisit({ input: inputArray }).then(() => {
                const newVisitGroups = [...visitsGroups];
                const updatedCpabilities: UpdateSoaActivityVisitsDctCapabilityInputObjectType[] = [];
                inputArray.forEach(({ soaActivityId, soaVisitId }) => {
                  const groupIndex = newVisitGroups.findIndex((group: any) => group.categoryName === groupName);
                  if (groupIndex > -1) {
                    const group = newVisitGroups[groupIndex];
                    const activityIndex = group.activities.findIndex((activity: any) => activity.id === soaActivityId);
                    if (activityIndex > -1) {
                      const activity = group.activities[activityIndex];
                      const soaVisits = activity.soaVisits;
                      const visitIndex = soaVisits.findIndex((visit: any) => visit.id === soaVisitId);
                      if (visitIndex > -1) {
                        soaVisits.splice(visitIndex, 1);
                      }
                      activity.soaVisits = soaVisits;
                      group.activities[activityIndex] = activity;
                    }
                    newVisitGroups[groupIndex] = group;
                  }
                  updatedCpabilities.push({
                    soaActivityId,
                    dctCapabilities: [],
                    soaVisitId,
                  });
                });
                const newCapabilities = activityVisitCapabilities.map((oldCapability: SoaActivityVisitCapability) => {
                  const updatedIndex = updatedCpabilities.findIndex((updatedObj: UpdateSoaActivityVisitsDctCapabilityInputObjectType) => updatedObj.soaActivityId === oldCapability.soaActivityId && oldCapability.soaVisitId === updatedObj.soaVisitId);
                  if (updatedIndex > -1) {
                    return updatedCpabilities[updatedIndex];
                  }
                  return oldCapability
                });
                setActivityVisitCapabilities(newCapabilities);
                setVisitsGroups(newVisitGroups);
              });
            }}
          />
        );
      }

      return (
        <DisabledCheck
          onClick={() => {
            handleAddSoaVisit(soaActivityId, soaVisitId, groupName, parentId, isChild);
          }}
        />
      );
    },
    [activityVisitCapabilities, deleteSoaActivityVisit, handleAddSoaVisit, visitsGroups]
  );
  const renderColumns: Function = useCallback(
    (
      columns: TableColumnType[],
      visitCount: number,
      groupName: string,
    ): JSX.Element[] => {
      return columns.map((column) => {
        const title = (
          <TitleContainer>
            <Close
              color="primary"
              fontSize="small"
              onClick={() => {
                deleteVisit(column.visitId)
                .then((res: any) => {
                  //Delete current visit from columngroups and recalculate column numbers
                  if (res?.data?.deleteSoaVisits) {
                    const newColumnGroups = [...columnGroups];
                    const groupIndex = newColumnGroups.findIndex((group: any) => group.groupName === groupName)
                    if (groupIndex > -1) {
                      columnGroups.map((group: any, index) => {
                        // delete visit from group columns
                        if (index === groupIndex) {
                          const columnIndex = group.columns.findIndex((c: any) => c.visitNumber === column.visitNumber);
                          group.columns.splice(columnIndex, 1);
                        }
                        // re-calculate column number for columns that behind current column.
                        if (index > groupIndex) {
                          const newColumns = group.columns.map((column: any) => {
                            return { ...column, columnNumber: column.columnNumber - 1 }
                          });
                          group.columns = newColumns;
                        }
                        return group;
                      })
                      setColumnGroups(newColumnGroups);
                    }
                  }
                });
              }}
              style={{ cursor: "pointer" }}
            />
            {/* {Number(column.visitNumber) + visitCount} */}
            <AliasLabel>
              {column.alias || column.columnNumber}
            </AliasLabel>
            <AliasPopover
              className="popover-alias"
              id={column.id}
              label="ALIAS"
              defaultValue={column.alias || column.columnNumber}
              emptyValue={column.columnNumber}
              handleSubmit={(alias: any) => {
                const input: SoaVisitInput = {
                  soaPeriodId: column.soaPeriodId,
                  visitNumber: column.visitNumber,
                  scenarioId: column.scenarioId,
                  id: column.id,
                  alias,
                };
                return handleUpdateSoaVisit(input);
              }}
              handleError={(errorMessage: string) => {
                showError(errorMessage);
              }}
            />

          </TitleContainer>
        );
        return (
          <Column
            width="110px"
            className="content-column"
            title={title}
            dataIndex={column.visitNumber}
            key={column.id}
            render={(text, record: any) => {
              if (record.visitData) {
                const checked =
                  record.visitData.length > 0 &&
                  record.visitData.findIndex(
                    (visit: any) => visit.id === column.visitId
                  ) > -1;
                const displayIndex = activityVisitCapabilities?.findIndex((object: SoaActivityVisitCapability) =>
                  object.soaActivityId === record.soaActivityId && object.soaVisitId === column.visitId);
                const displayCapabilityIds: {
                  dctCapabilityId: any;
                  status: string;
                }[] = displayIndex > -1 ? activityVisitCapabilities[displayIndex].dctCapabilities : [];
                let displayCapabilities: SelectedCapability[] = displayCapabilityIds?.map((displayCapability) => {
                  const capability = dctCapabilities.find((capability) => capability.id === displayCapability.dctCapabilityId);
                  const capabilityRelation = dctCapabilityRelations.find((relation) => relation.dctCapabilityId === displayCapability.dctCapabilityId);
                  return {
                    dctCapabilityId: displayCapability.dctCapabilityId,
                    name: capability?.name || "",
                    status: displayCapability.status,
                    color: capability?.color || "",
                    soaTaxonomyId: capabilityRelation?.soaTaxonomyId || "",
                  };
                }) || [];
                if (record.isParent) {
                  const childrenRecords: { soaActivityId: string, visitId: any }[] = record.children.map((child: any) => {
                    return {
                      soaActivityId: child?.soaActivityId || "",
                      visitId: column.visitId,
                    };
                  });
                  displayCapabilities = getRecordChildrenDisplayCapabilities(childrenRecords, activityVisitCapabilities, dctCapabilityRelations, dctCapabilities);
                }
                return <CheckboxContainer>
                  {
                    renderCheckboxByValue(
                      checked,
                      record.soaActivityId,
                      column.visitId,
                      record.groupName,
                      record.isChild,
                      record.parentId,
                    )
                  }
                  {(dctCapabilityRelations.filter((relation) => relation.soaTaxonomyId === record.taxonomyId)?.length > 0) &&
                    (<CapabilityBages
                      disabled={!checked || record.isParent}
                      capabilities={dctCapabilities}
                      displayCapabilities={displayCapabilities}
                      capabilityRelations={dctCapabilityRelations}
                      soaTaxonomyId={record.taxonomyId}
                      handleUpdateSoaTaxonomyCapability={(selectedCapabilites: SelectedCapability[]) => {
                        const inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[] = [{
                          soaActivityId: record.soaActivityId,
                          soaVisitId: column.visitId,
                          dctCapabilities: selectedCapabilites.map((selected: SelectedCapability) => {
                            return {
                              dctCapabilityId: selected.dctCapabilityId,
                              status: selected.status,
                            };
                          }),
                        }];
                        handleUpdateSoaTaxonomyCapability(inputArray).then((res: any) => {
                          const newCapabilities = activityVisitCapabilities.map((oldCapability: SoaActivityVisitCapability) => {
                            const updatedIndex = inputArray.findIndex((updatedObj: UpdateSoaActivityVisitsDctCapabilityInputObjectType) => updatedObj.soaActivityId === oldCapability.soaActivityId && oldCapability.soaVisitId === updatedObj.soaVisitId);
                            if (updatedIndex > -1) {
                              return inputArray[updatedIndex];
                            }
                            return oldCapability
                          });
                          setActivityVisitCapabilities(newCapabilities);
                        });
                      }}
                      handleApplyToAllVisits={(selectedCapabilities: SelectedCapability[]) => {
                        const dctCapabilities = selectedCapabilities.map((selected: SelectedCapability) => {
                          return {
                            dctCapabilityId: selected.dctCapabilityId,
                            status: selected.status,
                          };
                        }
                        );
                        const inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[] = record.visitData?.map((visit: any) => {
                          return {
                            soaActivityId: record.soaActivityId,
                            soaVisitId: visit.id,
                            dctCapabilities,
                          }
                        }) || [];
                        handleUpdateAllSoaTaxonomyCapability(inputArray).then((res: any) => {
                          const newCapabilities = activityVisitCapabilities.map((oldCapability: SoaActivityVisitCapability) => {
                            const updatedIndex = inputArray.findIndex((updatedObj: UpdateSoaActivityVisitsDctCapabilityInputObjectType) => updatedObj.soaActivityId === oldCapability.soaActivityId && oldCapability.soaVisitId === updatedObj.soaVisitId);
                            if (updatedIndex > -1) {
                              return inputArray[updatedIndex];
                            }
                            return oldCapability
                          });
                          setActivityVisitCapabilities(newCapabilities);
                        });
                      }}
                    />)}
                </CheckboxContainer>

              }
              if (record.activitySummary) {
                let count = 0;
                visitsGroups.forEach((group) => {
                  const activities = group.activities.filter((activity: any) =>
                    activity?.soaVisits?.findIndex((visit: any) => visit.id === column.visitId) > -1
                  );
                  count += filterSoaTaxonomyByShowChildren(activities).length;
                });
                if (count < 2) {
                  return (
                    <Popover
                      style={{ width: "100%", height: "100%" }}
                      trigger="click"
                      placement="bottomLeft"
                      content={
                        <TooltipContainer>
                          <Grid><label style={{ color: "red", textTransform: "uppercase", fontWeight: 500 }}>Warning:</label> Low activity count for</Grid>
                          <Grid>this visit. Consider deleting or</Grid>
                          <Grid>moving to another visit.</Grid>
                        </TooltipContainer>
                      }>
                      <ActivityCount
                        style={{
                          cursor: "pointer",
                          background: "#F5E9E7",
                        }}>
                        <Dot />
                        {count}
                      </ActivityCount>
                    </Popover >
                  );
                }
                return <ActivityCount>{count}</ActivityCount>;
              }
              if (record.activityWeekes) {
                return <WeekInput
                  variant="outlined"
                  defaultValue={column.weekNum}
                  onBlur={(e: any) => {
                    const newValue = e.target.value;
                    const oldValue = column.weekNum;
                    const weekNum = Number.parseInt(newValue);
                    if (oldValue !== null && newValue === "") {
                      showError("weekNum cannot be empty!");
                    } else if (newValue !== "" && isNaN(weekNum)) {
                      showError("Week number format error.");
                    } else if (weekNum !== null && weekNum !== oldValue) {
                      const input: SoaVisitInput = {
                        soaPeriodId: column.soaPeriodId,
                        visitNumber: column.visitNumber,
                        scenarioId: column.scenarioId,
                        weekNum,
                        id: column.id,
                      };
                      handleUpdateSoaVisit(input);
                    }
                  }}
                />
              }
              if (record.acitivityInveralTolerance) {
                return <>
                  <ToleranceInput
                    variant="outlined"
                    defaultValue={column.intervalTolerance}
                    onBlur={(e: any) => {
                      const newValue = e.target.value;
                      const oldValue = column.intervalTolerance;
                      const intervalTolerance = Number.parseInt(newValue);
                      if (oldValue !== null && newValue === "") {
                        showError("interval Tolerance cannot be empty!");
                      } else if (newValue !== "" && isNaN(intervalTolerance)) {
                        showError("interval Tolerance format error.");
                      } else if (intervalTolerance !== null && intervalTolerance !== oldValue) {
                        const input: SoaVisitInput = {
                          soaPeriodId: column.soaPeriodId,
                          visitNumber: column.visitNumber,
                          scenarioId: column.scenarioId,
                          intervalTolerance,
                          id: column.id,
                        };
                        handleUpdateSoaVisit(input);
                      }
                    }}
                  /></>
              }
              if (record.activityDetail) {
                return <DetailInput
                  variant="outlined"
                  defaultValue={column.detail}
                  onBlur={(e: any) => {
                    const detail = e.target.value;
                    const oldValue = column.detail;
                    if (detail !== oldValue) {
                      const input: SoaVisitInput = {
                        soaPeriodId: column.soaPeriodId,
                        visitNumber: column.visitNumber,
                        scenarioId: column.scenarioId,
                        detail,
                        id: column.id,
                      };
                      handleUpdateSoaVisit(input);
                    }
                  }}
                />
              }
              return null;
            }}
          />
        );
      });
    },
    [deleteVisit, columnGroups, handleUpdateSoaVisit, showError, activityVisitCapabilities, renderCheckboxByValue, dctCapabilityRelations, dctCapabilities, handleUpdateSoaTaxonomyCapability, handleUpdateAllSoaTaxonomyCapability, visitsGroups]
  );
  const findSoAActivityForRecord = (activityId: any, groupName: any) => {
    const activities = visitsGroups?.find((group: any) => group.categoryName === groupName)?.activities || [];
    const soaActivity = activities.find((soaActivity: any) => soaActivity.id === activityId);
    if (soaActivity) {
      const originalActivity = activitiesArray.find((activity) => activity.id === soaActivity.activity?.id);
      soaActivity.dataVersion = originalActivity?.dataVersion;
    }
    return soaActivity;
  }
  const renderTableBody = useCallback(() => {
    return (
      <>
        <ColumnGroup title={
          <CollapseHeaderButton variant="text" onClick={() => {
            setHeaderExpand(!headerExpand);
          }}>
            {headerExpand ? "Collapse add'l header rows" : "Expand add'l header rows"}
          </CollapseHeaderButton>
        }>
          <Column
            width="250px"
            title="Visit Number"
            dataIndex="itemName"
            fixed="left"
            render={(text, record: any) => {
              if (record?.isGroupTitle) {
                return <GroupTitle>{text}</GroupTitle>;
              }
              if (record?.isAction) {
                if (editGroup === record.groupName) {
                  const options = activitiesArray.filter((activity) => activity?.activityCategory?.name === record.groupName && activity.archived !== true);
                  return (
                    <Autocomplete
                      freeSolo
                      id="auto-complete"
                      getOptionLabel={(option) => option.name.split(".").length > 1 ? option.name.split(".")[1] : option.name}
                      options={options}
                      renderInput={(params) => (
                        <>
                          <TextField
                            {...params}
                            inputMode="text"
                            inputRef={autoCompleteRef}
                          // classes={{ root: searchCriteriaClasses.root }}
                          />

                          <AddNameButton
                            onClick={() => {
                              const addValue = autoCompleteRef?.current?.value;
                              const scenarioId = record.scenarioId;
                              if (addValue) {
                                const addActivity = activitiesArray.find((activity) => {
                                  const activityName = activity.name?.split(".").length > 1 ? activity.name.split(".")[1] : activity.name;
                                  return activity.id === addValue || activityName === addValue;
                                });
                                if (addActivity) {
                                  const inputArray: any[] = addActivity.dataVersion?.name === "1.0.0" || addActivity.userDefined ? [
                                    {
                                      scenarioId,
                                      activityId: addActivity.id
                                    }
                                  ] : [
                                    {
                                      scenarioId,
                                      soaTaxonomyId: addActivity.id
                                    }
                                  ]
                                  if (addActivity.activityCategoryId !== record.categoryId) {
                                    // 1. if is custom activity, change category id to record.category id then add SoaActivity.
                                    // 2. if not, show error.
                                    if (addActivity.userDefined) {
                                      updateUserdefinedActivity(addActivity.id, record.categoryId, () => { addSoAActivities(inputArray) });
                                    } else {
                                      showError("The activity has already existing in other category.")
                                    }
                                  } else {
                                    if (addActivity.isParent) {
                                      const childrenActivityArray = activitiesArray.filter((activity: any) => activity.parentId === addActivity.id);
                                      childrenActivityArray.forEach((child: any) => {
                                        inputArray.push({
                                          scenarioId,
                                          soaTaxonomyId: child.id,
                                        });
                                      })
                                    } else if (addActivity.parentId) {
                                      const groupIndex = visitsGroups.findIndex((group: any) => {
                                        const activityIndex = group.activities.findIndex((soaActivity: any) => {
                                          return soaActivity.activity.id === addActivity.parentId;
                                        });
                                        return activityIndex > -1;
                                      });
                                      if (groupIndex === -1) {
                                        inputArray.push({
                                          scenarioId,
                                          soaTaxonomyId: addActivity.parentId,
                                        });
                                      }
                                    }
                                    addSoAActivities(inputArray);
                                    const addedActivityIds = [...userAddedActivityIds];
                                    inputArray.forEach((activity: any) => {
                                      const index = userAddedActivityIds.findIndex((id) => id === activity.soaTaxonomyId)
                                      if (index === -1) {
                                        addedActivityIds.push(activity.soaTaxonomyId);
                                      }
                                    });
                                    setUserAddedActivityIds(addedActivityIds);
                                  }
                                } else {
                                  const categoryId = record.categoryId;
                                  const categoryName = record.groupName;
                                  addCustomSoAActivity(scenarioId, addValue, categoryId, categoryName);
                                }
                              }

                              // setEditValue(null);
                              setEditGroup("");
                            }}
                          >
                            Add
                          </AddNameButton>
                          <AddNameButton
                            onClick={() => {
                              // setEditValue(null);
                              setEditGroup("");
                            }}
                          >
                            Cancel
                          </AddNameButton>
                        </>
                      )}
                    />
                  )
                } else {
                  return (
                    <ActionButton
                      disabled={editGroup !== ""}
                      onClick={() => {
                        if (editGroup === "") {
                          setEditGroup(record.groupName);
                        }
                      }}
                    >
                      <Add style={{ color: "#82786F", fontSize: "12px" }} />
                      Add Activity
                    </ActionButton>
                  );
                }
              }
              if (record?.activitySummary || record?.activityWeekes || record?.acitivityInveralTolerance || record?.activityDetail) {
                return (
                  <SummaryTitle>
                    {text}
                    {
                      record.tooltips ? (
                        <Tooltip title={record.tooltips} placement="top">
                          <InfoIcon />
                        </Tooltip>
                      ) : (
                        // <InfoIcon />
                        null
                      )
                    }
                  </SummaryTitle>
                );
              }
              const recordSoaActivity = findSoAActivityForRecord(record.key, record.groupName);
              return (
                <ItemTitle style={record.isChild ? { marginLeft: "30px" } : {}}>
                  <Close
                    color="primary"
                    fontSize="small"
                    onClick={() => {
                      const id = record.soaActivityId;
                      const ids: any = [id];
                      const activities = visitsGroups?.find((group: any) => group.categoryName === record.groupName)?.activities || [];
                      // Delete logic
                      // if is child
                      if (record.isChild) {
                        const parent = activities.find((soaAcitivity: any) => soaAcitivity.id === record.parentId);
                        const children = activities.filter((soaActivity: any) => soaActivity.parentId === record.parentId);

                        // if this is the last child that will be deleted, delete parent activity.
                        if (children.length < 2 && parent) {
                          ids.push(record.parentId);
                        }
                      } else {
                        // if activity is parent, delete all child activity.
                        const children = activities.filter((soaActivity: any) => soaActivity.parentId === id);
                        children.forEach((soaActivity: any) => {
                          ids.push(soaActivity.id);
                        });
                      }
                      removeSoAActivity(ids);
                      const addedActivityIds = [...userAddedActivityIds];
                      ids.forEach((id: any) => {
                        const index = addedActivityIds.findIndex((activityId) => activityId === id);
                        if (index > -1) {
                          addedActivityIds.splice(index, 1);
                        }
                      });
                      setUserAddedActivityIds(addedActivityIds);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  {record.isChild ? text.split(".")[1] : text}
                  {
                    recordSoaActivity?.activity?.userDefined === true && (
                      <Edit
                        onClick={() => {
                          const activityName = recordSoaActivity.isChild ? recordSoaActivity.activity.name.split(".")[1] : recordSoaActivity.activity.name;
                          handleUpdateUserCustomSoACost(recordSoaActivity.scenarioId, recordSoaActivity.activity.id, activityName, recordSoaActivity.activity.cost);
                        }}
                        style={{
                          cursor: "pointer",
                          fontSize: "1rem",
                          marginLeft: "10px",
                        }}
                      />
                    )
                  }
                </ItemTitle>
              );
            }}
          />
        </ColumnGroup>
        {columnGroups.map((groupObject, index) => {
          let visitCount = 0;
          if (index !== 0) {
            for (let i = 0; i < index; i++) {
              visitCount += columnGroups[i].visitsCount;
            }
          }
          return (
            <ColumnGroup title={groupObject.groupName} key={groupObject.groupName}>
              {renderColumns(groupObject.columns, visitCount, groupObject.groupName)}
              <Column
                title="Add Visit"
                onHeaderCell={() => {
                  return {
                    onClick: () => {
                      if (!disableAddVisit) {
                        let visitNumber = 1;
                        if (groupObject?.columns?.length > 0) {
                          const visit =
                            groupObject?.columns[groupObject?.columns.length - 1];
                          visitNumber = visit.visitNumber + 1;
                        }
                        setDisableAddVisit(true);
                        createVisit(
                          groupObject.scenarioId,
                          visitNumber,
                          groupObject.periodId
                        ).then((res: any) => {
                          //Add visit to clumn group in local, re-calculate the visit number of columns.
                          if (res?.data?.createSoaVisits && res.data.createSoaVisits.length > 0) {
                            const { id, visitNumber, scenarioId } = res.data.createSoaVisits[0];
                            const newColumnGroups = [...columnGroups];
                            const groupIndex = newColumnGroups.findIndex((group: any) => group.groupName === groupObject.groupName)
                            if (groupIndex > -1) {
                              columnGroups.map((group: any, index) => {
                                // add visit to column group
                                if (index === groupIndex) {
                                  const columnIndex = group.columns.findIndex((column: any) => column.visitNumber === visitNumber);
                                  if (columnIndex === -1) {
                                    let columnNumber = 1;
                                    if (group.columns.length > 0) {
                                      columnNumber = group.columns[group.columns.length - 1].columnNumber + 1
                                    }
                                    group.columns.push({
                                      id,
                                      scenarioId,
                                      soaPeriodId: groupObject.periodId,
                                      visitNumber,
                                      visitId: id,
                                      columnNumber
                                    });
                                  }
                                }
                                // re-calculate column number for columns that behind current column.
                                if (index > groupIndex) {
                                  const newColumns = group.columns.map((column: any) => {
                                    return { ...column, columnNumber: column.columnNumber + 1 }
                                  });
                                  group.columns = newColumns;
                                }
                                return group;
                              })
                              setColumnGroups(newColumnGroups);
                              setDisableAddVisit(false);
                            }
                          }
                        });
                      }
                    },
                  };
                }}
                // className="add-button-column"
                className={disableAddVisit ? "add-button-column-disabled" : "add-button-column"}
                width="150px"
              />
            </ColumnGroup>
          );
        })}
        <ColumnGroup title="">
          <Column
            width="95px"
            title="# Selected"
            dataIndex="selectedBoxes"
            key="selectedBoxes"
            fixed="right"
            render={(text, record: any) => {
              let selectedInboxCount = 0;
              if (record.visitData) {
                selectedInboxCount = record.visitData.length;
                return selectedInboxCount;
              }
              return null;
            }}
          />
          <>
            {!unsupportedTrial && <Column
              width="95px"
              title="Historical Frequency"
              dataIndex="frequencey"
              key="frequencey"
              fixed="right"
              render={(text, record: any) => {
                if (record.visitData) {
                  let percent = 'N/A';
                  if (historicalActivities.length > 0) {
                    const activity = historicalActivities.find((criteria) => criteria.id === record.activityId);
                    percent = activity && activity.frequency ? `${(activity?.frequency * 100).toFixed()}%` : 'N/A';
                  }
                  return percent;
                }
                return null;
              }}
            />}
          </>
          <Column
            width="100px"
            title="Comments"
            dataIndex="comments"
            key="comments"
            fixed="right"
            render={(text, record: any) => {
              const recordSoaActivity = findSoAActivityForRecord(record.key, record.groupName);
              const isUserDefined = recordSoaActivity?.activity?.userDefined === true;
              if (record.visitData && !isUserDefined && recordSoaActivity?.dataVersion !== "1.0.0") {
                return (
                  <CommentsPopover
                    id={record.activityId}
                    defaultValue={record.standardComment}
                    activeName={record.itemName}
                    handleSubmit={(comments: any) => {
                      return handleUpdateSoaTaxonomies(record.taxonomyId, comments);
                    }}
                    handleError={(errorMessage: string) => {
                      showError(errorMessage);
                    }}
                  >
                    {
                      record.standardComment ?
                        (
                          <Tooltip title={record.standardComment} placement="bottom">
                            <SearchOutlined style={{ color: "red" }} />
                          </Tooltip>
                        ) :
                        <SearchOutlined />
                    }

                  </CommentsPopover>
                );
              }
              return null;
            }}
          />
        </ColumnGroup>
      </>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitiesArray, dataSet, expandRowKeys, expandedKeys, editGroup, activityVisitCapabilities, headerExpand, setHeaderExpand, disableAddVisit])
  const renderTable = useCallback(() => {
    const expandbleConfig = {
      indentSize: 0,
      rowExpandable: (record: any) => {
        return record.children && record.children.length > 0;
      },
      defaultExpandedRowKeys: expandedKeys,
      expandedRowKeys: expandedKeys,
      expandIcon: ({ expanded, onExpand, record }: any) => {
        if (record.children) {
          return expanded ? (
            <IconButton
              style={{ width: "17px", height: "17px", float: "left", padding: 0 }}
              onClick={e => {
                handleClickCollapse(record.key);
              }}
            >
              <ExpandMore />
            </IconButton>
          ) : (
            <IconButton
              style={{ width: "17px", height: "17px", float: "left", padding: 0 }}
              onClick={e => {
                handleClickCollapse(record.key);
              }}
            >
              <ExpandLess />
            </IconButton>
          )
        }
        return undefined
      },
    }
    return expandRowKeys.length > 0 ? (
      <Table
        key="loading-done"
        defaultExpandAllRows={true}
        dataSource={dataSet}
        pagination={false}
        bordered
        style={{ maxWidth: 1400 }}
        scroll={{ x: 1500, y: scrollHeight }}
        expandable={expandbleConfig}
        rowClassName={(record, index) => {
          if (record.isGroupTitle) {
            return "title-row";
          } else if (record.activityWeekes) {
            return "header-row";
          } else if (record.activitySummary || record.acitivityInveralTolerance || record.activityDetail) {
            if (!headerExpand) {
              return "hidden-row";
            } else {
              return "header-row";
            }
          }
          else if (index % 2) {
            return "even-row";
          }
          return "";
        }}
      >
        {renderTableBody()}
      </Table>
    ) : (
      <Table
        key="loading-not-done"
        dataSource={dataSet}
        pagination={false}
        bordered
        style={{ maxWidth: 1400 }}
        scroll={{ x: 1500, y: scrollHeight }}
        expandable={expandbleConfig}
        rowClassName={(record, index) => {
          if (record.isGroupTitle) {
            return "title-row";
          } else if (index % 2) {
            return "even-row";
          }
          return "";
        }}
      >
        {renderTableBody()}
      </Table>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitiesArray, dataSet, expandRowKeys, editGroup, expandedKeys, scrollHeight, headerExpand, disableAddVisit]);

  return (
    renderTable()
  );
};

const GroupTitle = styled(Typography)({
  color: "#252525",
  fontWeight: 500,
  fontSize: "12px",
  marginLeft: "18px",
});
const ActivityCount = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "50px",
  marginLeft: "-5px",
  marginTop: "-3px",
  marginBottom: "-3px",
  height: "30px"
});
const TooltipContainer = styled(Grid)({});
const Dot = styled(FiberManualRecord)({
  width: "0.625rem",
  height: "0.625rem",
  marginRight: "5px",
  color: "red",
});
const SummaryTitle = styled(Grid)({
  display: "flex",
  color: "rgb(130, 120, 111)",
  fontSize: "12px",
  fontWeight: 500,
  paddingLeft: "15px",
  alignItems: "center",
  height: "30px"
});
const InfoIcon = styled(InfoOutlined)({
  width: "15px",
  height: "15px",
  marginLeft: "5px",
})
const TitleContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  width: "95px",
  alignItems: "center",
  marginLeft: "-10px",
});
const ItemTitle = styled("div")({
  display: "flex",
  alignItems: "center",
});
const DisabledCheck = styled("div")({
  width: "13px",
  height: "13px",
  background: "#D5D2CA",
  borderRadius: "2px",
  cursor: "pointer",
});
const ActionButton = styled(Button)({
  height: "20px",
  fontSize: "12px",
  color: "#82786F",
  lineHeight: "14px",
  marginLeft: "10px",
});
const AddNameButton = styled(Button)({
  fontSize: "12px",
  color: "rgb(213, 43, 30)",
  marginLeft: "10px",
});
const WeekInput = styled(TextField)({
  right: "6px",
  maxWidth: "40px",
  "& .MuiOutlinedInput-root": {
    height: "30px",
    minWidth: "50px",
    fontSize: "12px",
  }
});
const ToleranceInput = styled(CustomNumberInput)({
  right: "6px",
  maxWidth: "40px",
  "& .MuiOutlinedInput-root": {
    height: "30px",
    minWidth: "50px",
    fontSize: "12px",
  }
});
const DetailInput = styled(TextField)({
  right: "6px",
  maxWidth: "40px",
  "& .MuiOutlinedInput-root": {
    height: "30px",
    minWidth: "50px",
    fontSize: "12px",
  }
});
const AliasLabel = styled("div")({
  maxWidth: "65px",
});
const AliasPopover = styled(VisitsPopoverForm)({
  position: "relative",
  width: "10px",
});
const CommentsPopover = styled(CommentsPopoverForm)({
  position: "relative",
  width: "20px",
});
const CheckboxContainer = styled(Grid)({
  display: "flex",
  alignItems: "center",
  height: "48px",
});
const CollapseHeaderButton = styled(Button)({
  padding: 0,
  textDecoration: "underline",
  fontSize: "12px"
});
export default MultiCheckTable;
