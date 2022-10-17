import { Grid, styled, Typography } from "@material-ui/core";
import React, { FC, useState } from "react";
import SearchBar from "../../../../components/SearchBar";
import { useJwtInfo } from "../../../../hooks/JwtInfo";

export interface HeroProps {
  userName: string;
  onSearch: Function;
}

const Hero: FC<HeroProps> = ({ onSearch, userName }) => {
  const [textQuery] = useState();

  const handleSearch = (searchValue?: string) => {
    onSearch(searchValue);
  };
  const { username } = useJwtInfo();
  let firstName = username.split(" ")[0];
  if (userName) {
    firstName = userName.split(" ")[0];;
  }

  return (
    <BackgroundImage>
      <Container
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item style={{ width: "100%" }}>
          <UpperContainer
            container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <Heading variant="h1">
              {firstName}, welcome to your SD DIO Workspace
            </Heading>
            <Search
              size="large"
              iconPosition="end"
              placeholder="Search by key words, therapeutic areas, or trial aliases"
              autoFocus={true}
              value={textQuery}
              onSearch={handleSearch}
            />
          </UpperContainer>
        </Grid>
      </Container>
    </BackgroundImage>
  );
};

const BackgroundImage = styled("div")({
  backgroundImage:
    "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,1)),url(../hero-bg-lg.svg)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  "clip-path": "polygon(0 0%, 100% 0%, 100% 90%, 50% 100%, 0 90%)",
});

const Container = styled(Grid)({
  height: "342px",
  maxWidth: "80rem",
  margin: "auto",
  padding: "0 1rem",
});

const UpperContainer = styled(Grid)({ width: "100%" });

const Heading = styled(Typography)({
  fontSize: "2.125rem",
  fontWeight: 500,
  textAlign: "center",
  letterSpacing: 0,
  lineHeight: "2.813rem",
  paddingBottom: ".5rem",
  marginBottom: "2rem",
});

const Search = styled(SearchBar)(({ theme }) => ({
  width: "100%",
  marginTop: "10px",
  [theme.breakpoints.down("xs")]: {
    width: "90%",
  },
}));

export default Hero;
