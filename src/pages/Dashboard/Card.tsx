import { Grid, styled } from "@material-ui/core";
import React, { FC } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { Link } from "react-router-dom";
export interface HeroProps {}

const Card: FC<HeroProps> = ({}) => {
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
    <>
      <Container>
        <CardItem>
          <Link to="/criteria">
            <Content>criteria</Content>
            <Description>criteria</Description>
          </Link>
        </CardItem>
        <Link to="/endpoints">
          <CardItem>
            <Content>endpoints</Content>
            <Description>endpoints</Description>
          </CardItem>
        </Link>
        <Link to="/associate-endpoints">
          <CardItem>
            <Content>associate endpoints</Content>
            <Description>associate endpoints</Description>
          </CardItem>
        </Link>
        <Link to="/predicted-impact">
          <CardItem>
            <Content>predicted impact</Content>
            <Description>predicted impact</Description>
          </CardItem>
        </Link>
      </Container>
      <Container>
        <Link to="/compare-scenario">
          <CardItem>
            <Content>compare-scenario</Content>
            <Description>compare-scenario</Description>
          </CardItem>
        </Link>
        <Link to="/edit-scenario">
          <CardItem>
            <Content>edit scenario</Content>
            <Description>edit scenariot</Description>
          </CardItem>
        </Link>
        <Link to="/trial-homepage">
          <CardItem>
            <Content>trial homepage</Content>
            <Description>trial homepage</Description>
            <Description>Burden Score</Description>
          </CardItem>
        </Link>
        <Link to="/create-new">
          <CardItem>
            <Content>new trial</Content>
            <Description>new-trial</Description>
            <Description>Burden Score</Description>
          </CardItem>
        </Link>
      </Container>
      <Container>
        <Link to="/IE/editScenario">
          <CardItem>
            <Content>editScenario</Content>
            <Description>editScenario</Description>
          </CardItem>
        </Link>
        <Link to="/IE/criteriaBuilder">
          <CardItem>
            <Content>criteria Builder</Content>
            <Description>criteria Builder</Description>
          </CardItem>
        </Link>
        <Link to="/IE/historicalSummary">
          <CardItem>
            <Content>historical summary</Content>
            <Description>historical summary</Description>
          </CardItem>
        </Link>
        <Link to="/IE/predictImpact">
          <CardItem>
            <Content>predict impact</Content>
            <Description>predict impact</Description>
          </CardItem>
        </Link>
      </Container>
      <Container>
        <Link to="/SoA/draftScenario">
          <CardItem>
            <Content>draft scenario</Content>
            <Description>draft scenario</Description>
          </CardItem>
        </Link>
        <Link to="/SoA/criteriaBuilder">
          <CardItem>
            <Content>criteria builder</Content>
            <Description>criteria builder</Description>
          </CardItem>
        </Link>
        <Link to="/SoA/historicalSummary">
          <CardItem>
            <Content>historical summary</Content>
            <Description>historical summary</Description>
          </CardItem>
        </Link>
        <Link to="/SoA/draftScenario">
          <CardItem>
            <Content>predict impact</Content>
            <Description>predict impact</Description>
          </CardItem>
        </Link>
      </Container>
    </>
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
  marginTop: "12px",
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
  fontSize: "20px;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  marginBottom: "3px",
});

export default Card;
