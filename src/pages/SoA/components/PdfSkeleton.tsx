import React from "react";
import { Grid, styled } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const PdfSkeleton: React.FC = () => (
  <Container container>
    <Skeleton variant="rect" width={450} height={450} style={{ marginBottom: "30px" }} />

    {Array.from(Array(5)).map((_x, index) => (
      <Grid
        key={index}
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ paddingBottom: "2rem" }}
      >
        <Grid item>
          <Skeleton width={450} />
        </Grid>
      </Grid>
    ))}
  </Container>
);
const Container = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  width: "100%"
})

export default PdfSkeleton;
