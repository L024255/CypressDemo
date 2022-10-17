import React, { useState } from "react";
import { Grid, styled } from "@material-ui/core";

interface SingleInputContentOldProps {
  item: string;
  defaultValue?: any;
  unit: any;
  symble?: any;
  frequencyPercentage: string;
  handleClickAdd: (equal: number) => void;
}
const SingleInputContentOld: React.FC<SingleInputContentOldProps> = ({
  item,
  defaultValue,
  unit,
  symble,
  frequencyPercentage,
  handleClickAdd,
}) => {
  const [equal, setEqual] = useState(defaultValue);
  return (
    <ItemMiddle>
      <CardItem container spacing={2}>
        <Left item xs={9}>
          <Content>
            <Label>{item}</Label>
            {symble && <Label style={{ marginLeft: "10px" }}>{symble}</Label>}
            {defaultValue && (
              <Number
                style={{ marginLeft: "10px" }}
                defaultValue={equal}
                value={equal}
                // onChange={(e) => {
                //   setEqual(parseFloat(e.target.value));
                // }}
                onChange={(e) => {
                  const re = /^[0-9._]+$/;
                  if (e.target.value === '' || re.test(e.target.value)) {
                    setEqual(e.target.value);
                  }
                }}
              />
            )}
            <Label style={{ marginLeft: "10px" }}>{unit}</Label>
          </Content>
          <Frequency>
            <Percent>{frequencyPercentage} Frequency</Percent>
          </Frequency>
        </Left>
        <Right item xs={2}>
          <AddBtn onClick={() => handleClickAdd(equal)}>Add</AddBtn>
        </Right>
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
  width: "16.813rem",
});
const Left = styled(Grid)({});
const Right = styled(Grid)({});
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
const Percent = styled(Grid)({});
const Label = styled("label")({
  textTransform: "uppercase",
});
const Number = styled("input")({
  borderRadius: "4px",
  border: "1px solid #D5D2CA",
  width: "2.25rem",
  color: "#252525",
  paddingLeft: "7px",
  fontSize: "11px",
});

export default SingleInputContentOld;
