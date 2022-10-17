import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Select, styled, FormHelperText } from "@material-ui/core";
import { ExpandMoreOutlined } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    "& .MuiSvgIcon-root": {
      height: "9px",
      weight: "6[x",
    },
    "& > .MuiInput-underline:before": {
      borderColor: "white !important",
    },
    width: "100%",
  },
  placehoder: {
    color: "#A59D95",
  },
});

const CustomSelect = ({
  children,
  ...props
}: {
  [x: string]: any;
  children: any;
}) => {
  const classes = useStyles();
  return (
    <>
      <StyledSelected
        classes={{ root: classes.root }}
        // IconComponent={() => (
        //   <ExpandMoreOutlined
        //     color="primary"
        //     style={{
        //       width: "1.25rem",
        //       height: "1.25rem",
        //       marginRight: "0.75rem",
        //     }}
        //   />
        // )}
        IconComponent={DropDownIcon}
        {...props}
      >
        {children}
      </StyledSelected>
      {props.unit && <UnitDisplay>{props.unit}</UnitDisplay>}
      {props.helperText && 
        <FormHelperText error>{props.helperText}</FormHelperText>
      }
    </>
  );
};


const DropDownIcon = styled(ExpandMoreOutlined)({
  color: "#D52B1E",
  width: "1.25rem",
  height: "1.25rem !important",
  marginTop: "2px",
});

const UnitDisplay = styled("div")({
  position: "absolute",
  right: "30px",
  top: "10px",
});
const StyledSelected = styled(Select)({
  fontSize: "12px",
  "&.placeholder": {
    color: "#A59D95",
  },
});

export default CustomSelect;
