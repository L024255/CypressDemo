import React from "react";
import { createStyles, Grid, styled, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import { Scrollbar as RCScrollbar } from "react-scrollbars-custom";
// import { checkIsFloat } from "../../../../utils/getDataUtil";

interface RangeNumberContentProps {
  item: string;
  // firstValue: number;
  // secondValue: number;
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
  // handleClickAdd: (min: number, max: number) => void;
  handleClickAdd: () => void;
}
const RangeNumbserContent: React.FC<RangeNumberContentProps> = ({
  item,
  innerCriteria,
  handleClickAdd,
}) => {
  // const [min, setMin] = useState<any>(undefined);
  // const [max, setMax] = useState<any>(undefined);
  return (
    <ItemMiddle>
      <CardItem>
        <Left>
          <Content>
            <Label style={{ marginRight: "10px" }}>{item}</Label>
            {/* <Number
              defaultValue={min}
              value={min}
              onChange={(e) => {
                if (checkIsFloat(e.target.value)) {
                  setMin(e.target.value)
                } else {
                  setMin(undefined)
                }
              }
              }
            />
            <Label>-</Label>
            <Number
              defaultValue={max}
              value={max}
              onChange={(e) => {
                if (checkIsFloat(e.target.value)) {
                  setMax(e.target.value)
                } else {
                  setMax(undefined)
                }
              }
              }
            /> */}
          </Content>
        </Left>
        <AddBtn
          // style={
          //   (isNaN(min) || isNaN(max) || parseFloat(max) < parseFloat(min)) ? { cursor: "auto", color: "#DFDFDF", border: "1px solid #DFDFDF" } : {}
          // }
          onClick={
            () => handleClickAdd()
            // () => (isNaN(min) || isNaN(max) || parseFloat(max) < parseFloat(min)) ? () => { } : handleClickAdd(parseFloat(min), parseFloat(max))
            // () => handleClickAdd(parseFloat(min), parseFloat(max))
          }
        >Add</AddBtn>
      </CardItem>
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
  flexDirection: "column"
});
const CardItem = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
  width: "18.813rem",
});
const Left = styled(Grid)({});
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
const Label = styled("label")({
  textTransform: "uppercase",
});
// const Number = styled("input")({
//   borderRadius: "4px",
//   border: "1px solid #D5D2CA",
//   color: "#252525",
//   width: "2.25rem",
//   paddingLeft: "7px",
//   fontSize: "11px",
//   "& .MuiOutlinedInput-notchedOutline": {
//     border: "none",
//   },
//   "& .MuiOutlinedInput-multiline": {
//     background: "transparent",
//   },
// });
const TableHeaderCell = styled(TableCell)({
  // height: "5rem",
  // minWidth: "7.188rem",
  fontSize: "0.675rem",
  color: "rgba(0,0,0,.6)",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
  textTransform: "uppercase",
  border: "none !important",
});
const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      border: "none",
      "&:nth-of-type(odd)": {
        backgroundColor: "#F7F6F3",
      },
      "&& .MuiTableCell-root": {
        padding: "5px",
      },
      "&& .MuiTableCell-body": {
        fontSize: "0.75rem",
        color: "#2D2D2D",
        lineHeight: "1.625rem",
      },
    },
  })
)(TableRow);
const HeaderTableRow = withStyles(() => createStyles({
  root: {
    borderBottom: "1px solid rgba(130, 120, 111, 0.4);",
    "&& .MuiTableCell-root": {
      padding: "5px",
      background: "#F7F6F3"
    },
  },
})
)(TableRow);
const StyledTableCell = styled(TableCell)({
  border: "none !important",
});
const CellContainer = styled("div")({
  display: "block",
  // width: "100%",
  // height: "20px",
  // whiteSpace: "nowrap",
  // textOverflow: "ellipsis",
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

export default RangeNumbserContent;
