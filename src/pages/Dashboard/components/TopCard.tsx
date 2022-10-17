import { Grid, styled } from "@material-ui/core";
import React, { FC } from "react";
import ClearIcon from "@material-ui/icons/Clear";
export interface HeroProps {}

const TopCard: FC<HeroProps> = ({}) => {
  const handleClickAdd = () => {};
  interface ChipData {
    key: number;
    label: string;
    content: string;
    description: string;
  }
  const [chipData, setChipData] = React.useState<ChipData[]>([
    {
      key: 0,
      label: "Overall Patient",
      content: "111",
      description: "Burden Score",
    },
    { key: 1, label: "Ages 25 - 85", content: "111", description: "Dis" },
    { key: 2, label: "Ages 25 - 852", content: "111", description: "Dis" },
    { key: 3, label: "Ages 25 - 852", content: "111", description: "Dis" },
  ]);
  return (
    <Container>
      {chipData.map((chip) => (
        <CardItem>
          <Content>{chip.content}</Content>
          <Description>{chip.label}</Description>
          <Description>{chip.description}</Description>
        </CardItem>
      ))}
    </Container>
  );
};

const Container = styled(Grid)({
  display: "flex",
  width: "950px",
  justifyContent: "space-between",
  marginTop: "26px",
  marginLeft: "-26px",
});
const Description = styled(Grid)({
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
  textTransform: "uppercase",
});
const CardItem = styled(Grid)({
  width: "205px;",
  height: "92px;",
  background: "rgba(255, 255, 255, 0.09);",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14);",
  padding: "4px 0 0 18px",
});
const Content = styled(Grid)({
  fontSize: "38px;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  marginBottom: "3px",
});

export default TopCard;
