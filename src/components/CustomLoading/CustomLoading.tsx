import React from "react";

import {
  Backdrop,
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
interface CustomLoadingProps {
  open: boolean;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 999,
      color: "#fff",
      background: "transparent",
    },
  })
);
const CustomLoading: React.FC<CustomLoadingProps> = ({ open }) => {
  const backdropClasses = useStyles();
  return (
    <Backdrop className={backdropClasses.backdrop} open={open}>
      <CircularProgress />
    </Backdrop>
  );
};

export default CustomLoading;
