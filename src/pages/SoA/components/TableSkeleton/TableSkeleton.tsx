import React from "react";
import { Grid } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const TableSkeleton: React.FC = () => (
  <Grid style={{ width: "100%" }}>
    {Array.from(Array(6)).map((_x, index) => (
      <Grid
        key={index}
        container
        direction="row"
        spacing={1}
        justify="space-between"
        style={{ paddingBottom: "2rem" }}
      >
        <Grid item xs={3} sm={3} md={3}>
          <Skeleton />
        </Grid>
        <Grid item xs={3} sm={3} md={3}>
          <Skeleton />
        </Grid>
        <Grid item xs={3} sm={3} md={3}>
          <Skeleton />
        </Grid>
        <Grid item xs={3} sm={3} md={3}>
          <Skeleton />
        </Grid>
      </Grid>
    ))}
  </Grid>
);

export default TableSkeleton;
