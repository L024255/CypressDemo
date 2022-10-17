import { Grid, styled, Collapse } from "@material-ui/core";
import React, { FC, useState } from "react";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
export interface AggregateCriteriaCardProps {
  title: string;
  children?: React.ReactNode;
}

const AggregateCriteriaCard: FC<AggregateCriteriaCardProps> = ({
  title,
  children,
}) => {
  const [expand, setExpand] = useState(true);
  const handleClickExpand = () => {
    setExpand(!expand);
  };
  return (
    <CardContainer>
      <CardTitle>
        <TitleLeft>{title}</TitleLeft>
        <TitleRight>
          <ExpandIcon
            style={
              !expand
                ? {
                    transform: "rotate(180deg)",
                    transition: "transform .5s",
                  }
                : {
                    transition: "transform .5s",
                    transform: "rotate(0deg)",
                  }
            }
            onClick={handleClickExpand}
          />
        </TitleRight>
      </CardTitle>
      <Collapse in={expand}>
        <CardContent>{children}</CardContent>
      </Collapse>
    </CardContainer>
  );
};

const CardContainer = styled(Grid)({
  width: "100%",
  background: "#FFFFFF",
  boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.3)",
  borderRadius: "4px",
  // marginLeft: "3.813rem",
  marginTop: "1.875rem",
  clear: "both",
  padding: "1.875rem 22px",
});
const TitleLeft = styled(Grid)({
  float: "right",
  marginRight: "3.125rem",
  fontSize: "0.625rem",
  color: "#000000;",
  letterSpacing: "1px;",
  webkitBackgroundClip: "text;",
  webkitTextFillColor: "transparent;",
  textTransform: "uppercase",
});
const TitleRight = styled(Grid)({
  float: "right",
  marginRight: "3.125rem",
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "#D52B1E;",
  display: "flex",
  "& >.MuiSvgIcon-root": {
    marginTop: "-3px;",
    marginLeft: "2px;",
  },
});
const CardTitle = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
});
const CardContent = styled(Grid)({
  display: "flex",
  flexWrap: "wrap",
});
const ExpandIcon = styled(ExpandLessIcon)({
  cursor: "pointer",
});

export default AggregateCriteriaCard;
