import { Grid, styled, Typography, ButtonBase } from "@material-ui/core";
import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { NewTrial } from "../../../components/icons";
import { Scenario } from "../../../components/icons";
// import SearchBar from "../../../../components/SearchBar";

export interface TitleProps {}

const Title: FC<TitleProps> = () => {
  const history = useHistory();
  const handleClickCreateScenario = () => {
    history.push("new-trial-detail/scenario");
  };
  const handleClickNewTrial = () => {
    history.push("new-trial-detail/workspace");
  };

  return (
    <BackgroundImage>
      <Container
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <UpperContainer
            container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <Heading variant="h1">What are you creating?</Heading>
            <Grid>
              <CreateButton onClick={handleClickNewTrial}>
                <Grid>
                  {/* <PostAddOutlined fontSize="large" color="primary" /> */}
                  <NewTrial style={{ width: "20px", height: "28px" }} />
                  <CreateButtonText>New Trial Workspace</CreateButtonText>
                </Grid>
              </CreateButton>
              <CreateButton onClick={handleClickCreateScenario}>
                <Grid>
                  {/* <LayersOutlined fontSize="large" color="primary" /> */}
                  <Scenario style={{ width: "28px", height: "27px" }} />
                  <CreateButtonText>
                    Scenario For Existing Trial
                  </CreateButtonText>
                </Grid>
              </CreateButton>
            </Grid>
          </UpperContainer>
        </Grid>
      </Container>
    </BackgroundImage>
  );
};

const BackgroundImage = styled("div")({});

const Container = styled(Grid)({
  // height: "500px",
  maxWidth: "80rem",
  margin: "auto",
  padding: "0 1rem",
  marginTop: "40px",
});

const UpperContainer = styled(Grid)({});

const Heading = styled(Typography)({
  fontSize: "2.125rem",
  fontWeight: 500,
  color: "#000",
  textAlign: "center",
  paddingBottom: ".5rem",
  marginBottom: "20px",
  letterSpacing: 0,
  lineHeight: "2.813rem",
});

const CreateButton = styled(ButtonBase)({
  width: "210px",
  height: "160px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "10px",
  backgroundColor: "#fff",
  margin: "10px",
  boxShadow: "0 1px 1px 1px rgba(0,0,0,0.08)",
  "&&:hover": {
    border: "2px solid #D52B1E",
  },
  "&&:focus-visible": {
    outline: "-webkit-focus-ring-color auto 1px !important",
  },
});
const CreateButtonText = styled(Typography)({
  color: "#000000",
  fontSize: "14px",
  letterSpacing: 0,
  lineHeight: "22px",
  marginTop: "8px",
});

export default Title;
