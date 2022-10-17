import React from "react";
import {
  Grid,
  styled,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Paper,
  withStyles,
  createStyles,
  Theme,
  Tooltip,
} from "@material-ui/core";
interface InclusionProps {
  title: string;
  columns?: any[];
  selections: string[];
  data?: any[];
  style?: React.CSSProperties;
}
const Inclusion: React.FC<InclusionProps> = ({
  title,
  columns,
  data,
  style,
  selections,
}) => {
  const renderDotByColumnVal = (val: any, index: number) => {
    if (index === 1) {
      return (
        <>
          {val !== 'N/A' ? `${val}%` : 'N/A'}
        </>
      );
    }
    return val;
  };
  return (
    <Container container style={style}>
      <Row container justify="space-between">
        <Title>{title}</Title>
      </Row>
      <Row container spacing={6}>
        <Column item xs={3}>
          <TableContainer component={Paper}>
            <Table>
              <CustomTableHead style={{ height: "2.5rem" }}>
                <TableRow>
                  <TableHeaderCell>My Selection</TableHeaderCell>
                </TableRow>
              </CustomTableHead>
              <TableBody>
                {selections.map((selection) => (
                  <StyledTableRow key={selection}>
                    <CriteriaTooltip title={selection} aria-label="add">
                      <StyledTableCell scope="row">
                        <CellContainer>
                          {selection}
                        </CellContainer>
                      </StyledTableCell>
                    </CriteriaTooltip>  
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Column>
        <Column item xs={9}>
          <TableContainer component={Paper} style={{ width: "auto" }}>
            <Table>
              <CustomTableHead style={{ height: "2.5rem" }}>
                <TableRow>
                  {columns &&
                    columns.map((column) => (
                      <TableHeaderCell><label style={{ overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.75rem" }}>{column}</label></TableHeaderCell>
                    ))}
                </TableRow>
              </CustomTableHead>
              <TableBody>
                {data &&
                  data.map((row: [], index) => (
                    <StyledTableRow key={index}>
                      {row &&
                        row.map((column, index) => (
                          <StyledTableCell scope="row">
                            {renderDotByColumnVal(column, index)}
                          </StyledTableCell>
                        ))}
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Column>
      </Row>
    </Container>
  );
};
const Container = styled(Grid)({});
const Row = styled(Grid)({
  marginTop: "1.5rem",
});
const Column = styled(Grid)({});

const Title = styled(Typography)({
  fontSize: "1rem",
  color: "#82786F",
  lineHeight: "1.188rem",
});
const CustomTableHead = styled(TableHead)({});
const TableHeaderCell = styled(TableCell)({
  height: "5rem",
  minWidth: "7.188rem",
  fontSize: "0.675rem",
  color: "rgba(0, 0, 0, 0, 1)",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
  textTransform: "uppercase",
});
const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(even)": {
        backgroundColor: "#F8F8F9",
      },
      border: "none",
      "&& .MuiTableCell-body": {
        fontSize: "0.75rem",
        color: "#2D2D2D",
        lineHeight: "1.625rem",
      },
    },
  })
)(TableRow);
const StyledTableCell = styled(TableCell)({});
const CriteriaTooltip = styled(Tooltip)({
  fontSize: "1rem",
});
const CellContainer = styled("div")({
  display: "block",
  maxWidth: "10rem",
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
export default Inclusion;
