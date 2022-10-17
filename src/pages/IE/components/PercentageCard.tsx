import React from "react";
import { Card, CardContent, styled, Grid, Typography } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { Popover } from "antd";
import "antd/dist/antd.css";

export interface PercentageCardProps {
  percentage: string;
  name: string;
  disable?: boolean;
  style?: any;
  tooltips?: string;
}
const PercentageCard: React.FC<PercentageCardProps> = ({
  percentage,
  name,
  disable,
  style,
  tooltips,
}) => {
  return (
    <CardContainer style={style} className={disable ? "disabled" : ""}>
      {tooltips ? (
        <Popover
          content={
            <p style={{ maxWidth: "350px", whiteSpace: "normal" }}>
              {tooltips}
            </p>
          }
          placement="bottomLeft"
        >
          <CardContentContainer>
            <Percentage>{percentage}</Percentage>
            <Name>
              <InfoIcon /> {name}
            </Name>
          </CardContentContainer>
        </Popover>
      ) : (
        <CardContentContainer>
          <Percentage>{percentage}</Percentage>
          <Name>{name}</Name>
        </CardContentContainer>
      )}
    </CardContainer>
  );
};
const CardContainer = styled(Card)({
  marginBottom: "2rem",
  width: "100%",
  background: "#F5F5F5 rgba(255, 255, 255, 0.09)",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14)",
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
  display: "flex",
  // justifyContent: "center",
  alignItems: "center",
});
const InfoIcon = styled(InfoOutlined)({
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.6)",
  marginRight: "10px",
});
export default PercentageCard;
