import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

interface CustomErrorBarProps {
  open: boolean;
  content: string;
  duration?: number;
  isSuccess?: boolean;
  severity?: string;
  onClose: ((event: React.SyntheticEvent<Element, Event>) => void) | undefined;
}
const CustomErrorBar: React.FC<CustomErrorBarProps> = ({
  open,
  onClose,
  content,
  duration,
  isSuccess,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={onClose}
      autoHideDuration={duration || 6000}
    >
      <Alert onClose={onClose} severity={isSuccess ? "success" : "error"}>
        {content}
      </Alert>
    </Snackbar>
  );
};
export default CustomErrorBar;
