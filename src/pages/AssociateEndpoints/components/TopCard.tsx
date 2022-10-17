import { Grid, styled } from "@material-ui/core";
import React, { FC, useEffect } from "react";
import { SoASummaryType } from "../../IE/PredictedImpact/type/SoASummaryType";
export interface TopCardProps {
  soaSummary?: SoASummaryType;
  endPointsAccountedFor: any;
  soaWithVisitsNum: any;
}

const TopCard: FC<TopCardProps> = ({ soaSummary, endPointsAccountedFor, soaWithVisitsNum }) => {
  interface ChipData {
    key: number;
    label: any;
    content: any;
  }
  const [chipData, setChipData] = React.useState<ChipData[]>([
    { key: 1, label: "Overall SoA Cost per Patient", content: "-" },
    {
      key: 2,
      label: "ACTIVITIES LINKED TO ENDPOINT",
      content: "-",
    },
    {
      key: 3,
      label: "Endpoints linked to at least 1 activity",
      content: "-",
    },
  ]);
  useEffect(() => {
    if (soaSummary) {
      const overallCost: ChipData = {
        key: 1,
        label: "Overall SoA Cost per Patient",
        content: `$${soaSummary.totalCost}`,
      };
      const activitiesLinkedToEndpoint: ChipData = {
        key: 2,
        label: "ACTIVITIES LINKED TO ENDPOINT",
        content: `${soaSummary.mappedActivities}/${soaWithVisitsNum}`,
      };
      const endpointsAccountFor: ChipData = {
        key: 3,
        label: "Endpoints linked to at least 1 activity",
        content: endPointsAccountedFor,
      };
      const chipData = [
        overallCost,
        activitiesLinkedToEndpoint,
        endpointsAccountFor,
      ];
      setChipData(chipData);
    }
  }, [soaSummary, endPointsAccountedFor, soaWithVisitsNum]);
  return (
    <Container>
      {chipData.map((chip) => (
        <CardItem>
          <Content>{chip.content}</Content>
          <Description>{chip.label}</Description>
        </CardItem>
      ))}
    </Container>
  );
};

const Container = styled(Grid)({
  display: "flex",
  width: "950px",
  justifyContent: "space-between",
  marginTop: "26px",
  marginLeft: "-26px",
});
const Description = styled(Grid)({
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
  textTransform: "uppercase",
});
const CardItem = styled(Grid)({
  width: "30%",
  height: "92px;",
  background: "rgba(255, 255, 255, 0.09);",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14);",
  padding: "1px 0 0 18px",
});
const Content = styled(Grid)({
  fontSize: "38px;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  marginBottom: "3px",
});

export default TopCard;
