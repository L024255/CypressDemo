import { Grid, styled, Typography } from "@material-ui/core";
import React, { FC } from "react";
import CheckIcon from "@material-ui/icons/Check";
export interface HeroProps {
  title: string;
  subTitle: string;
  saveInfo: string;
}
const RightContainer: FC<HeroProps> = ({ title, subTitle, saveInfo }) => {
  return (
    <RightStuff>
      <Title>{title}</Title>
      <Description>{subTitle}</Description>
      <Subtitle>
        <CheckIcon fontSize="small" />{" "}
        <SavedInfo>Last Saved {saveInfo}</SavedInfo>
      </Subtitle>
    </RightStuff>
  );
};

const RightStuff = styled(Grid)({
  marginTop: "51px",
  background: "#ffffff",
  width: "61.25rem",
});
const Title = styled(Grid)({
  fontSize: "1.5rem",
  fontFamily: "Helvetica",
  color: "#000000",
});
const SavedInfo = styled(Typography)({
  lineHeight: "1.375rem",
  fontSize: "0.75rem",
  marginLeft: "0.155rem",
});
const Description = styled(Grid)({
  fontSize: "1rem",
  fontFamily: "Helvetica",
  color: "#000000",
  marginTop: "8px",
});
const Subtitle = styled(Grid)({
  color: "#A59D95",
  display: "flex",
  width: "100%",
  marginTop: "0.5rem",
  "&> .MuiSvgIcon-root": {
    marginTop: "3px;",
    marginRight: "5px;",
    marginLeft: "-5px;",
  },
});

export default RightContainer;
