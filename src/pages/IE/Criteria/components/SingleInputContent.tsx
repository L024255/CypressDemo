import React from "react";
import {
  createStyles,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import { Scrollbar as RCScrollbar } from "react-scrollbars-custom";
// import { checkIsFloat } from "../../../../utils/getDataUtil";


interface SingleInputContentProps {
  item: string;
  defaultValue?: any;
  unit: any;
  symble?: any;
  frequencyPercentage?: string;
  innerCriteria?: {
    id: any;
    type: any;
    name: any;
    tempModifier: any;
    min: any;
    max: any;
    equal: any;
    unit: any;
    appears: any;
    freq: any;
    internal: boolean;
  }[];
  // handleClickAdd: (equal: number) => void;
  handleClickAdd: () => void;
}
const SingleInputContent: React.FC<SingleInputContentProps> = ({
  item,
  defaultValue,
  unit,
  symble,
  frequencyPercentage,
  innerCriteria,
  handleClickAdd,
}) => {
  // const [equal, setEqual] = useState<any>(undefined);
  return (
    <ItemMiddle>
      <Row container>
        <Left item xs={9}>
          <Content>
            <Label>{item}</Label>
            {/* {symble && <Label style={{ marginLeft: "10px" }}>{symble}</Label>} */}
            {/* {defaultValue && (
            <Number
              style={{ marginLeft: "10px" }}
              // defaultValue={equal}
              value={equal}
              onChange={(e) => {
                if (checkIsFloat(e.target.value)) {
                  setEqual(e.target.value);
                } else {
                  setEqual(undefined);
                }
              }}
            />
            )} */}

            {/* <Label style={{ marginLeft: "10px" }}>{unit}</Label> */}
          </Content>
          {frequencyPercentage && (
            <Frequency>
              <Percent>{frequencyPercentage} Frequency</Percent>
            </Frequency>
          )}
        </Left>
        <Right item xs={2}>
          <AddBtn 
            // style={ defaultValue && isNaN(equal) ? { cursor: "auto", color: "#DFDFDF", border: "1px solid #DFDFDF"} : {}}
            // onClick={() => defaultValue && (isNaN(equal)) ? () => {} : handleClickAdd(equal)
            onClick={() => handleClickAdd()
          }>
            Add
          </AddBtn>
        </Right>
      </Row>
      {
        innerCriteria && (
          <Scrollbar style={{ height: "180px", width: "19.5rem" }}>
            <Table style={{ width: "18.813rem", boxShadow: "0px 4px 5px 1px rgb(204 204 204)", marginTop: "10px" }}>
              <TableHead>
                <HeaderTableRow>
                  <TableHeaderCell>Sponsor</TableHeaderCell>
                  <TableHeaderCell>Frequency</TableHeaderCell>
                  <TableHeaderCell>Most Common Modifier</TableHeaderCell>
                </HeaderTableRow>
              </TableHead>
              <TableBody style={{ border: "none" }}>
                {
                  innerCriteria.sort((x, y) => (x.internal === y.internal)? 0 : x.internal? -1 : 1).map((innerCriterion) => {
                    return (
                      <StyledTableRow>
                        <StyledTableCell>
                          <CellContainer>
                            {innerCriterion.internal ? "Lilly" : "External"}
                          </CellContainer>
                        </StyledTableCell>
                        <StyledTableCell>
                          <CellContainer>
                            {innerCriterion.freq ? `${(innerCriterion.freq * 100).toFixed()}%` : "N/A"}
                          </CellContainer>
                        </StyledTableCell>
                        <StyledTableCell>
                          <CellContainer>
                          {(innerCriterion.tempModifier ? innerCriterion.tempModifier
                              : innerCriterion.min && innerCriterion.max ? `${innerCriterion.min} - ${innerCriterion.max} ${innerCriterion.unit || ''}`
                                : innerCriterion.min && !innerCriterion.max ? `> ${innerCriterion.min} ${innerCriterion.unit || ''}`
                                : !innerCriterion.min && innerCriterion.max ? `< ${innerCriterion.max} ${innerCriterion.unit || ''}`
                                  : "N/A"
                            )}
                          </CellContainer>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </Scrollbar>
        )
      }

    </ItemMiddle>
  );
};
const ItemMiddle = styled(Grid)({
  width: "20.813rem;",
  height: "11.5rem;",
  background: "#FFFFFF;",
  borderRadius: "4px;",
  border: "1px solid rgba(130, 120, 111, 0.4);",
  padding: "11px 14px",
  marginTop: "37px",
  display: "flex",
  // justifyContent: "space-between",
  marginRight: "1rem",
  flexDirection: "column",
});
const Row = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
  width: "18.813rem",
});
const Left = styled(Grid)({});
const Right = styled(Grid)({
  marginRight: "10px"
});
const AddBtn = styled(Grid)({
  width: "64px;",
  height: "19px;",
  lineHeight: "19px",
  background: "#F9F9F9;",
  borderRadius: "25px;",
  border: "1px solid #D52B1E;",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // marginTop: "17px",
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
  cursor: "pointer",
  letterSpacing: "1px;",
});
const Content = styled(Grid)({
  fontSize: "0.75rem;",
  fontFamily: "Helvetica;",
  color: "#2D2D2D;",
});
const Frequency = styled(Grid)({
  fontSize: "0.75rem;",
  fontFamily: "Helvetica;",
  color: "#82786F;",
  marginTop: "8px",
  marginLeft: "3px",
});
const Percent = styled(Grid)({});
const Label = styled("label")({
  textTransform: "uppercase",
});
// const Number = styled("input")({
//   borderRadius: "4px",
//   border: "1px solid #D5D2CA",
//   width: "2.25rem",
//   color: "#252525",
//   paddingLeft: "7px",
//   fontSize: "11px",
// });
const TableHeaderCell = styled(TableCell)({
  fontSize: "0.675rem",
  color: "rgba(0,0,0,.6)",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
  textTransform: "uppercase",
  border: "none !important",
  "&.MuiTableRow-head.MuiTableRow-head th:not(:first-child)": {
    borderLeft: "none",
  },
});
const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      border: "none",
      "&.MuiTableRow-head.MuiTableRow-head th:not(:first-child)": {
        borderLeft: "none",
      },
      "&& .MuiTableCell-root": {
        padding: "5px",
      },
      "&:nth-of-type(odd)": {
        backgroundColor: "#F7F6F3",
      },
      "&& .MuiTableCell-body": {
        fontSize: "0.75rem",
        color: "#2D2D2D",
        lineHeight: "1.625rem",
      },
    },
  })
)(TableRow);
const StyledTableCell = styled(TableCell)({
  border: "none !important",
});
const HeaderTableRow = withStyles(() => createStyles({
  root: {
    borderBottom: "1px solid rgba(130, 120, 111, 0.4);",
    "&& .MuiTableCell-root": {
      padding: "5px",
      background: "#F7F6F3",
    },
  },
})
)(TableRow);
const CellContainer = styled("div")({
  display: "block",
  // height: "20px",
});
const Scrollbar = styled(RCScrollbar)({
  "& .ScrollbarsCustom-ThumbY": {
    background: "#D52B1E !important",
    width: "7px !important",
  },
  "& .ScrollbarsCustom-TrackY": {
    width: "7px !important",
  }
});

export default SingleInputContent;
