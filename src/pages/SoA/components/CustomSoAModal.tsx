import React, { useEffect } from "react";
import {
  styled,
  FormControl,
  Grid,
  FormLabel,
  TextField,
  Typography,
  Modal as MUIModal,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import * as yup from "yup";
import { useFormik } from "formik";

interface CustomSoAFormModalProps {
  open: boolean;
  activityCategoryName?: string;
  activityCategoryId?: string;
  userDefinedActivityName?: string;
  scenarioId?: string;
  userEditSoA?: {
    activityName: string,
    activityId: string,
    cost: any,
    scenarioId: string,
  };
  handleClose: () => void;
  handleAddCustomSoA: (customSoA: {
    activityCategoryId: string;
    userDefinedActivityName: string;
    cost: number;
    scenarioId: string;
  }) => void;
  handleUpdateCustomSoACost?: (editSoA: {
    id: any;
    cost: any;
  }) => void;
}

export const CustomSoAFormModal: React.FC<CustomSoAFormModalProps> = ({
  open,
  activityCategoryId,
  activityCategoryName,
  userDefinedActivityName,
  scenarioId,
  userEditSoA,
  handleClose,
  handleAddCustomSoA,
  handleUpdateCustomSoACost,
}) => {
  const initialCustomSoAValues: { [x: string]: any } = {
    userDefinedActivityName,
    cost: 0,
  };
  const soaValidateSchema = yup.object().shape(({
    userDefinedActivityName: yup.string().required("Activity name is required"),
    cost: yup.number().required("Cost is required."),
  }))
  const customSoAFormike = useFormik({
    initialValues: initialCustomSoAValues,
    validationSchema: soaValidateSchema,
    onSubmit: (values) => {
      const {
        userDefinedActivityName,
        cost,
      } = values;
      if (userEditSoA) {
        const editSoA: {
          id: any,
          cost: any,
        } = {
          id: userEditSoA.activityId,
          cost,
        }
        handleUpdateCustomSoACost && handleUpdateCustomSoACost(editSoA);
      } else {
        const customSoA: any = {
          scenarioId: scenarioId,
          activityCategoryId,
          userDefinedActivityName,
          cost,
        }
        handleAddCustomSoA(customSoA);
      }
    },
  });
  useEffect(() => {
    if (userDefinedActivityName) {
      customSoAFormike.setFieldValue("userDefinedActivityName", userDefinedActivityName);
    }
    if (userEditSoA) {
      console.log('Edit SoA');
      customSoAFormike.setFieldValue("cost", userEditSoA.cost);
    } else {
      customSoAFormike.setFieldValue("cost", 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDefinedActivityName]);

  const renderNewSoAForm = () => {
    return <Grid container>
      <Grid item xs={5}>
        <FormControlCriterion>
          <FormLabel component="legend">
            <FieldTitle>SoA name</FieldTitle>
          </FormLabel>
          <Input
            disabled={userEditSoA !== undefined}
            variant="outlined"
            id="userDefinedActivityName"
            name="userDefinedActivityName"
            value={customSoAFormike.values.userDefinedActivityName}
            onChange={customSoAFormike.handleChange}
          />
        </FormControlCriterion>
        <FormControl component="fieldset">
            <FormLabel component="legend">
              <FieldTitle>Cost</FieldTitle>
            </FormLabel>
            <NumberInput
              variant="outlined"
              id="cost"
              name="cost"
              type="Number"
              value={customSoAFormike.values.cost}
              onChange={customSoAFormike.handleChange}
            />
          </FormControl>
      </Grid>
      <ButtonContainer>
        <AddBtn onClick={() => { customSoAFormike.handleSubmit() }}>
          {userEditSoA ? <>Save</> : <>Add</>}
        </AddBtn>
      </ButtonContainer>
    </Grid>;
  };
  return <Modal
    open={open}
    onClose={() => {
      handleClose();
    }}
  >
    <CriteriaBoxContainerModal>
      <CriteriaDataContainer>
        <HeadingModal>
          {activityCategoryName}
          <CloseIcon
            tabIndex={0}
            onClick={() => {
              handleClose();
            }}
            onKeyPress={() => {
              handleClose();
            }}
          />
        </HeadingModal>
        <ModalContentWraper>
          {renderNewSoAForm()}
        </ModalContentWraper>
      </CriteriaDataContainer>
    </CriteriaBoxContainerModal>
  </Modal>
}


const FormControlCriterion = styled(FormControl)({
  marginBottom: "10px",
});

const CriteriaDataContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});
const Modal = styled(MUIModal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const CriteriaBoxContainerModal = styled("div")({
  width: 715,
  height: 430,
  border: "1px solid #DDDDDD",
  boxShadow: "0 1px 5px 0 rgba(0,0,0,0.12)",
  backgroundColor: "#ffffff",
  padding: "1rem 2rem",
  borderRadius: 12,
});
// const RangeContainer = styled("div")({
//   display: "flex",
// });
const FieldTitle = styled(Typography)({
  color: "#666",
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.094rem",
  lineHeight: "1rem",
  textTransform: "uppercase",
  padding: "0.5rem 0rem",
});
const Input = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& > label": {
    fontStyle: "italic",
  },
  "& > .MuiInput-underline:before": {
    borderColor: "white !important",
  },
  "& .MuiFormHelperText-contained": {
    marginLeft: 0,
  },
}));
const NumberInput = styled(Input)({
  width: "80px",
});
const HeadingModal = styled("div")({
  color: "#252525",
  fontSize: 30,
  letterSpacing: "0.15px",
  marginTop: "1rem",
  fontWeight: 500,
});
const ModalContentWraper = styled(Grid)({
  color: "#252525",
  fontSize: 30,
  letterSpacing: "0.15px",
  marginTop: "1rem",
  fontWeight: 500,
})

const CloseIcon = styled(Close)(({ theme }) => ({
  borderRadius: 20,
  outline: "none",
  "&&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
  "&&:focus": {
    backgroundColor: theme.palette.grey[200],
  },
  cursor: "pointer",
  float: "right",
  position: "relative",
  top: "8px",
  fontSize: "30px",
}));
const AddBtn = styled(Grid)({
  width: "80px;",
  height: "30px;",
  lineHeight: "19px",
  background: "#F9F9F9;",
  borderRadius: "25px;",
  border: "1px solid #D52B1E;",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "17px",
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
  cursor: "pointer",
  letterSpacing: "1px;",
});
const ButtonContainer = styled(Grid)({
  width: "100%",
  justifyContent: "flex-end",
  display: "flex",
});
