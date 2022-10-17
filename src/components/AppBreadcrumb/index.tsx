import React from "react";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Link } from "@material-ui/core";
import { Home } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
      textTransform: "uppercase",
      fontSize: "0.5rem",
      letterSpacing: "0.075rem",
      color: "#82786F",
      fontWeight: 500,
    },
    current: {
      display: "flex",
      textTransform: "uppercase",
      fontSize: "0.5rem",
      letterSpacing: "0.075rem",
      color: "#82786F",
      fontWeight: 500,
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
  })
);

interface LinkObject {
  text: string;
  href?: string;
  icon?: React.ReactNode;
  currentPage?: boolean;
}

interface AppBreadcrumbProps {
  links: LinkObject[];
}
const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ links }) => {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb" separator=">">
      {links.map((link, index) => {
        return (
          <div key={index}>
            {!link.currentPage && (
              <Link
                key={index}
                color="inherit"
                className={classes.link}
                href={link.href}
              >
                {link.href === "/" ? <Home /> : link.icon}
                {link.text}
              </Link>
            )}

            {link.currentPage && (
              <span className={classes.current}>{link.text}</span>
            )}
          </div>
        );
      })}
    </Breadcrumbs>
  );
};

export default AppBreadcrumb;
