import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonBase, Grid, makeStyles, styled, Tab, Tabs, TextField, Tooltip, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ScenarioCriteriaModle } from "./type/ScenarioCriteriaModel";
import { Autocomplete } from "@material-ui/lab";
import { Clear, DragIndicator } from "@material-ui/icons";
import {
  fetchByGraphqlString,
  graphqlStringMap,
} from "../../../api/fetchByTypes";
import { CriteriaModel } from "../../../@types/Criteria";
import { useUpdateScenarioCriteria } from "../../../hooks/useUpdateScenarioCriteria";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../../components/CustomErrorBar";
import { CriteriaCategoryModel } from "../../../@types/CriteriaCategory";
import { QueryByStringWithClient } from "../../../api/apollo";
import ButtonSubmit from "./components/ButtonSubmit";
import { CustomCriteriaFormModal } from "./components/CustomCriteriaFormModal";
import AppBreadcrumb from "../../../components/AppBreadcrumb";
import SingleInputContent from "./components/SingleInputContent";
import RangeNumbserContent from "./components/RangeNumberContent";
import SingleInputContentOld from "./components/SingleInputContentOld";
import RangeNumbserContentOld from "./components/RangeNumberContentOld";
import { SearchIcon } from "../../../components/SearchBar/SearchBar";
import IEHistorialSummary from "../IEHistorialSummary";
import { debounce } from "lodash";
export interface CriteriaBuilderProps { }
export const SYMBLE_TYPE = {
  EQUAL: "=",
  RANGE: "-",
  MIN: "≥",
  MAX: "≤",
}

