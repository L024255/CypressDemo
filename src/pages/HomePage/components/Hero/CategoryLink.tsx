import React, { FC } from "react";
import { styled, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const CategoryLink: FC<{ label: string; category: string }> = ({
  label,
  category,
}) => (
  <LinkWrapper item xs={12} sm={6}>
    <LinkContainer to={`browse?filter=${category.toLowerCase()}`}>
      <Typography variant="h3" color="textPrimary" style={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </LinkContainer>
  </LinkWrapper>
);

const LinkWrapper = styled(Grid)(({ theme }) => ({
  display: "flex",
  minHeight: "13rem",
}));

const LinkContainer = styled(Link)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flex: 1,
  textDecoration: "none",
  margin: "2rem",
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
    cursor: "pointer",
  },
  [theme.breakpoints.down("xs")]: {
    margin: "2rem 0",
  },
}));

export default CategoryLink;
