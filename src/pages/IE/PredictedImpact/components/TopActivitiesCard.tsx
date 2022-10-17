import React from "react";
import {
  styled,
  Grid,
  withStyles,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@material-ui/core";
import { Theme, createStyles } from "@material-ui/core/styles";
interface TopActivitiesCardProps {
  title: string;
  activities: {
    name: string;
    overallCost: any;
    visitCount: any;
  }[];
}
const TopActivitiesCard: React.FC<TopActivitiesCardProps> = ({
  title,
  activities,
}) => {
  const tableColumns = ["Name", "Overall Cost", "# of Visits"];
  const formatName = (name: string) => {
    let result = name;
    if (name.split(".").length > 1) {
      const index = name.split(".").length -1
      result = name.split(".")[index];
    }
    return result;
  }
  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Table style={{ width: "100%", padding: 0 }}>
          <TableHead>
            <CustomTableRow
              style={{
                background: "rgba(213, 210, 202, 1)",
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
            >
              {tableColumns?.map((column, index) => (
                <TableCell style={{ fontWeight: "bolder" }}>{column}</TableCell>
              ))}
            </CustomTableRow>
          </TableHead>
          <CustomTableBody>
            {activities?.map((row, index) => (
              <CustomTableRow key={index}>
                <TableCell>{formatName(row.name)}</TableCell>
                <TableCell>${row.overallCost}</TableCell>
                <TableCell>{row.visitCount}</TableCell>
              </CustomTableRow>
            ))}
          </CustomTableBody>
        </Table>
      </CardBody>
    </CardContainer>
  )
}
const CardContainer = styled(Grid)({
  width: "100%",
  minHeight: "17.94rem",
  background: "#FFFFFF",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);",
  borderRadius: "4px",
  marginTop: "1.875rem",
  clear: "both",
});
const CardHeader = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
  height: "2.375rem",
  lineHeight: "2.375rem",
  paddingLeft: "1.56rem",
  borderBottom: "1px solid #D5D2CA",
});
const CardTitle = styled(Grid)({
  float: "right",
  marginRight: "3.125rem",
  fontSize: "0.625rem;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
});
const CardBody = styled(Grid)({
  display: "flex"
});
const CustomTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "rgba(213, 210, 202, 0.2)",
      "&.normal:nth-of-type(n+3)": {
        background: "#FCFCFA",
      },
      "&.last-color:last-child": {
        background: "rgba(213, 43, 30, 0.1)",
      },
      border: "none",
      "&& .MuiTableCell-body": {
        fontSize: "0.875rem",
        color: "#000",
        lineHeight: "1.625rem",
        border: "none !important",
        paddingTop: "4px",
        paddingBottom: "4px",
        paddingLeft: "26px",
      },
      "&& .MuiTableCell-head": {
        color: "rgba(0, 0, 0, 0.6)",
        fontSize: "11px",
        border: "none !important",
        textTransform: "uppercase",
        paddingLeft: "25px",
      },
    },
  })
)(TableRow);
const CustomTableBody = withStyles((theme: Theme) =>
  createStyles({
    root: {
      border: "none",
    },
  })
)(TableBody);

export default TopActivitiesCard;
