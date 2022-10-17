import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoot from "./components/AppRoot";
import theme from "./config/theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "./api/apollo";
import AuthorizedContext from "./provider/AuthorizedContextProvider";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(true);
  useEffect(() => {
  },[]);
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <AuthorizedContext.Provider value={{ authenticated, setAuthenticated}}>
          <CssBaseline />
          <AppRoot />
          </AuthorizedContext.Provider>
        </ApolloProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
