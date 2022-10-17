import { Grid, styled } from "@material-ui/core";
import React, { FC, useState, useEffect } from "react";
import AggregateCriteriaCard from "./AggregateCriteriaCard";
import SingleInputContent from "./SingleInputContent";
import RangeNumbserContent from "./RangeNumberContent";
import { CriteriaModel } from "../../../../@types/Criteria";
import CriteriaCard from "./CriteriaCard";
import RangeNumbserContentOld from "./RangeNumberContentOld";
import SingleInputContentOld from "./SingleInputContentOld";

export interface CriteriaListProps {
  criteriaList: { inclusion: any[]; exclusion: any[] };
  dataVersion: string;
  addCriteriaToScenario: (criteria: CriteriaModel, type: string, dataVersion: string) => void;
  addAllHistoricalToScenario: (criteria: CriteriaModel[], type: string) => void;
}

export const SYMBLE_TYPE = {
  EQUAL: "=",
  RANGE: "-",
  MIN: "≥",
  MAX: "≤",
}

const CriteriaListContainer: FC<CriteriaListProps> = ({
  criteriaList,
  dataVersion,
  addCriteriaToScenario,
  addAllHistoricalToScenario,
}) => {
  const renderCriteriaList = (criterion: any, type: string, dataVersion: any) => {
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
  const [inclusionCriteriaCategory, setInclusionCriteriaCategory] = useState<
    any[]
  >([]);
  const [exclusionCriteriaCategory, setExclusionCriteriaCategory] = useState<
    any[]
  >([]);
  useEffect(() => {
    const inclusionCategory: any[] = [];
    const exclusionCategory: any[] = [];
    criteriaList.inclusion.forEach((inclusionObj) => {
      const index = inclusionCategory.findIndex(
        (category) => category.id === inclusionObj.id
      );
      if (index < 0) {
        inclusionCategory.push(inclusionObj);
      }
    });
    criteriaList.exclusion.forEach((exclusionObj) => {
      const index = exclusionCategory.findIndex(
        (category) => category.id === exclusionObj.id
      );
      if (index < 0) {
        exclusionCategory.push(exclusionObj);
      }
    });
    setInclusionCriteriaCategory(inclusionCategory);
    setExclusionCriteriaCategory(exclusionCategory);
  }, [criteriaList]);

  const renderCriteraCardByCategory = (category: any, type: string) => {
    // TODO: change criteria model when data version is 2.0.0 abve
    if (dataVersion === "1.0.0") {
      const criteria = category?.criteria;
      if (criteria.length > 0) {
        return (
          <CriteriaCard
            title={category.name}
            actionText="Add All Above 50% Frequency"
            handleAction={() => addAllHistoricalToScenario(criteria, type)}
          >
            {criteria.map((criterion: any) => {
              return renderCriteriaList(criterion, type, dataVersion);
            })}
          </CriteriaCard>
        );
      }
    } else {
      const aggregateCriteria = category?.criteria || [];
      if (aggregateCriteria.length > 0) {
        return (
          <AggregateCriteriaCard title={category.name}>
            {aggregateCriteria.map((criterion: any) => {
              return renderCriteriaList(criterion, type, dataVersion);
            })}
          </AggregateCriteriaCard>
        );
      }
    }
    return null;
  };
  const renderCriteria = (data: { categories: any[]; title: string }[]) => {
    return data.map((obj) => {
      const { categories, title } = obj;
      const criteriaType = title === "Inclusion" ? "Include" : "Exclude";
      if (categories.length > 0) {
        return (
          <>
            <ListTitle>{title}</ListTitle>
            {categories.map((category) =>
              renderCriteraCardByCategory(category, criteriaType)
            )}
          </>
        );
      }
      return null;
    });
  };
  return (
    <RightStuff>
      <Title>
        Frequently Occurring Criteria from Similar Historical Lilly Trials
      </Title>
      <Description>
        Continue your curation of I/E criteria by considering relevant
        historical data from similar trials. Add, remove, or edit your existing
        criteria, and filter/sort by using the dropdown below.
      </Description>
      {renderCriteria([
        { categories: inclusionCriteriaCategory, title: "Inclusion" },
        { categories: exclusionCriteriaCategory, title: "Exclusion" },
      ])}
    </RightStuff>
  );
};

const RightStuff = styled(Grid)({
  marginTop: "3.375rem",
  background: "#ffffff",
  width: "100%",
  padding: "0 3.813rem",
});
const ListTitle = styled(Grid)({
  marginTop: "20px",
  fontSize: "1.2rem",
  fontFamily: "Helvetica",
  color: "#000000",
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
});
export default CriteriaListContainer;
