import React from "react";
import { Grid, styled } from "@material-ui/core";

import Title from "./components/Title";
import AppBreadcrumb from "../../components/AppBreadcrumb";

interface NewTrialProps {}
const NewTrial: React.FC<NewTrialProps> = () => {
  return (
    <Container>
      <BreadcrumbContainer>
        <AppBreadcrumb
          links={[
            { href: "/", text: "" },
            { href: "/create-new", text: "Create New" },
          ]}
        />
      </BreadcrumbContainer>
      <Title />
    </Container>
  );
};

const Container = styled(Grid)({
  display: "block",
  // minHeight: "100vh",
  height: "559px",
  margin: "auto",
  paddingTop: "3.25rem",
  backgroundImage:
    "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,1)),url(../hero-bg-lg.svg)",
  backgroundPosition: "center",
});
const BreadcrumbContainer = styled(Grid)({
  marginLeft: "17.75rem",
});

export default NewTrial;
