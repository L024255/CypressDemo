import { Button, Grid, styled, Typography } from "@material-ui/core";
import React, { useState } from "react";

const UnauthorizedError = () => {
  const [title] = useState("Access denied");
  const [content] = useState(
    <>
      <p>You do not have permission to access this application. If you think you have
        reached this message in error, please refresh. If this message persists, please
      contact the system administrator.</p>
    </>
  )
  return <Container container>
    <Header item>
      <TitleAccess variant="h1">{title}</TitleAccess>
    </Header>
    <Body item>
      <Content variant="body1">{content}</Content>
    </Body>
    <Action item>
      <RefreshButton 
        variant="contained"
        color="primary"
        onClick={() => {
          window.location.reload()
        }}
      >Refresh</RefreshButton>
    </Action>
  </Container>
};

export default UnauthorizedError;

const TitleAccess = styled(Typography)({
  fontSize: "2rem",
  fontWeight: 500,
});

const Container = styled(Grid)({
  width: "600px",
  margin: "auto",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});
const Header = styled(Grid)({
  marginBottom: "20px"
});
const Body = styled(Grid)({});
const Action = styled(Grid)({
  marginTop: "20px"
});

const Content = styled(Typography)({
  textAlign: "center",
});
const RefreshButton = styled(Button)({
  borderRadius: "3rem",
  padding: "4px 42px",
  fontSize: "1rem",
  fontWeight: 500,
});