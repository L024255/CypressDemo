import React from "react";
import { styled, Typography, Grid } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { LillyLogo } from "../icons";

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const transparentFooter = useLocation().pathname === "/browse";
  const containerStyle = transparentFooter
    ? {}
    : { borderTop: "1px solid #EEEEEE" };

  return (
    <Container
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      style={containerStyle}
    >
      <Grid item>
        <LillyLogo style={{ fontSize: "5rem", width: "1em", height: ".5em" }} />
      </Grid>
      <Grid item>
        <Typography variant="body1">
          © {moment().year()} Eli Lilly and Company. All rights reserved.
        </Typography>
      </Grid>
    </Container>
  );
};

const Container = styled(Grid)({
  position: "absolute",
  padding: "1.5rem",
  zIndex: 5,
});

export default Footer;
