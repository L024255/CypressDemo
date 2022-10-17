import React from "react";
import {
  Card,
  CardContent as MuiCardContent,
  CardHeader,
  Grid,
  styled,
  Typography,
} from "@material-ui/core";
interface SummaryCardProps {
  value: any;
  description: any;
  style?: any;
  action?: any;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  value,
  description,
  style,
  action,
}) => {
  if (action) {
    return (
      <Card style={style}>
        <CardHeader
          title={
            <>
              <Value>{value}</Value>
              <Descrpition>{description}</Descrpition>
            </>
          }
          action={action}
        />
      </Card>
    )
  }
  return (
    <Card style={style}>
      <CardContent>
        <Value>{value}</Value>
        <Descrpition>{description}</Descrpition>
      </CardContent>
    </Card>
  );
};

const CardContent = styled(MuiCardContent)({
  padding: "14px 18px",
});
const Value = styled(Typography)({
  fontSize: "2.375rem",
  height: "3.125rem",
  color: "#000000",
  lineHeight: "2.875rem",
});
const Descrpition = styled(Grid)({
  // width: "7.375rem",
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.6)",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
  textTransform: "uppercase",
});

export default SummaryCard;
