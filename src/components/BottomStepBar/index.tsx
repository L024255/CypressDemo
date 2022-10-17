import React from "react";
import { IconButton, styled, Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";

interface CustomStepBarProps {
  forwardStep?: string;
  isBlackTheme?: boolean;
  title: string;
  nextStep?: string;
  state?: any
}

const CustomStepBar: React.FC<CustomStepBarProps> = ({
  forwardStep,
  title,
  isBlackTheme,
  nextStep,
  state
}) => {
  const history = useHistory();
  const { push } = history;
  const handleClickBack = () => {
    forwardStep && history.replace(forwardStep);
  };
  const handleClickNext = () => {
    nextStep && push({
      pathname: nextStep,
      state: {...state}
    });
  };
  const renderForwardStep = (theme: string) => {
    return (
      <BackButton className={theme} onClick={handleClickBack}>
        <ArrowBackIos style={{ marginRight: "5px", fontSize: "14px" }} />
      </BackButton>
    );
  };
  const renderNextStep = (theme: string) => {
    return (
      <NextButton className={theme} onClick={handleClickNext}>
        <ArrowForwardIos style={{ marginRight: "5px", fontSize: "14px" }} />
      </NextButton>
    );
  };
  const themeClass = isBlackTheme ? "black" : "white";
  return (
    <>
      <StyledAppBar className={themeClass}>
        {forwardStep && renderForwardStep(themeClass)}
        <Title className={themeClass}>{title}</Title>
        {nextStep && renderNextStep(themeClass)}
      </StyledAppBar>
    </>
  );
};

const StyledAppBar = styled(Grid)({
  display: "flex",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  "&.black": {
    backgroundColor: "#1C1C1C",
  },
  "&.white": {
    zIndex: 999999,
    boxShadow: "rgb(204 204 204) 2px 2px 2px",
  },
  height: "61px",
});
const BackButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  fontSize: "14px",
  left: "20rem",
  width: "36px",
  height: "36px",
  borderRadius: "100px",
  "&.black": {
    color: "#FFF",
    background: "#F94638",
  },
  "&.white": {
    color: theme.palette.primary.main,
  },
  "& .MuiSvgIcon-root": {
    marginLeft: "5px",
    marginRight: "0 !important",
  },
}));
const NextButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  fontSize: "14px",
  right: "20rem",
  width: "36px",
  height: "36px",
  borderRadius: "100px",
  "&.black": {
    color: "#FFF",
    background: "#F94638",
  },
  "&.white": {
    color: theme.palette.primary.main,
  },
  "& .MuiSvgIcon-root": {
    marginLeft: "5px",
    marginRight: 0,
  },
}));
const Title = styled(Typography)({
  "&.black": {
    color: "#FFF",
  },
});

export default CustomStepBar;
