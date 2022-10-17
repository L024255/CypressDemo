import { Grid, styled } from "@material-ui/core";
import React from "react";
import ChipCard from "./ChipCard";
import { ScenarioCriteriaModle } from "../type/ScenarioCriteriaModel";
import { CriteriaModel } from "../../../../@types/Criteria";
import { CriteriaCategoryModel } from "../../../../@types/CriteriaCategory";

export interface SelectedCriteriaProps {
  scenarioId: string;
  criterias: CriteriaModel[];
  historicalCriteria: any;
  criteriaCategories: CriteriaCategoryModel[];
  selectedCriterias: ScenarioCriteriaModle[];
  handleAddCriteria: (category: { id: string, name: string, type: string }, criteria?: CriteriaModel, newCustomCriterionName?: string) => void;
  handleRemoveCriteria: (criterionId: string) => void;
}
const SelectCriteriaContainer: React.FC<SelectedCriteriaProps> = ({
  scenarioId,
  criterias,
  // historicalCriteria,
  criteriaCategories,
  selectedCriterias,
  handleAddCriteria,
  handleRemoveCriteria,
}) => {

  const formatSelectedCriteria = (criteria?: ScenarioCriteriaModle) => {
    let result = "";
    let quantMod = true;
    if (criteria) {
      if (criteria.min && criteria.max) {
        result = `${criteria.name} ${criteria.min}-${criteria.max}`;
      } else if (criteria.min) {
        result = `${criteria.name} ≥ ${criteria.min}`;
      } else if (criteria.max) {
        result = `${criteria.name} ≤ ${criteria.max}`;
      } else if (criteria.equal) {
        result = `${criteria.name} = ${criteria.equal}`;
      } else {
        result = `${criteria.name}`;
        quantMod = false;
      }
      if (criteria.unit) {
        result += ` ${criteria.unit}`;
      }
      if (criteria.tempModifier) {
        if (quantMod) {
          result += ';';
        }
        result += ` ${criteria.tempModifier}`;
      }
    }
    return result;
  };
  const filterCriteriaBySelectedCriteria = (selectedCriterias: ScenarioCriteriaModle[], categoryId: string) => {
    return criterias.filter((optionCriterion: CriteriaModel) => {
      const index = selectedCriterias.findIndex((criterion: ScenarioCriteriaModle) => criterion.id === optionCriterion.id)
      return index === -1 && optionCriterion.criteriaCategoryId === categoryId;
    });
  }
  return (
    <LeftStuff>
      <LeftText>Selected Inclusion Criteria</LeftText>
      <LeftContent>
        {criteriaCategories.map((category: CriteriaCategoryModel) => {
          const chipCategories = selectedCriterias
          .filter(
            (criterion: ScenarioCriteriaModle) =>
              criterion.categoryId === category.id &&
              criterion.type === "Include"
          );
          const typeChipCategories = selectedCriterias
          .filter(
            (criterion: ScenarioCriteriaModle) =>
              criterion.type === "Include"
          );
          return (
            <ChipCard
              title={category.name}
              initialChips={chipCategories
                .map((selectedCriteria: ScenarioCriteriaModle, index) => {
                  return {
                    key: index,
                    label: formatSelectedCriteria(selectedCriteria),
                    scenarioCriterionId: selectedCriteria.id,
                    criterionId: selectedCriteria.criterionId,
                    // unit: selectedCriteria.unit || "",
                  };
                })}
              criteriaOptions={filterCriteriaBySelectedCriteria(typeChipCategories, category.id) || []}
              handleAddCriteria={(criterion, newCriterionName) => {
                const templateCategory = {
                  id: category.id,
                  name: category.name,
                  type: "Include"
                }
                handleAddCriteria(templateCategory, criterion, newCriterionName);
                }
              }
              handleDeleteCriteria={(criterionId: string) =>
                handleRemoveCriteria(criterionId)
              }
              search={true}
              clearIcon={true}
            />
          )
        }
        )}
        <LeftTitle>Selected Exclusion Criteria</LeftTitle>
        {criteriaCategories.map((category: CriteriaCategoryModel) => {
          const chipCategories = selectedCriterias
          .filter(
            (criterion: ScenarioCriteriaModle) =>
              criterion.categoryId === category.id &&
              criterion.type === "Exclude"
          );
          const typeChipCategories = selectedCriterias
          .filter(
            (criterion: ScenarioCriteriaModle) =>
              criterion.type === "Exclude"
          );
          return (
            <ChipCard
              title={category.name}
              initialChips={chipCategories
                .map((selectedCriteria: ScenarioCriteriaModle, index) => {
                  return {
                    key: index,
                    label: formatSelectedCriteria(selectedCriteria),
                    scenarioCriterionId: selectedCriteria.id,
                    criterionId: selectedCriteria.criterionId,
                    unit: selectedCriteria.unit,
                  };
                })}
              criteriaOptions={filterCriteriaBySelectedCriteria( typeChipCategories, category.id) || []}
              handleAddCriteria={(criterion, newCriterionName) => {
                const templateCategory = {
                  id: category.id,
                  name: category.name,
                  type: "Exclude"
                }
                handleAddCriteria(templateCategory, criterion, newCriterionName);
                }
              }
              handleDeleteCriteria={(criterionId: string) =>
                handleRemoveCriteria(criterionId)
              }
              search={true}
              clearIcon={true}
            />
          )
        } 
        )}
      </LeftContent>
    </LeftStuff>
  );
};

const LeftStuff = styled(Grid)({
  float: "left",
  maxWidth: "28.75rem",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0 20px 20px",
  background: "#F1F1F1",
});
const LeftText = styled(Grid)({
  fontSize: "24px",
  color: "#000000",
  marginTop: "3.313rem",
  paddingBottom: "25px",
  borderBottom: "1px solid #979797",
  // width: "23.625rem",
  width: "100%",
});

const LeftTitle = styled(Grid)({
  fontSize: "24px",
  color: "#000000",
  marginTop: "2.313rem",
  paddingBottom: "25px",
  borderBottom: "1px solid #979797",
  width: "100%",
  // width: "23.625rem",
});
const LeftContent = styled(Grid)({});

export default SelectCriteriaContainer;
