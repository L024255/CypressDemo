import { Grid, styled } from "@material-ui/core";
import React, { FC } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useHistory } from "react-router-dom";

export interface BottomNavigationProps {
  content: string;
  nextLink?: string;
  nextClick?: () => void;
}
const RightContainer: FC<BottomNavigationProps> = ({
  content,
  nextLink,
  nextClick,
}) => {
  const { push, goBack } = useHistory();

  const handleClickRightCircle = () => {
    if (nextLink) {
      push(nextLink);
    }
    if (nextClick) {
      nextClick();
    }
  };
  const handleClickLeftCircle = () => {
    goBack();
  };
  return (
    <RightStuff>
      <CircleLeft onClick={handleClickLeftCircle}>
        <ChevronLeftIcon />
      </CircleLeft>
      <Title>{content}</Title>
      <CircleRight onClick={handleClickRightCircle}>
        <ChevronRightIcon />
      </CircleRight>
    </RightStuff>
  );
};

const RightStuff = styled(Grid)({
  background: "#121212",
  width: "100%",
  position: "fixed",
  bottom: "0",
  height: "63px",
  lineHeight: "63px",
  textAlign: "center",
  zIndex: 99,
});
const CircleLeft = styled(Grid)({
  position: "absolute",
  left: "19%",
  borderRadius: "50%;",
  width: "2rem;",
  height: "2rem;",
  lineHeight: "2.85rem",
  background: "#F94638;",
  top: "15px;",
  color: "#fff",
  cursor: "pointer",
});
const CircleRight = styled(Grid)({
  position: "absolute",
  right: "19%",
  borderRadius: "50%;",
  width: "2rem;",
  height: "2rem;",
  lineHeight: "2.85rem",
  background: "#F94638;",
  top: "15px;",
  color: "#fff",
  cursor: "pointer",
});
const Title = styled(Grid)({
  fontSize: "1rem",
  fontFamily: "Helvetica",
  color: "#ffffff",
});

export default RightContainer;
