import React from "react";
import { Card, CardContent, styled, Grid, Typography } from "@material-ui/core";

export interface PercentageCardProps {
  percentage: string;
  name: string;
  disable?: boolean;
  style?: any;
}
const PercentageCard: React.FC<PercentageCardProps> = ({
  percentage,
  name,
  disable,
  style,
}) => {
  return (
    <CardContainer style={style} className={disable ? "disabled" : ""}>
      <CardContentContainer>
        <Percentage>{percentage}</Percentage>
        <Name>{name}</Name>
      </CardContentContainer>
    </CardContainer>
  );
};
const CardContainer = styled(Card)({
  marginBottom: "2rem",
  width: "100%",
  "&&.disabled": {
    background: "#F5F5F5",
    boxShadow:
      "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14)",
    opacity: 0.4,
  },
});
const CardContentContainer = styled(CardContent)({
  padding: "0.675rem !important",
});
const Percentage = styled(Typography)({
  fontWeight: 500,
  fontSize: "2.375rem",
  color: "#000000",
  lineHeight: "2.875rem",
});
const Name = styled(Grid)({
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.6)",
  lineHeight: "1rem",
  letterSpacing: "1px",
});
export default PercentageCard;
