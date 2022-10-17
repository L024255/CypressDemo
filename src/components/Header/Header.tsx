import {
  Grid,
  styled,
  Typography,
  Divider,
  Box,
  // IconButton as MuiIconButton,
} from "@material-ui/core";
// import { SearchOutlined, NotificationsOutlined } from "@material-ui/icons";
import React, { FC, useState, useEffect, useContext } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import HeaderLink from "./HeaderLink";
import { LillyLogo } from "../icons";
import HeaderAvatar from "./HeaderAvatar";
import Cookies from "js-cookie";
import Environment from "../../config/environment";
import AuthroizedContext from "../../provider/AuthorizedContextProvider";

const { apiUrl } = new Environment();

export enum NavigatorTheme {
  Black,
  White,
}
export interface IHeader { }
const Header: FC<IHeader> = () => {
  const { pathname } = useLocation();
  const [data] = useState({});
  const [headerTheme, setHeaderTheme] = useState(NavigatorTheme.White);
  const { authenticated } = useContext(AuthroizedContext);

  const useBlackHeader = headerTheme === NavigatorTheme.Black;
  const containerStyle = useBlackHeader
    ? { backgroundColor: "#1C1C1C" }
    : {
      borderBottom: "1px solid #EEEEEE",
      backgroundColor: "#FFFFFF",
    };
  const themeFontColor = useBlackHeader ? "#FFF" : "#2D2D2D";

  const fetchToken = async () => {

    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    const headers = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    try {
      let response = await fetch(`${apiUrl}/token`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          token: refreshToken,
        }),
      });
      let data = await response.json();

      if (data.access_token) {
        Cookies.set("accessToken", data.access_token);
        Cookies.set("refreshToken", data.refresh_token);
      }

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {

    //every 10 minutes
    const call_fetch = () => {
      fetchToken();
    };
    const interval = setInterval(call_fetch, 600000);
    return () => {
      clearInterval(interval);
    };

  }, []);


  useEffect(() => {
    const theme =
      pathname.includes("new-") ||
        pathname.includes("edit-") ||
        (pathname.includes("IE") && !pathname.includes("preview")) ||
        pathname.includes("SoA") ||
        pathname.includes("endpoints/enter") ||
        pathname.includes("endpoints/external")
        ? NavigatorTheme.Black
        : NavigatorTheme.White;
    setHeaderTheme(theme);
  }, [pathname]);
  if (pathname.includes("-pdf")) {
    return null;
  }
  return (
    <Container
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      style={containerStyle}
      role="banner"
      aria-label="Page Header"
    >
      <Grid item xs={12} sm={8} md={6}>
        <LinksContainer
          container
          direction="row"
          justify="flex-start"
          wrap="nowrap"
          role="navigation"
          aria-label="Main Navigation"
        >
          <Link to="/">
            <LillyLogo
              style={{
                fontSize: "4rem",
                width: "1em",
                height: ".5em",
                color: useBlackHeader ? "#FFF" : "#D52B1E",
              }}
            />
          </Link>
          <VerticalDivider
            orientation="vertical"
            variant="middle"
            style={useBlackHeader ? { backgroundColor: "#82786F" } : {}}
          />
          <Workspace
            noWrap
            variant="subtitle1"
            style={{ color: themeFontColor }}
          >
            SD DIO WORKSPACE
          </Workspace>
          <VerticalDivider orientation="vertical" variant="middle" />
          {
            authenticated && (
              <>
                <HeaderMenuLink
                  link="/"
                  color="default"
                  activePath="/"
                  style={{ color: themeFontColor }}
                  analyticsOptions={{ action: "browse", labels: ["my trials"] }}
                >
                  My Trials
                </HeaderMenuLink>

                <HeaderMenuLink
                  link="/all-trials"
                  color="default"
                  activePath="/all-trials"
                  style={{ color: themeFontColor }}
                  analyticsOptions={{ action: "view", labels: ["all trials"] }}
                >
                  All Trials
                </HeaderMenuLink>
                <HeaderMenuLink
                  link="/create-new"
                  activePath="new-"
                  color="default"
                  style={{ color: themeFontColor }}
                  analyticsOptions={{ action: "view", labels: ["create new"] }}
                >
                  Create New
                </HeaderMenuLink>
              </>
            )
          }
        </LinksContainer>
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}
        md={6}
        container
        direction="row"
        justify="flex-end"
      >
        <Box display="flex">
          {/* <ActionContainer>
            <IconButton>
              <Search />
            </IconButton>
          </ActionContainer>
          <ActionContainer>
            <IconButton>
              <Alert />
            </IconButton>
          </ActionContainer>
          <VerticalDivider
            orientation="vertical"
            variant="middle"
            style={useBlackHeader ? { backgroundColor: "#82786F" } : {}}
          /> */}
          <HeaderAvatar
            data={data}
            fetchNotifications={() => { }}
          ></HeaderAvatar>
        </Box>
      </Grid>
    </Container>
  );
};

const HeaderMenuLink = styled(HeaderLink)({
  textTransform: "uppercase",
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

const Link = styled(RouterLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.common.black,
}));

const VerticalDivider = styled(Divider)({
  alignSelf: "center",
  height: "20px",
});

const Workspace = styled(Typography)({
  fontWeight: 600,
  color: "#252525",
  fontSize: "1rem",
  letterSpacing: "0.03px",
  lineHeight: "1.5rem",
});

export default Header;
