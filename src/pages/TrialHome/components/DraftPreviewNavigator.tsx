import React from "react";
import { Grid, styled } from "@material-ui/core";
import HeaderLink from "../../../components/Header/HeaderLink";

export enum DraftPreview {
  Draft,
  Preview,
}
interface DractPreviewNavigatorProps {
  value: DraftPreview;
}

const DraftPreviewNavigator: React.FC<DractPreviewNavigatorProps> = ({
  value,
}) => {
  return (
    <Container
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ boxShadow: "2px 2px 2px #ccc", backgroundColor: "#1C1C1C" }}
      role="banner"
      aria-label="Page Header"
    >
      <Grid item xs={12} sm={8} md={6}>
        <LinksContainer
          container
          direction="row"
          justify="center"
          wrap="nowrap"
          role="navigation"
          aria-label="Main Navigation"
        >
          <HeaderMenuLink
            link="/edit-scenario"
            color="primary"
            style={
              value === DraftPreview.Draft
                ? {
                    boxShadow: `inset 0 -5px 0 0 #D52B1E`,
                    textTransform: "none",
                  }
                : { textTransform: "none" }
            }
            analyticsOptions={{ action: "browse", labels: ["edit-scenario"] }}
          >
            Draft
          </HeaderMenuLink>

          <HeaderMenuLink
            link="/edit-scenario"
            color="default"
            style={
              value === DraftPreview.Preview
                ? {
                    boxShadow: `inset 0 -5px 0 0 #D52B1E`,
                    textTransform: "none",
                  }
                : { color: "#FFF", textTransform: "none" }
            }
            analyticsOptions={{ action: "view", labels: ["preview"] }}
          >
            Preview
          </HeaderMenuLink>
        </LinksContainer>
      </Grid>
    </Container>
  );
};

const HeaderMenuLink = styled(HeaderLink)({
  textTransform: "none",
  letterSpacing: "1px",
});
const Container = styled(Grid)(({ theme }) => ({
  padding: "0 5rem 0.1rem 5rem",
  zIndex: 5,
  [theme.breakpoints.down("xs")]: {
    alignItems: "stretch",
    padding: "0",
  },
}));

const LinksContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

export default DraftPreviewNavigator;