const CriteriaBuilder: React.FC<CriteriaBuilderProps> = () => {
  const { push } = useHistory();
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [alert, setAllert] = useState("");
  const [dataVersion, setDataVersion] = useState("");
  const [criterias, setCriterias] = useState<CriteriaModel[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [customCriterion, setCustomCriterion] = useState<{
    category?: {
      id: string;
      name: string;
      type: string;
    }
    criterion?: CriteriaModel;
    newCustomCriterionName?: string;
  }>();
  const [editSearchAddCritiera, setEditSearchAddCritiera] = useState(false);
  const {
    trialworkspaceId,
    scenarioId,
  }: any = useParams();
  const searchCriteriaUseStyles = makeStyles((theme) => ({
    root: {
      width: "150px",
    },
  }));
  const searchCriteriaClasses = searchCriteriaUseStyles();
  const [historicalCriteria, setHistoricalCriteria] = useState<any>({
    inclusion: [],
    exclusion: [],
  });
  const [historicalAggregateCriteria, setHistoricalAggregateCriteria] = useState<any>({
    inclusion: [],
    exclusion: []
  });
  const [criteriaCategories, setCriteriaCategories] = useState<
    CriteriaCategoryModel[]
  >([]);
  const [selectedCriterias, setSelectedCriterias] = useState<
    ScenarioCriteriaModle[]
  >([]);
  const [includeSelectedCriteria, setIncludeCriteria] = useState<ScenarioCriteriaModle[]>([]);
  const [excludeSelectedCriteria, setExcludeCriteria] = useState<ScenarioCriteriaModle[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [tabTitles] = useState([
    "Inclusion",
    "Exclusion",
    "View I/E Historical Summary"
  ])
  const [includeFilterCategories, setIncludeFilterCategories] = useState<CriteriaCategoryModel[]>([]);
  const [excludeFilterCategories, setExcludeFilterCategories] = useState<CriteriaCategoryModel[]>([]);
  const [addValueExist, setAddValueExist] = useState(false);
  const {
    addScenarioCriteria,
    deleteSenarioCriteria,
    addCustomScenarioCriteria,
    updateScenarioCriteria,
  } = useUpdateScenarioCriteria();
  const handleUpdateScenarioCriteria = debounce(updateScenarioCriteria, 2000)
  const getScenarioInfo = () => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchScenario, {
      id: scenarioId,
    })
      .then((res: any) => {
        const scenarioCriteria = res.data?.scenario?.scenarioCriteria || [];
        const dataVersionId = res.data?.scenario?.trialWorkspace?.dataVersionId;
        const dataVersionName = res.data?.scenario?.trialWorkspace?.dataVersion.name;
        setDataVersion(dataVersionName);
        getCriterias(dataVersionId);

        const arr: any[] = [];
        scenarioCriteria.forEach((scenarioCriterion: any) => {
          const selectedCriteria: ScenarioCriteriaModle = {
            id: scenarioCriterion.id,
            categoryId: scenarioCriterion.criterion?.criteriaCategoryId || "",
            name: scenarioCriterion.criterion?.name || "",
            scenarioId: scenarioId,
            criterionId: scenarioCriterion.criterionId,
            type: scenarioCriterion.type,
            min: scenarioCriterion.min,
            max: scenarioCriterion.max,
            equal: scenarioCriterion.equal,
            tempModifier: scenarioCriterion.tempModifier,
            unit: scenarioCriterion.unit,
            order: scenarioCriterion.order,
          };
          arr.push(selectedCriteria);
        });
        setSelectedCriterias(arr);
      })
      .catch((error: any) => {
        console.log(error);
        setSysError(error.message || "There was an error, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getCriteriaCategories = () => {
    setLoading(true);
    fetchByGraphqlString(graphqlStringMap.fetchCriteriaCategories)
      .then((res: any) => {
        const categories = res.data?.criteriaCategories || [];
        setCriteriaCategories(categories);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getCriterias = (dataVersionId: string) => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchAllCriterias, {
      dataVersionId
    })
      .then((res: any) => {
        const criterias = res.data?.criteria || [];
        setCriterias(criterias);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getHistoryCriteria = () => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchHistoricalCriteria, {
      id: scenarioId,
    })
      .then((res: any) => {
        const historicalCriteria = res.data?.historicalCriteria || {
          inclusion: [],
          exclusion: [],
        };
        setHistoricalCriteria(historicalCriteria);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getHistoryAggregateCriteria = () => {
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.fetchHistoricalAggregateCriteria, {
      id: scenarioId,
    })
      .then((res: any) => {
        const historicalAggregateCriteria = res.data?.historicalCriteria || {
          inclusion: [],
          exclusion: [],
        };
        setHistoricalAggregateCriteria(historicalAggregateCriteria);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const handleAddCriteria = (criteria: any, type: string) => {
    let order = selectedCriterias.length + 1;
    if (type === "Include") {
      order = includeSelectedCriteria.length + 1;
    } else if (type === "Exclude") {
      order = excludeSelectedCriteria.length + 1;
    }
    const AddedCriteria: ScenarioCriteriaModle = {
      scenarioId: scenarioId,
      criterionId: criteria.id,
      type,
      min: Number(criteria.min),
      max: Number(criteria.max),
      equal: Number(criteria.equal),
      tempModifier: criteria.tempModifier,
      unit: criteria.unit,
      order,
    };
    setLoading(true);
    handleCloseModal();
    addScenarioCriteria({ input: [AddedCriteria] })
      .then((res: any) => {
        refreshPage();
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleAddCustomCriteria = (criterion: ScenarioCriteriaModle, type: string) => {
    setLoading(true);
    handleCloseModal();
    let order = selectedCriterias.length + 1;
    if (type === "Include") {
      order = includeSelectedCriteria.length + 1;
    } else if (type === "Exclude") {
      order = excludeSelectedCriteria.length + 1;
    }
    criterion.scenarioId = scenarioId;
    criterion.order = order
    addCustomScenarioCriteria({ input: criterion })
      .then((res: any) => {
        refreshPage();
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRemoveCriteria = (criterionId: string) => {
    setLoading(true);
    deleteSenarioCriteria({ ids: [criterionId] })
      .then((res: any) => {
        const selectedCriteriaArr = [...selectedCriterias];
        const index = selectedCriterias.findIndex((criterion: any) => criterion.id === criterionId);
        if (index > -1) {
          selectedCriteriaArr.splice(index, 1);
        }
        setSelectedCriterias(selectedCriteriaArr)
      })
      .catch((error: any) => {
        setSysError(error.message || "Not able to delete criteria");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleAddCriteraFromSearch = (category?: { id: string, name: string, type: string }, criterion?: CriteriaModel, newCustomCriterionName?: string) => {
    let criterionTemplate = criterion;
    let includeHisCriteria: any[] = [];
    let excludeHisCriteria: any[] = [];
    historicalCriteria.exclusion.forEach((exclusionObj: any) => {
      excludeHisCriteria = excludeHisCriteria.concat(exclusionObj.criteria);

    });
    historicalCriteria.inclusion.forEach((inclusionObj: any) => {
      includeHisCriteria = includeHisCriteria.concat(inclusionObj.criteria);
    });

    let historicalCrit = null

    if (category?.type === 'Include') {
      const includeIndex = includeHisCriteria.findIndex((hisCriterion: any) => hisCriterion.id === criterion?.id);
      historicalCrit = includeHisCriteria[includeIndex];
    } else if (category?.type === 'Exclude') {
      const excludeIndex = excludeHisCriteria.findIndex((hisCriterion: any) => hisCriterion.id === criterion?.id);
      historicalCrit = excludeHisCriteria[excludeIndex];
    }

    criterionTemplate = historicalCrit || criterion;
    setCustomCriterion({ category, criterion: criterionTemplate, newCustomCriterionName });
    setOpenModal(true);
  }
  const autoCompleteRef = useRef<HTMLInputElement>();
  const refreshPage = () => {
    getHistoryCriteria();
    getHistoryAggregateCriteria();
    getCriteriaCategories();
    getScenarioInfo();
  };

  useEffect(() => {
    refreshPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  useEffect(() => {
    const includeCriteriaArr = selectedCriterias
      .filter((criterion: any) => criterion.type === "Include")
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          if (a.order !== null && b.order !== null) {
            return a.order - b.order;
          } else if (a.order === null) {
            return 1;
          }
        }
        return -1;
      });;
    const excludeCriteriaArr = selectedCriterias
      .filter((criterion: any) => criterion.type === "Exclude")
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          if (a.order !== null && b.order !== null) {
            return a.order - b.order;
          } else if (a.order === null) {
            return 1;
          }
        }
        return -1;
      });
    setIncludeCriteria(includeCriteriaArr);
    setExcludeCriteria(excludeCriteriaArr);
  }, [selectedCriterias]);

  const filterHistoricalAggregateCirteria = useCallback(
    (aggregateCriteria: any) => {
      //replace historical criteria with aggregation criteria. when data version is 2.0.0 above.
      const inclusion = aggregateCriteria.inclusion.map((category: any) => {
        const criteria = dataVersion === "1.0.0"
          ? category.criteria?.filter((criterion: any) => criterion.freq * 100 >= 50)
          : category.aggregatedCriteria?.filter((criterion: any) => criterion.criteria.findIndex((criterion: any) => criterion.freq * 100 >= 50) > -1);
        const includeCriteria: any[] = criteria
          .filter(
            (criterion: any) =>
              selectedCriterias.findIndex(
                (selected: ScenarioCriteriaModle) =>
                  selected.criterionId === criterion.id &&
                  selected.type === "Include"
              ) === -1
          )
        return {
          id: category.id,
          name: category.name,
          criteria: includeCriteria,
        };
      });
      const exclusion = aggregateCriteria.exclusion.map((category: any) => {
        const criteria = dataVersion === "1.0.0"
          ? category.criteria?.filter((criterion: any) => criterion.freq * 100 >= 50)
          : category.aggregatedCriteria?.filter((criterion: any) => criterion.criteria.findIndex((criterion: any) => criterion.freq * 100 >= 50) > -1);
        const exclusionCriteria: any[] = criteria
          .filter(
            (criterion: any) =>
              selectedCriterias.findIndex(
                (selected: ScenarioCriteriaModle) =>
                  selected.criterionId === criterion.id &&
                  selected.type === "Exclude"
              ) === -1
          )
        // .filter((criterion: any) => criterion.freq * 100 >= 50);
        return {
          id: category.id,
          name: category.name,
          criteria: exclusionCriteria,
        };
      });
      return {
        inclusion,
        exclusion,
      };
    },
    [selectedCriterias, dataVersion]
  );
  const handleCloseModal = () => {
    setCustomCriterion(undefined);
    setOpenModal(false);
  }
  const handleChangeTabValue = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setTabValue(newValue);
  };
  const renderSelectedChips = useCallback((tabValue: any) => {
    let chipData: any[] = [];
    if (tabValue === 0) {
      chipData = includeSelectedCriteria;
    } else if (tabValue === 1) {
      chipData = excludeSelectedCriteria;
    }
    return <>
      {chipData.map((criterion: any, index) => {
        return (
          <Draggable key={criterion.id} draggableId={criterion.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  background: snapshot.isDragging ? "transparent" : "",
                  ...provided.draggableProps.style
                }}
              >

                <ChipItem
                  style={{ marginRight: "18px" }}
                >
                  <DragIndicator />
                  <ChipTooltip title={criterion.name} aria-label="add">
                    <ChipContent>{criterion.name}</ChipContent>
                  </ChipTooltip>
                  <Clear
                    style={{
                      color: "#D52B1E",
                      width: "1.2rem",
                      marginLeft: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleRemoveCriteria(criterion.id);
                    }}
                  />
                </ChipItem>
              </div>
            )}
          </Draggable>
        )
      })}
    </>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeSelectedCriteria, excludeSelectedCriteria])
  const addCriteriaToScenario = (criteria: any, type: any, dataVersion: any) => {
    if (dataVersion === "1.0.0") {
      handleAddCriteria(criteria, type);
    } else {
      setCustomCriterion({
        category: {
          id: criteria.criteriaCategoryId,
          name: criteria.category,
          type: type,
        },
        criterion: criteria,
      });
      setOpenModal(true);
    }
  }
  const criteriaList = dataVersion === "1.0.0" ? filterHistoricalAggregateCirteria(
    historicalCriteria
  ) : filterHistoricalAggregateCirteria(
    historicalAggregateCriteria
  );
  const renderCriteriaList = useCallback(() => {
    const type = tabValue === 0 ? "Include" : "Exclude"
    if (tabValue === 0) {
      return criteriaList.inclusion.filter((category: any) => {
        const index = includeFilterCategories.findIndex((selectedCategory: any) => selectedCategory.id === category.id);
        return index > -1 || includeFilterCategories.length === 0;
      }).map((category: any) => {
        // if category.id or category.name in filter or filter is empty
        return category.criteria.filter((criterion: any) => {
          return includeSelectedCriteria.findIndex((selectedCriterion: any) => selectedCriterion.id === criterion.id) === -1
        }).map((criterion: any) => renderCriterionCard(criterion, type, dataVersion))
      });
    }
    if (tabValue === 1) {
      return criteriaList.exclusion.filter((category: any) => {
        const index = excludeFilterCategories.findIndex((selectedCategory: any) => selectedCategory.id === category.id);
        return index > -1 || excludeFilterCategories.length === 0;
      }).map((category: any) => {
        // if category.id or category.name in filter or filter is empty
        return category.criteria.filter((criterion: any) => {
          return excludeSelectedCriteria.findIndex((selectedCriterion: any) => selectedCriterion.id === criterion.id) === -1
        }).map((criterion: any) => renderCriterionCard(criterion, type, dataVersion))
      });
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion, tabValue, historicalCriteria, historicalAggregateCriteria, includeFilterCategories, excludeFilterCategories, includeSelectedCriteria, excludeSelectedCriteria]);
  const renderCriterionCard = (criterion: any, type: string, dataVersion: any) => {
    if (dataVersion === "1.0.0") {
      if (criterion.min !== null && criterion.max !== null) {
        return (
          <RangeNumbserContentOld
            key={criterion.id}
            item={criterion.name}
            firstValue={criterion.min}
            secondValue={criterion.max}
            frequencyPercentage={
              criterion.freq ? `${(criterion.freq * 100).toFixed()}%` : "N/A"
            }
            handleClickAdd={(min, max) => {
              const newCriterion = { ...criterion };
              newCriterion.min = min;
              newCriterion.max = max;
              addCriteriaToScenario(newCriterion, type, dataVersion);
            }}
          />
        );
      }
      if (criterion.max !== null) {
        return (
          <SingleInputContentOld
            key={criterion.id}
            item={criterion.name}
            defaultValue={criterion.max}
            symble="≤"
            unit={criterion.unit}
            frequencyPercentage={
              criterion.freq ? `${(criterion.freq * 100).toFixed()}%` : "N/A"
            }
            handleClickAdd={(value) => {
              const newCriterion = { ...criterion };
              newCriterion.max = value;
              addCriteriaToScenario(newCriterion, type, dataVersion);
            }}
          />
        );
      }
      if (criterion.min !== null) {
        return (
          <SingleInputContentOld
            key={criterion.id}
            item={criterion.name}
            defaultValue={criterion.min}
            symble="≥"
            unit={criterion.unit}
            frequencyPercentage={
              criterion.freq ? `${(criterion.freq * 100).toFixed()}%` : "N/A"
            }
            handleClickAdd={(value) => {
              const newCriterion = { ...criterion };
              newCriterion.min = value;
              addCriteriaToScenario(newCriterion, type, dataVersion);
            }}
          />
        );
      }
      if (criterion.equal !== null) {
        return (
          <SingleInputContentOld
            key={criterion.id}
            item={criterion.name}
            defaultValue={criterion.equal}
            unit={criterion.unit}
            frequencyPercentage={
              criterion.freq ? `${(criterion.freq * 100).toFixed()}%` : "N/A"
            }
            handleClickAdd={(equal) => {
              const newCriterion = { ...criterion };
              newCriterion.equal = equal;
              addCriteriaToScenario(newCriterion, type, dataVersion);
            }}
          />
        );
      }
      if (criterion.tempModifier !== null) {
        return (
          <SingleInputContentOld
            key={criterion.id}
            item={criterion.name}
            defaultValue=""
            unit={criterion.tempModifier}
            frequencyPercentage={
              criterion.freq ? `${(criterion.freq * 100).toFixed()}%` : "N/A"
            }
            handleClickAdd={(value) => {
              addCriteriaToScenario(criterion, type, dataVersion);
            }}
          />
        );
      }
      return (
        <SingleInputContentOld
          key={criterion.id}
          item={criterion.name}
          unit={criterion.unit || ""}
          frequencyPercentage={
            criterion.freq ? `${(criterion.freq * 100).toFixed()}%` : "N/A"
          }
          handleClickAdd={(value) => {
            const newCriterion = { ...criterion };
            addCriteriaToScenario(newCriterion, type, dataVersion);
          }}
        />
      );
    } else {
      const internalCriteria = criterion.criteria?.filter((innerCriterion: any) => innerCriterion.internal) || [];
      if (internalCriteria.length > 0) {
        const firstInternalCriterion = internalCriteria[0];
        if (firstInternalCriterion.min !== null && firstInternalCriterion.max !== null) {
          return (
            <RangeNumbserContent
              key={firstInternalCriterion.id}
              item={firstInternalCriterion.name}
              innerCriteria={criterion.criteria}
              handleClickAdd={() => {
                const newCriterion = { ...firstInternalCriterion };
                addCriteriaToScenario(newCriterion, type, dataVersion);
              }}
            />
          );
        }
        if (firstInternalCriterion.max !== null) {
          return (
            <SingleInputContent
              key={firstInternalCriterion.id}
              item={firstInternalCriterion.name}
              defaultValue={firstInternalCriterion.max}
              symble={SYMBLE_TYPE.MAX}
              unit={firstInternalCriterion.unit}
              innerCriteria={criterion.criteria}
              handleClickAdd={() => {
                const newCriterion = { ...firstInternalCriterion };
                addCriteriaToScenario(newCriterion, type, dataVersion);
              }}
            />
          );
        }
        if (firstInternalCriterion.min !== null) {
          return (
            <SingleInputContent
              key={firstInternalCriterion.id}
              item={firstInternalCriterion.name}
              defaultValue={firstInternalCriterion.min}
              symble={SYMBLE_TYPE.MIN}
              unit={firstInternalCriterion.unit}
              innerCriteria={criterion.criteria}
              handleClickAdd={() => {
                const newCriterion = { ...firstInternalCriterion };
                addCriteriaToScenario(newCriterion, type, dataVersion);
              }}
            />
          );
        }
        if (firstInternalCriterion.equal !== null) {
          return (
            <SingleInputContent
              key={firstInternalCriterion.id}
              item={firstInternalCriterion.name}
              defaultValue={firstInternalCriterion.equal}
              unit={firstInternalCriterion.unit}
              innerCriteria={criterion.criteria}
              handleClickAdd={() => {
                const newCriterion = { ...firstInternalCriterion };
                addCriteriaToScenario(newCriterion, type, dataVersion);
              }}
            />
          );
        }
        return (
          <SingleInputContent
            key={firstInternalCriterion.id}
            item={firstInternalCriterion.name}
            unit={firstInternalCriterion.unit || ""}
            innerCriteria={criterion.criteria}
            handleClickAdd={() => {
              const newCriterion = { ...firstInternalCriterion };
              addCriteriaToScenario(newCriterion, type, dataVersion);
            }}
          />
        )
      }
      return (
        <SingleInputContent
          key={criterion.id}
          item={criterion.name}
          unit={""}
          innerCriteria={criterion.criteria}
          handleClickAdd={() => {
            const newCriterion = { ...criterion };
            addCriteriaToScenario(newCriterion, type, dataVersion);
          }}
        />
      )
    }
  };
  const renderFilterCategories = useCallback((isInclude: boolean) => {
    const categoriesChips = isInclude ? criteriaList.inclusion : criteriaList.exclusion
    const selectedCategories = isInclude ? includeFilterCategories : excludeFilterCategories;
    return categoriesChips.map((category: any) => {
      const selected = selectedCategories.findIndex((selected) => selected.id === category.id) > -1;
      return (
        <FilterChipItem
          style={selected ? { background: "#E2B8B4", fontWeight: "bold" } : {}}
        >
          <ChipTooltip title={category.name} aria-label="add">
            <ChipContent
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleChangeFilter(category, tabValue === 0);
              }
              }>{category.name}</ChipContent>
          </ChipTooltip>
        </FilterChipItem>
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaList.inclusion, criteriaList.exclusion, includeFilterCategories, excludeFilterCategories, tabValue]);
  const handleChangeFilter = useCallback((value: any, isInclude: boolean) => {
    const categories = isInclude ? [...includeFilterCategories] : [...excludeFilterCategories];
    if (value) {
      const index = categories.findIndex((category) => category.id === value?.id);
      if (index === -1) {
        categories.push({
          id: value.id,
          name: value.name
        });
      } else {
        categories.splice(index, 1);
      }
      if (isInclude) {
        setIncludeFilterCategories(categories);
      } else {
        setExcludeFilterCategories(categories);
      }
    }
  }, [includeFilterCategories, excludeFilterCategories])
  const renderSearchForm = useCallback((criteriaOptions: CriteriaModel[], isInclusion: boolean) => {
    const filterCriteria = isInclusion ? includeSelectedCriteria : excludeSelectedCriteria;
    const options = criteriaOptions
      .filter((option: CriteriaModel) => {
        const index = filterCriteria.findIndex((criterion: any) => criterion.criterionId === option.id);
        return index === -1;
      });
    return (
      <>
        <SearchCriteriaFrom>
          <Autocomplete
            style={{ width: "300px" }}
            freeSolo
            id="auto-complete"
            getOptionLabel={(option) => option.name}
            options={options}
            renderInput={(params) => (
              <>
                <TextField
                  {...params}
                  inputMode="text"
                  style={{ width: "200px", marginLeft: "10px" }}
                  inputRef={autoCompleteRef}
                  classes={{ root: searchCriteriaClasses.root }}
                  onChange={(e) => {
                    const addValue = e.target.value;
                    const isExistInSelectCriteria = selectedCriterias.findIndex((criterion) => criterion.name === addValue) > -1;
                    setAddValueExist(isExistInSelectCriteria);
                  }}
                />
                <AddCriteriaButton
                  disabled={addValueExist}
                  style={addValueExist ? { backgroundColor: "#F5F5F5", opacity: 0.4 } : {}}
                  onClick={() => {
                    const addValue = autoCompleteRef?.current?.value;
                    const addCriteria = criteriaOptions.find(
                      (criteria: CriteriaModel) => criteria.name === addValue
                    );
                    if (addCriteria) {
                      const category = {
                        id: addCriteria.criteriaCategoryId,
                        name: addCriteria.category,
                        type: isInclusion ? "Include" : "Exclude",
                      }
                      handleAddCriteraFromSearch(category, addCriteria);
                    } else if (addValue) {
                      handleAddCriteraFromSearch(undefined, undefined, addValue);
                    }
                    if (autoCompleteRef && autoCompleteRef.current) {
                      autoCompleteRef.current.value = "";
                    }
                    setEditSearchAddCritiera(false);
                    setAddValueExist(false);
                  }}
                >
                  Add
                </AddCriteriaButton>
              </>
            )}
            onBlur={(e) => {
              setEditSearchAddCritiera(false);
              setAddValueExist(false);
            }}
          />
        </SearchCriteriaFrom>
        {addValueExist && <ErrorText>Criterion already exists in selected list</ErrorText>}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeSelectedCriteria, excludeSelectedCriteria, addValueExist]);
  return (
    <Container>
      <CustomLoading open={loading} />
      <CustomErrorBar
        open={Boolean(sysError)}
        content={sysError}
        onClose={() => {
          setSysError("");
        }}
      />
      <CustomErrorBar
        open={Boolean(alert)}
        content={alert}
        isSuccess
        onClose={() => {
          setAllert("");
        }}
      />
      <CustomCriteriaFormModal
        open={openModal}
        handleClose={() => {
          handleCloseModal();
        }}
        categoryOptions={criteriaCategories}
        category={customCriterion?.category}
        templateCriterion={customCriterion?.criterion}
        criterionAddToType={tabValue === 0 ? "Include" : "Exclude"}
        newCustomCriterionName={customCriterion?.newCustomCriterionName}
        handleAddCriterion={handleAddCriteria}
        handleAddCustomCriterion={(criterion: ScenarioCriteriaModle) => handleAddCustomCriteria(criterion, tabValue === 0 ? "Include" : "Exclude")}
      />
      <ContentContainer>
        <BreadcrumbContainer>
          <AppBreadcrumb
            links={[
              { href: "/", text: "" },
              { href: `/trial-homepage/${trialworkspaceId}`, text: "Trial Homepage" },
              { href: `/edit-scenario/${scenarioId}`, text: "Edit Scenario" },
              { text: "I/E Criteria Builder", currentPage: true },
            ]}

          />
        </BreadcrumbContainer>
        <CriteriaInformaiton>
          <Title>
            IE CRITERIA BUILDER
          </Title>
          <SubTitle>
            Frequently Occurring Criteria From Historical Trials
          </SubTitle>
          <Description>
            Continue your curation of I/E criteria by considering relevant
            historical data from similar trials you've selected. Add, remove, or edit your existing criteria, and filter/sort by using the dropdown below. Use the <DragIndicator style={{ position: "relative", top: "5px" }} /> icon to drag and drop the inclusion criteria in the order you prefer.
          </Description>
        </CriteriaInformaiton>
        <CriteriaNavigationContainer>
          <StyledTapBar>
            <Tabs value={tabValue} onChange={handleChangeTabValue} indicatorColor="primary">
              {tabTitles &&
                tabTitles.map((title, index) => {
                  const activeClass = tabValue === index ? "active" : "";
                  return (
                    <StyledTab
                      className={`${activeClass}`}
                      label={title}
                      id={`criteria-tab-${index}`}
                      aria-controls={`criteria-tab-panel-${index}`}
                    />
                  );
                })}
            </Tabs>
            <ExportButton
              variant="contained"
              color="primary"
              onClick={() => {
                // getDownloadSoA(scenarioId);
              }}
            >
              Export I.E. Criteria
            </ExportButton>
          </StyledTapBar>
        </CriteriaNavigationContainer>
        <CriteriaPageCard>
          {
            tabValue === 2 ? (
              <>
                <IEHistorialSummary scenarioId={scenarioId} />
              </>
            ) : (
              <>
                <GroupTitle>{tabValue === 0 ? `Selected Inclusion Criteria` : `Selected Exclusion Criteria`}</GroupTitle>
                <SelectedCriteriaContainer>
                  <AddNewCriteriaInputContainer>
                    {
                      editSearchAddCritiera ?
                        renderSearchForm(criterias, tabValue === 0) :
                        (
                          <AddNew onClick={() => { setEditSearchAddCritiera(true) }}>
                            Add New
                            <SearchIcon
                              style={{
                                color: "rgba(0, 0, 0, 0.38)",
                                width: "1.2rem",
                                marginLeft: "15px",
                              }}
                            />
                          </AddNew>
                        )
                    }
                  </AddNewCriteriaInputContainer>
                  <Grid>
                    <DragDropContext onDragEnd={(result) => {
                      if (!result.destination) {
                        return;
                      }
                      const items = tabValue === 0 ? [...includeSelectedCriteria] : [...excludeSelectedCriteria];
                      const removed: any = items.splice(result.source.index, 1)[0];
                      items.splice(result.destination.index, 0, removed);
                      if (tabValue === 0) {
                        setIncludeCriteria(items);
                      } else {
                        setExcludeCriteria(items);
                      }
                      const input = items.map((criterion: ScenarioCriteriaModle, index) => {
                        const result: ScenarioCriteriaModle = {
                          scenarioId: criterion.scenarioId,
                          id: criterion.id,
                          type: criterion.type,
                          order: index,
                        };
                        return result
                      });
                      handleUpdateScenarioCriteria({ input });
                    }}>
                      <Droppable droppableId={tabValue === 0 ? `selected-inclusion-criteria-dropppable` : `selected-exclusion-criteria-dropppable`} direction="horizontal">
                        {(provided) => (
                          <SelectedCriteriaChipsContainer
                            container
                            innerRef={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {renderSelectedChips(tabValue)}
                            {provided.placeholder}
                          </SelectedCriteriaChipsContainer>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Grid>
                </SelectedCriteriaContainer>
                <GroupTitle>{tabValue === 0 ? `Inclusion Criteria` : `Exclusion Criteria`}</GroupTitle>
                <CriteriaListContainer>
                  <CriteriaListFilterContainer>
                    {renderFilterCategories(tabValue === 0)}
                  </CriteriaListFilterContainer>
                  <CriteriaListContent container>
                    {renderCriteriaList()}
                  </CriteriaListContent>
                </CriteriaListContainer>
              </>
            )
          }
        </CriteriaPageCard>
      </ContentContainer>
      <ButtonSubmit
        content={"Submit"}
        onClick={() => { push(`/IE/editScenario/${scenarioId}`) }}
      />
    </Container >
  );
};

const Container = styled(Grid)({});
const ContentContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  maxWidth: "1600px",
  margin: "auto",
  padding: "0 80px",
})
const BreadcrumbContainer = styled(Grid)({
  marginBottom: "2.125rem",
  marginTop: "2rem",
});
const CriteriaInformaiton = styled(Grid)({});
const Title = styled(Grid)({
  fontSize: "1.5rem",
  fontFamily: "Helvetica",
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "#000000",
});
const SubTitle = styled(Grid)({
  fontSize: "1.2rem",
  fontWeight: 500,
  fontFamily: "Helvetica",
  color: "#000000",
  marginTop: "10px",
});
const Description = styled(Grid)({
  fontSize: "1rem",
  fontFamily: "Helvetica",
  color: "#000000",
  marginTop: "10px",

});
const CriteriaNavigationContainer = styled(Grid)({
  position: "relative",
  marginTop: "20px"
});
const StyledTapBar = styled(Grid)({
  display: "flex",
  position: "relative",
});
const StyledTab = styled(Tab)(({ theme }) => ({
  "&&:hover": {
    cursor: "pointer",
    boxShadow: `inset 0 -3px 0 0 #D52B1E`,
  },
  "&.active": {
    cursor: "pointer",
    color: theme.palette.primary.main,
    boxShadow: `inset 0 -3px 0 0 #D52B1E`,
  },
}));
const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: "3rem",
  marginLeft: "1rem",
  fontWeight: 500,
  position: "absolute",
  right: 0,
}));
const CriteriaPageCard = styled(Grid)({
  width: "100%",
  background: "#FFFFFF",
  boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.3)",
  borderRadius: "4px",
  marginTop: "1.875rem",
  clear: "both",
  padding: "1.875rem 22px",
});
const SelectedCriteriaContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  // justifyContent: "space-between",
  marginBottom: "30px",
  marginTop: "10px",
});
const SelectedCriteriaChipsContainer = styled(Grid)({
  display: "flex",
});
const AddNewCriteriaInputContainer = styled(Grid)({})
const GroupTitle = styled(Grid)({
  fontSize: "0.75rem",
  color: "#5F5F5F",
  marginRight: "3.125rem",
  letterSpacing: "1px",
  textTransform: "uppercase"
});
const CriteriaListContainer = styled(Grid)({
});
const CriteriaListFilterContainer = styled(Grid)({
  display: "flex",
  height: "65px",
  alignItems: "center",
});
const CriteriaListContent = styled(Grid)({});

const ChipItem = styled(Grid)({
  height: "2.75rem;",
  lineHeight: "2.75rem",
  borderRadius: "1.375rem;",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "0.875rem;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  paddingLeft: "16px",
  paddingRight: "16px",
  background: "#EBEAE7",
  marginTop: "12px",
  "&.child": {
    background: "#D5D2CB",
  },
});
const FilterChipItem = styled(ChipItem)({
  height: "2.5rem",
  background: "#E0E0E0",
  marginRight: "10px",
})
const ChipTooltip = styled(Tooltip)({
  fontSize: "1rem",
});
const ChipContent = styled(Grid)({
  overflow: "hidden;",
  textOverflow: "ellipsis;",
  whiteSpace: "nowrap",
  maxWidth: "10.338rem",
  display: "inline-block",
});
const AddNew = styled(ButtonBase)({
  width: "20.313rem;",
  height: "2.75rem;",
  borderRadius: "22px;",
  border: "1px dashed #9E9E9E",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "0.875rem;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  clear: "both",
  padding: "0 20px",
  "&&:focus-visible": {
    outline: "-webkit-focus-ring-color auto 1px !important",
  },
});

const AddCriteriaButton = styled(ButtonBase)({
  width: "64px",
  height: "30px",
  background: "#F9F9F9",
  borderRadius: "25px",
  border: "1px solid #D52B1E",
});
const SearchCriteriaFrom = styled("div")({
  width: "20.313rem",
  height: "2.75rem",
  borderRadius: "22px",
  border: "1px dashed rgba(130, 120, 111, 0.4)",
  fontSize: "10px",
  color: "#252525",
  lineHeight: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const ErrorText = styled(Typography)({
  fontSize: "10px",
  color: "#D52B1E",
  marginLeft: "15px",
})
export default CriteriaBuilder;
