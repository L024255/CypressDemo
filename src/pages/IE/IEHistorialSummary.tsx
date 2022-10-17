import React, { useState, useEffect } from "react";
import { Grid, Typography, styled, Link } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import SeperateTable from "../../components/CustomSeperateTable";
import SummaryCard from "./components/SummaryCard";
import { QueryByStringWithClient } from "../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../components/CustomErrorBar";
import { formatTime, formatUserName } from "../../utils/getDataUtil";
import { CriteriaCategoryModel } from "../../@types/CriteriaCategory";
import { checkType } from "../../utils/criteriaUtils";
interface IEHistorialSummaryProps {
  scenarioId: string;
}

const IEHistorialSummary: React.FC<IEHistorialSummaryProps> = ({
  scenarioId,
}) => {
  const title = "Your Selections Against Historical Data";
  const descripiotn =
    "Compare the entities you've selected in the I/E Criteria Builder tab to relevant historical data from past similar Lilly T2DM trials. Trial similarity is determined by therapeutic area, indication, and trial phase.";
  const criteriaTableColumns = [
    "Appears in similar trials? (Y/N)",
    "How often does criterion occur in similar trials (%)?",
    "My selected modifier values",
    "Most common modifier values in similar trials",
  ];
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [historicalCriteria, setHistoricalCriteria] = useState<any>({});
  const [scenarioCriteria, setScenarioCriteria] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [savedInfo, setSavedInfo] = useState("");
  const [criteriaCategories, setCriteriaCategories] = useState<CriteriaCategoryModel[]>([]);

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

  const getHistoricalScenarioById = (scenarioId: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchHistoricalCriteria, {
      id: scenarioId,
    })
      .then((res: any) => {
        const historicalCriteria = res.data.historicalCriteria;
        setHistoricalCriteria(historicalCriteria);
      })
      .catch((error: any) => {
        setSysError(error.message || "Fetch scenario failed.");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const getScenarioCriteriaById = (scenarioId: string) => {
    QueryByStringWithClient(graphqlStringMap.fetchScenarioCriteria, {
      id: scenarioId,
    })
      .then((res: any) => {
        const scenarioCriteria = res.data.scenario?.scenarioCriteria || [];
        const time = res.data.scenario.scenarioUpdatedAt;
        const user = res.data.scenario.scenarioUpdatedBy?.name || "";
        const timeString = formatTime(time);
        const authorString = formatUserName(user);
        setSavedInfo(`Last saved ${timeString} by ${authorString}`);
        setScenarioCriteria(scenarioCriteria);
      })
      .catch((error: any) => {
        setSysError(error.message || "Fetch scenario failed.");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const combineSummaryTableData = (historyCriteria: any, scenarioCriteria: any[]) => {
    const historicalCriteria = historyCriteria;
    const historicalInclusionCategories = historicalCriteria.inclusion;
    const historicalExclusionCategories = historicalCriteria.exclusion;

    const inclusionCategories: {
      id?: string;
      title: string;
      type?: string;
      columns: any[];
      leftData: any[];
      rightData: any[];
    }[] = criteriaCategories.map((category: CriteriaCategoryModel) => {
      return {
        id: category.id,
        title: category.name,
        type: "Include",
        columns: criteriaTableColumns,
        leftData: [],
        rightData: []
      }
    });
    const exclusionCategories: {
      id?: string;
      title: string;
      type?: string;
      columns: any[];
      leftData: any[];
      rightData: any[];
    }[] = criteriaCategories.map((category: CriteriaCategoryModel) => {
      return {
        id: category.id,
        title: category.name,
        type: "Exclude",
        columns: criteriaTableColumns,
        leftData: [],
        rightData: []
      }
    });;
    const originCriteria: {
      type: any;
      criterionName: any;
      criterionId: any;
      min: any;
      max: any;
      equal: any;
      tempModifier: any;
      unit: any;
      categoryId: any;
      categoryName: any;
    }[] = scenarioCriteria.map((criterion: any) => {
      return {
        type: criterion.type,
        criterionName: criterion.criterion?.name,
        criterionId: criterion.criterionId,
        min: criterion.min,
        max: criterion.max,
        equal: criterion.equal,
        tempModifier: criterion.tempModifier,
        unit: criterion.unit,
        categoryId: criterion.criterion?.criteriaCategoryId,
        categoryName: criterion.criterion?.criteriaCategory?.name,
      };
    });
    let historicalCriteriaArray: any[] = [];
    historicalInclusionCategories?.forEach((category: any) => {
      historicalCriteriaArray = historicalCriteriaArray.concat(category.criteria);
    });
    historicalExclusionCategories?.forEach((category: any) => {
      historicalCriteriaArray = historicalCriteriaArray.concat(category.criteria);
    });
    const includeCategoriesArr = inclusionCategories.sort((category1, category2) => category1.title.localeCompare(category2.title));
    const excludeCategoriesArr = exclusionCategories.sort((category1, category2) => category1.title.localeCompare(category2.title));
    const categories = [...includeCategoriesArr, ...excludeCategoriesArr];
    const combineData = categories.map((category) => {
      const leftData: any[] = [];
      const rightData: any[] = [];
      originCriteria.forEach((criterion) => {
        if (criterion.categoryId === category.id && criterion.type === category.type) {
          const index = historicalCriteriaArray.findIndex((historicalCriterion: any) =>
            historicalCriterion.id === criterion.criterionId && checkType(criterion.type, historicalCriterion.type)
          );
          let value = "";
          let frequency = "N/A";
          let appearInSimilarTrial = "No";
          let historicalSelection = "";
          let quantMod1 = true;
          let quantMod2 = true;
          if (index > -1) {
            const historicalCriterion = historicalCriteriaArray[index];
            frequency = `${(historicalCriterion.freq * 100).toFixed()}%`
            appearInSimilarTrial = historicalCriterion.appears ? "Yes" : "No"
            if (historicalCriterion.min && historicalCriterion.max) {
              historicalSelection = `${historicalCriterion.min} - ${historicalCriterion.max}`;
            } else if (historicalCriterion.min) {
              historicalSelection = `≥ ${historicalCriterion.min}`
            } else if (historicalCriterion.max) {
              historicalSelection = `≤ ${historicalCriterion.max}`
            } else if (historicalCriterion.equal) {
              historicalSelection = `= ${historicalCriterion.equal}`
            } else {
              quantMod1 = false;
            }
            if (historicalCriterion.unit) {
              historicalSelection += ` ${historicalCriterion.unit}`;
            }
            if (historicalCriterion.tempModifier) {
              if (quantMod1) {
                historicalSelection += ';';
              }
              
              historicalSelection += ` ${historicalCriterion.tempModifier}`
            }
          }
          if (criterion.min && criterion.max) {
            value = `${criterion.min} - ${criterion.max}`;
          } else if (criterion.min) {
            value = `≥ ${criterion.min}`
          } else if (criterion.max) {
            value = `≤ ${criterion.max}`
          } else if (criterion.equal) {
            value = `= ${criterion.equal}`
          } else {
            quantMod2 = false;  
          }
          if (criterion.unit) {
            value += ` ${criterion.unit}`;
          }
          if (criterion.tempModifier) {
            if (quantMod2) {
              value += ';';
            }

            value += ` ${criterion.tempModifier}`
          }

          if (!value) {
            value = 'N/A';
          }

          if (!historicalSelection) {
            historicalSelection = 'N/A';
          }

          leftData.push(criterion.criterionName);
          rightData.push([
            appearInSimilarTrial,
            frequency,
            value,
            historicalSelection
          ]);
        }
      });
      return {
        title: category.title,
        type: category.type,
        columns: criteriaTableColumns,
        leftData,
        rightData
      }
    })
    setSummaryData(combineData);
  }

  useEffect(() => {
    getCriteriaCategories();
    if (scenarioId) {
      getHistoricalScenarioById(scenarioId);
      getScenarioCriteriaById(scenarioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);
  useEffect(() => {
    combineSummaryTableData(historicalCriteria, scenarioCriteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historicalCriteria, scenarioCriteria])
  return (
    <PageContainer container>
      <CustomLoading open={loading} />
      <CustomErrorBar
        open={Boolean(sysError)}
        content={sysError}
        onClose={() => setSysError("")}
      />
      <Title variant="caption">{title}</Title>
      <Description variant="body1">{descripiotn}</Description>
      <SavedInfoContainer>
        <Check fontSize="small" />
        <SavedInfo>{savedInfo}</SavedInfo>
      </SavedInfoContainer>
      <SummaryCardContainer container>
        <SummaryCard
          style={{ width: "48%" }}
          value={scenarioCriteria?.length.toString()}
          description="Number of Selected Entities in Scenario"
        />
        <SummaryCard
          style={{ width: "48%" }}
          value={historicalCriteria.min && historicalCriteria.max ? `${historicalCriteria.min}-${historicalCriteria.max}` : "N/A"}
          description="Range (Min - Max) # of Entities in Past Similar Lilly Trials"
        />
      </SummaryCardContainer>
      <ActionContainer>
        <Action underline="always" href={`/criteriaBuilder/${scenarioId}`}>
          Modify My Selection
        </Action>
      </ActionContainer>
      <SectionTitle>Inclusion</SectionTitle>
      <InclusionsContainer>
        {summaryData.filter((a) => a.type === "Include" && a.leftData.length > 0).map((inclusion: any, tableIndex) => {
          const rightData = inclusion.rightData.map((row: any[]) => {
            const newRow = row.map((column: any) => {
              return { val: column };
            });
            return newRow;
          });
          const leftData = inclusion.leftData.map((row: any) => {
            return [row];
          });
          return (
            <SeperateTable
              tableId={`table-include-${tableIndex}`}
              title={inclusion.title}
              leftColumns={[{label: "My Selection"}]}
              leftData={leftData}
              rightColumns={inclusion.columns.map((columnTitle: any) => { return {label: columnTitle} })}
              rightData={rightData}
              style={{ marginTop: "0.875rem" }}
              leftStyle={{ gridColumn: 1 }}
              rightStyle={{ gridColumn: "2 / 30"}}
            />
          )
        }
        )}
      </InclusionsContainer>
      <InclusionsContainer>
        <SectionTitle>Exclusion</SectionTitle>
        {summaryData.filter((a) => a.type === "Exclude" && a.leftData.length > 0).map((inclusion: any, tableIndex) => {
          const rightData = inclusion.rightData.map((row: any[]) => {
            const newRow = row.map((column: any) => {
              return { val: column };
            });
            return newRow;
          });
          const leftData = inclusion.leftData.map((row: any) => {
            return [row];
          });
          return (
            <SeperateTable
              tableId={`table-exclude-${tableIndex}`}
              title={inclusion.title}
              leftColumns={[{label: "My Selection"}]}
              leftData={leftData}
              rightColumns={inclusion.columns.map((columnTitle: any) => { return {label: columnTitle} })}
              rightData={rightData}
              style={{ marginTop: "0.875rem" }}
              leftStyle={{ gridColumn: 1 }}
              rightStyle={{ gridColumn: "2 / 30" }}
            />
          )
        }
        )}
      </InclusionsContainer>
    </PageContainer>
  );
};

const ActionContainer = styled("div")({
  textAlign: "right",
  width: "100%",
  marginTop: "20px",
});

const Action = styled(Link)({
  fontSize: "0.75rem",
  color: "#D52B1E",
  lineHeight: "0.875rem",
});

const PageContainer = styled(Grid)({
  display: "flex",
  margin: "auto",
  padding: "3.25rem 6.5rem",
  maxWidth: "105rem",
  paddingBottom: "8rem",
});
const Title = styled(Typography)({
  fontSize: "1.5rem",
  color: "#000000",
  lineHeight: "1.813rem",
});
const SectionTitle = styled(Typography)({
  fontSize: "1.5rem",
  color: "#000000",
  lineHeight: "1.813rem",
});
const Description = styled(Typography)({
  fontSize: "1rem",
  color: "#000000",
  lineHeight: "1.5rem",
  marginTop: "0.5rem",
});
const SavedInfoContainer = styled(Grid)({
  color: "#A59D95",
  display: "flex",
  width: "100%",
  marginTop: "0.5rem",
});
const SavedInfo = styled(Typography)({
  lineHeight: "1.375rem",
  fontSize: "0.75rem",
  marginLeft: "0.125rem",
});
const SummaryCardContainer = styled(Grid)({
  marginTop: "1.813rem",
  display: "flex",
  justifyContent: "space-between",
});
const InclusionsContainer = styled(Grid)({
  marginBottom: "0.875rem"
});
export default IEHistorialSummary;
