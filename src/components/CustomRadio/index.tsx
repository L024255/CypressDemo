import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio, { RadioProps } from "@material-ui/core/Radio";

const useStyles = makeStyles({
  root: {
    "& .MuiSvgIcon-root": {
      height: 15,
      weight: 15,
    },
  },
  checked: {},
});

function StyledRadio(props: RadioProps) {
  const classes = useStyles();
  return (
    <Radio
      classes={{ root: classes.root, checked: classes.checked }}
      {...props}
    />
  );
}

export default StyledRadio;
