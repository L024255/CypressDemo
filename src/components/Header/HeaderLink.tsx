import { styled, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

export interface HeaderLinkProps {
  link: string;
  analyticsOptions: AnalyticsOptions;
  icon?: React.ReactNode;
  color?: "primary" | "default";
  style: object;
  activePath?: string;
}

type AnalyticsOptions = {
  action: string;
  labels: string[];
};

const HeaderLink: FC<HeaderLinkProps> = ({
  link,
  analyticsOptions,
  icon = null,
  color = "default",
  children,
  style,
  activePath,
}) => {
  const handleClick = () => {};

  const { pathname } = useLocation();
  const isActive =
    (activePath && activePath !== "/" && pathname.includes(activePath)) ||
    pathname === activePath;
  return (
    <Link
      to={link}
      onClick={handleClick}
      className={`${color} header-link ${isActive ? "active-link" : ""}`}
      style={style}
    >
      {icon}
      <LinkText variant="body2">{children}</LinkText>
    </Link>
  );
};

const Link = styled(RouterLink)(({ theme }) => ({
  "&.default": {
    color: theme.palette.common.black,
  },
  "&.primary": {
    color: theme.palette.primary.main,
  },
  letterSpacing: "0.081rem",
  lineHeight: "1.5rem",
  fontSize: "0.875rem",
  height: theme.mixins.toolbar.minHeight,
  textDecoration: "none",
  textTransform: "uppercase",
  maxHeight: "53px",
  display: "flex",
  marginRight: "20px",
  alignItems: "center",
  "&&:hover": {
    cursor: "pointer",
    boxShadow: `inset 0 -3px 0 0 #F94638`,
  },
  "&.active-link": {
    cursor: "pointer",
    color: theme.palette.primary.main,
    boxShadow: `inset 0 -3px 0 0 #F94638`,
  },
  "&.active-link p": {
    color: "#F94638",
  },
  "&& svg": {
    paddingRight: ".5rem",
    fontSize: "2.5rem",
  },
  "&&:hover p": {
    color: "#F94638",
  },
}));
const LinkText = styled(Typography)({
  fontWeight: 600,
});

export default HeaderLink;
