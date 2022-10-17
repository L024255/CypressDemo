import { Grid, styled, Typography } from "@material-ui/core";
import { ChevronRightOutlined, ExpandMoreOutlined } from "@material-ui/icons";
import React, { useState } from "react";

export interface ICollapseContainer {
  title: String;
  direction?: String;
  children: React.ReactNode;
}

const CollapseContainer: React.FC<ICollapseContainer> = ({
  title,
  direction,
  children,
}) => {
  const [showContent, setShowContent] = useState(true);

  const handleChangeShowContent = () => {
    setShowContent(!showContent);
  };
  return (
    <Container>
      <Grid item>
        <Text variant="h5" onClick={handleChangeShowContent}>
          {title}
          {showContent ? (
            <ExpandMoreOutlined color="primary" fontSize="small" />
          ) : (
            <ChevronRightOutlined color="primary" fontSize="small" />
          )}
        </Text>
      </Grid>
      <ContentContainer container spacing={3}>
        {showContent && children}
      </ContentContainer>
    </Container>
  );
};
const Container = styled(Grid)({
  marginBottom: "2rem",
  width: "100%",
});
const Text = styled(Typography)({
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
});
const ContentContainer = styled(Grid)({
  margin: "2rem 0",
});
export default CollapseContainer;
