import React, { useState } from "react";
import { Grid, styled } from "@material-ui/core";
import { checkIsFloat } from "../../../../utils/getDataUtil";

interface RangeNumberContentOldProps {
  item: string;
  firstValue: number;
  secondValue: number;
  frequencyPercentage: string;
  handleClickAdd: (min: number, max: number) => void;
}
const RangeNumbserContentOld: React.FC<RangeNumberContentOldProps> = ({
  item,
  firstValue,
  secondValue,
  frequencyPercentage,
  handleClickAdd,
}) => {
  const [min, setMin] = useState<any>();
  const [max, setMax] = useState<any>();
  return (
    <ItemMiddle>
      <CardItem>
        <Left>
          <Content>
            <Label style={{ marginRight: "10px" }}>{item}</Label>
            <Number
              defaultValue={min}
              value={min}
              onChange={(e) => {
                if (e.target.value === "" || checkIsFloat(e.target.value)) {
                  setMin(e.target.value)}
                }
              }
            />
            <Label>-</Label>
            <Number
              defaultValue={max}
              value={max}
              onChange={(e) => {
                if (e.target.value === "" || checkIsFloat(e.target.value)) {
                  setMax(e.target.value)}
                }
              }
            />
          </Content>
          <Frequency>
            {/* <Mark></Mark> */}
            <Percent>{frequencyPercentage} Frequency</Percent>
          </Frequency>
        </Left>
        <AddBtn onClick={() => handleClickAdd(parseFloat(min), parseFloat(max))}>Add</AddBtn>
      </CardItem>
    </ItemMiddle>
  );
};
const ItemMiddle = styled(Grid)({
  width: "19.813rem;",
  height: "7.5rem;",
  background: "#FFFFFF;",
  borderRadius: "4px;",
  border: "1px solid rgba(130, 120, 111, 0.4);",
  padding: "11px 14px",
  marginTop: "37px",
  display: "flex",
  justifyContent: "space-between",
  marginRight: "2.563rem",
});
const CardItem = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
  width: "15.813rem",
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
  marginTop: "17px",
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
// const Mark = styled(Grid)({
//   width: "5px;",
//   height: "5px;",
//   borderRadius: "100px;",
//   backgroundColor: "RED;",
//   float: "left",
//   marginTop: "5px",
// });
const Percent = styled(Grid)({
  marginLeft: "8px",
});
const Label = styled("label")({
  textTransform: "uppercase",
});
const Number = styled("input")({
  borderRadius: "4px",
  border: "1px solid #D5D2CA",
  color: "#252525",
  width: "2.25rem",
  paddingLeft: "7px",
  fontSize: "11px",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-multiline": {
    background: "transparent",
  },
});

export default RangeNumbserContentOld;
