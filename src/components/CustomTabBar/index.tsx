import React from "react";
import { Tabs, Tab, Button, styled, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ArrowBack } from "@material-ui/icons";

interface CustomTabBarProps {
  hasBackButton?: boolean;
  isBlackTheme?: boolean;
  tabTitles: string[];
  tabValue: any;
  changeTabValue: Function;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  hasBackButton,
  tabTitles,
  isBlackTheme,
  changeTabValue,
  tabValue,
}) => {
  const history = useHistory();
  const handleClickBack = () => {
    history.goBack();
  };
  const renderBackButton = (theme: string) => {
    return (
      <BackButton role="button" className={theme} onClick={handleClickBack}>
        <ArrowBack style={{ marginRight: "5px", fontSize: "14px" }} />
        Back
      </BackButton>
    );
  };
  const handleChangeTabValue = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    changeTabValue(newValue);
  };
  const themeClass = isBlackTheme ? "black" : "white";
  return (
    <>
      <StyledAppBar className={themeClass}>
        {hasBackButton && renderBackButton(themeClass)}
        <Tabs value={tabValue} onChange={handleChangeTabValue}>
          {tabTitles &&
            tabTitles.map((title, index) => {
              const activeClass = tabValue === title || tabValue === index ? "active" : "";
              return (
                <StyledTab
                  key={`custom-tab-${index}`}
                  className={`${themeClass} ${activeClass}`}
                  label={title}
                  id={`custom-tab-${index}`}
                  aria-controls={`custom-tab-panel-${index}`}
                />
              );
            })}
        </Tabs>
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
});
const BackButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  fontSize: "14px",
  left: "2rem",
  "&.black": {
    color: "#FFF",
  },
  "&.white": {
    color: "#000",
  },
  "&&:focus-visible": {
    outline: "-webkit-focus-ring-color auto 1px !important",
  },
}));
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  "&.black": {
    color: "#FFF",
  },
  "&&:hover": {
    cursor: "pointer",
    boxShadow: `inset 0 -3px 0 0 #F94638`,
  },
  "&.active": {
    cursor: "pointer",
    color: theme.palette.primary.main,
    boxShadow: `inset 0 -3px 0 0 #F94638`,
  },
  "&&:focus-visible": {
    outline: "-webkit-focus-ring-color auto 1px !important",
  },
}));

export default CustomTabBar;
