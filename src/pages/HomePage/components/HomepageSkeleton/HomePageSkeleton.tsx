import React from "react";
import { Grid } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const TrialListSkeleton: React.FC = () => (
  <>
    <Skeleton
      variant="rect"
      width={143}
      height={19}
      style={{ marginBottom: "3rem" }}
    />

    {Array.from(Array(10)).map((_x, index) => (
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

export default TrialListSkeleton;
