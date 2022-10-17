import React from "react";
import { Grid, styled, Typography } from "@material-ui/core";
import GalleryCard from "./components/GalleryCard";
export interface NewProps {}

const pages = [
  {
    title: "All Trials",
    description: "Homepage - All Trials",
    imageUrl: "/screenshot/Lilly-TrialHomePage-V02 Copy 6.png",
    pageUrl: "/",
  },
  {
    title: "My Trials",
    description: "Homepage - My Trials",
    imageUrl: "/screenshot/Lilly-TrialHomePage-AllTrials.png",
    pageUrl: "/all-trials",
  },
  {
    title: "Create New",
    description: "Create New",
    imageUrl: "/screenshot/Lily-CreateNew-V02.png",
    pageUrl: "/create-new",
  },
  {
    title: "New Scenario",
    description: "Create a scenario for new or existing workspace",
    imageUrl: "/screenshot/Lilly-SessionStart-V02.png",
    pageUrl: "/new-trial-detail/scenario",
  },
  {
    title: "New Trial Workspace",
    description: "Create a new trial workspace",
    imageUrl: "/screenshot/Lilly-SessionStart-V03 Copy.png",
    pageUrl: "/new-trial-detail/workspace",
  },
  {
    title: "Trial Homepage",
    description: "Trial Homepage",
    imageUrl: "/screenshot/Lilly-TrialLandingPage-Edit-V03.png",
    pageUrl: "/trial-homepage",
  },
  {
    title: "Edit Scenario",
    description: "Edit Scenario",
    imageUrl: "/screenshot/Lilly-SessionDraft-V03.png",
    pageUrl: "/edit-scenario",
  },
  {
    title: "Compare Scenario Performance",
    description: "Compare Scenario Performance",
    imageUrl: "/screenshot/Lilly-KeyModeling Copy 21.png",
    pageUrl: "/compare-scenario",
  },
  {
    title: "I/E Criteria Builder",
    description: "I/E Critera Builder",
    imageUrl: "/screenshot/Lilly-HistorialTrialExtraction-V03 Copy 2.png",
    pageUrl: "/IE/criteriaBuilder",
  },
  {
    title: "I/E Historical Summary",
    description: "I/E Historical Summary",
    imageUrl: "/screenshot/Lilly-I／EHistorialSummary-V03 Copy.png",
    pageUrl: "/IE/historicalSummary",
  },
  {
    title: "I/E Edit Scenario",
    description: "I/E Historical Summary - Edit Scenario",
    imageUrl: "/screenshot/Lilly-SessionDraft-I／E-V02.png",
    pageUrl: "/IE/editScenario",
  },
  {
    title: "I/E Criteria",
    description: "I/E Criteria - Impact Analysis",
    imageUrl: "/screenshot/Lilly-PredictedImpact_Cost.png",
    pageUrl: "/IE/criteriaImpact",
  },
  {
    title: "Schedule of Activities",
    description: "Schedule of Activities - Impact Analysis",
    imageUrl: "/screenshot/Lilly-PredictedImpact_Cost.png",
    pageUrl: "/IE/predictImpact",
  },
  {
    title: "I/E Draft Scenario",
    description: "I/E Draft Scenario",
    imageUrl: "/screenshot/Lilly-SessionDraft-V03.png",
    pageUrl: "/IE/draftScenario",
  },
  {
    title: "I/E Preview Scenario",
    description: "I/E Preview Scenario",
    imageUrl: "/screenshot/Lilly-SessionPreview-V02 Copy 2.png",
    pageUrl: "/IE/previewScenario",
  },
  {
    title: "SoA Builder",
    description: "Add Schedule of Activities",
    imageUrl: "/screenshot/Lilly-SoABuilder-V03.png",
    pageUrl: "/SoA/criteriaBuilder",
  },
  {
    title: "SoA Historical Summary",
    description: "SoA Historical Summary",
    imageUrl: "/screenshot/Lilly-SoAHistorialSummary-V03 Copy.png",
    pageUrl: "/SoA/historicalSummary",
  },
  {
    title: "Enter Trial Endpoints",
    description: "Enter Trial Endpoints",
    imageUrl: "/screenshot/Lilly-SoA-Endpoints-V03 Copy 2.png",
    pageUrl: "/endpoints",
  },
  {
    title: "Associated Endpoints",
    description: "Activity Relationship to Endpoints",
    imageUrl: "/screenshot/Lilly-SoA-EndpointsCategorized-V03.png",
    pageUrl: "/associate-endpoints",
  },
];

const Dashboard: React.FC<NewProps> = () => {
  return (
    <Container>
      <Title variant="h1">SD DIO Pages</Title>
      <Gallery container spacing={3}>
        {pages.map((page) => (
          <Grid item>
            <GalleryCard
              title={page.title}
              description={page.description}
              imageSrc={page.imageUrl}
              pageUrl={page.pageUrl}
            />
          </Grid>
        ))}
      </Gallery>
    </Container>
  );
};

const Container = styled(Grid)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "70px",
  padding: "30px",
});
const Gallery = styled(Grid)({
  marginTop: "50px",
});
const Title = styled(Typography)({});

export default Dashboard;
