import React from "react";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  styled,
  Typography,
} from "@material-ui/core";
interface SoaBuilderSummaryCardProps {
  leftValue: any;
  leftTitle: any;
  rightValue: any;
  rightTitle: any;
  style?: any;
  action?: any;
}

const SoaBuilderSummaryCard: React.FC<SoaBuilderSummaryCardProps> = ({
  leftValue,
  leftTitle,
  rightValue,
  rightTitle,
  style,
}) => {
  return (
    <Card style={style}>
      <CardContent>
        <Left>
          <Value>{leftValue}</Value>
          <Descrpition>{leftTitle}</Descrpition>
        </Left>
        <SeperateLine />
        <Right>
          <Value>{rightValue}</Value>
          <Descrpition>{rightTitle}</Descrpition>
        </Right>
      </CardContent>
    </Card>
  );
};

const Card = styled(MuiCard)({
  display: "flex",
  alignItems: "center",
  width: "210px",
  height: "125px",
  marginRight: "20px",
})
const CardContent = styled(MuiCardContent)({
  padding: "14px 18px",
  display: "flex",
});
const Left = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "75px",
});
const Right = styled(Left)({});
const SeperateLine = styled(Grid)({
  width: "1px",
  border: "1px solid #ddd",
  margin: "0 10px",
});
const Value = styled(Typography)({
  fontSize: "2.375rem",
  height: "3.125rem",
  color: "#000000",
  lineHeight: "2.875rem",
  fontWeight: "bold",
});
const Descrpition = styled(Typography)({
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.6)",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
  textTransform: "uppercase",
  paddingLeft: "10px",
});

export default SoaBuilderSummaryCard;
