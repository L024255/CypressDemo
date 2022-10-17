import React from "react";
import { Grid } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const HomePageSkeleton: React.FC<{ amount: number }> = ({ amount }) => (
  <>
    <Skeleton
      variant="rect"
      width={143}
      height={19}
      style={{ marginBottom: "3rem" }}
    />

    {Array.from(Array(amount)).map((_x, index) => (
      <Grid
        key={index}
        container
        direction="row"
        justify="space-between"
        style={{ paddingBottom: "2rem" }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Skeleton />
        </Grid>
      </Grid>
    ))}
  </>
);

export default HomePageSkeleton;
