import { Grid, styled } from "@material-ui/core";
import React from "react";
import ChipCard from "../../Criteria/components/ChipCard";
export interface HeroProps {
  title: string;
  contentData: {
    title: string;
    chips: any[];
  }[];
  handleRemoveSoA?: (activityId: string) => void;
  handleRemoveCriterion?: (criterionId: string) => void;
}
const LeftContainer: React.FC<HeroProps> = ({ title, contentData, handleRemoveSoA, handleRemoveCriterion }) => {
  return (
    <LeftStuff>
      <LeftText>{title}</LeftText>
      <LeftContent>
        {contentData.map((data) => {
          const chips = data.chips.map((chip, index) => ({
            key: index,
            soaId: chip.soaId,
            scenarioCriterionId: chip.scenarioCriterionId,
            label: chip.name || chip || "",
          }));
          return (
            <ChipCard
              title={data.title}
              initialChips={chips}
              criteriaOptions={[]}
              search={false}
              clearIcon={false}
              handleDeleteCriteria={handleRemoveCriterion}
              handleDeleteSoA={handleRemoveSoA}
            />
          );
        })}
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
  width: "100%",
});
const LeftContent = styled(Grid)({
  width: "100%",
});

export default LeftContainer;
