import React from "react";
import { useHistory } from "react-router-dom";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  styled,
  Grid,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

interface AlertDialogProps {
  titleIcon?: any;
  title?: string;
  content?: string;
  open: boolean;
  handleClose: any;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  titleIcon,
  title,
  content,
  open,
  handleClose,
}) => {
  const { push } = useHistory();
  const handleCreateScenario = () => {
    push("/new-trial-detail/scenario");
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <CloseButton aria-label="close" onClick={handleClose}>
          <Close />
        </CloseButton>
      </DialogTitle>
      <Content>
        <IconContainer>
          <AlertIcon />
        </IconContainer>
        <DialogContentText id="alert-dialog-description">
          <ContentTitle>{title}</ContentTitle>
          <ContentDescription>{content}</ContentDescription>
        </DialogContentText>
      </Content>
      <DialogBotton>
        <Button
          onClick={handleCreateScenario}
          color="primary"
          variant="contained"
          style={{ borderRadius: "20px" }}
        >
          Create Scenario
        </Button>
      </DialogBotton>
    </Dialog>
  );
};

const CloseButton = styled(IconButton)({
  background: "#D5D2CA",
  color: "#fff",
  width: "26px",
  height: "26px",
  opacity: 0.86,
  top: "22px",
});
const Dialog = styled(MuiDialog)({});
const DialogTitle = styled(MuiDialogTitle)({
  display: "flex",
  justifyContent: "flex-end",
  paddingTop: 0,
  paddingBottom: 0,
});
const Content = styled(DialogContent)({
  paddingTop: 0,
  paddingLeft: "85px",
  paddingRight: "85px",
  textAlign: "center",
});
const ContentTitle = styled(Typography)({
  display: "flex",
  justifyContent: "center",
  fontSize: "24px",
  color: "#2D2D2D",
  lineHeight: "29px",
  marginBottom: "18px",
});
const ContentDescription = styled(Grid)({
  fontSize: "16px",
  color: "#2D2D2D",
  lineHeight: "24px",
});
const AlertIcon = styled("div")({
  backgroundImage: "url(/none-error.svg)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "90px",
  height: "74px",
  marginBottom: "34px",
});
const IconContainer = styled(Grid)({
  display: "flex",
  justifyContent: "center",
});
const DialogBotton = styled(DialogActions)({
  paddingBottom: "45px",
  display: "flex",
  justifyContent: "center",
});

export default AlertDialog;
