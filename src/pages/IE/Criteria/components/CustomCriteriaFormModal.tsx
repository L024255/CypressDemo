import React, { useEffect } from "react";
import {
  styled,
  FormControl,
  Grid,
  FormLabel,
  TextField,
  Typography,
  Modal as MUIModal,
  Select,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import * as yup from "yup";
import { useFormik } from "formik";
import { ScenarioCriteriaModle } from "../type/ScenarioCriteriaModel";
import { isNumber } from "lodash";
import { CriteriaCategoryModel } from "../../../../@types/CriteriaCategory";

interface CustomCriteriaFormModalProps {
  open: boolean;
  category?: {
    id: string;
    name: string;
    type: string;
  };
  templateCriterion?: any;
  newCustomCriterionName?: string;
  categoryOptions?: CriteriaCategoryModel[];
  criterionAddToType?: string;
  handleClose: () => void;
  handleAddCriterion: (criterion: any, type: string) => void;
  handleAddCustomCriterion: (criterion: ScenarioCriteriaModle) => void;
}

export const CustomCriteriaFormModal: React.FC<CustomCriteriaFormModalProps> = ({
  open,
  category,
  templateCriterion,
  newCustomCriterionName,
  categoryOptions,
  criterionAddToType,
  handleClose,
  handleAddCriterion,
  handleAddCustomCriterion,
}) => {
  const initialCriterionValues: { [x: string]: any } = {
    criterionName: newCustomCriterionName,
    tempModifier: "",
    max: "",
    min: "",
    equal: "",
    unit: "",
  };
  const criterionValidateSchema = yup.object().shape(({
    criterionName: yup.string().required("Criterion name is required"),
    min: yup.number() || null,
    max: yup.number() || null,
    equal: yup.number() || null,
  }));
  const criterionFormike = useFormik({
    initialValues: initialCriterionValues,
    validationSchema: criterionValidateSchema,
    validate: (values) => {
      const errors: any = {};
      if (isNumber(values.min) && isNumber(values.max) && values.min > values.max) {
        errors.range = "min must less than max!"
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(criterionFormike.values);
      const {
        id,
        criterionName,
        tempModifier,
        max,
        min,
        equal,
        unit,
        criterionCategory : selectedCriterionCategoryId,
      } = values;
      if (id) {
        const criterion: ScenarioCriteriaModle = {
          id,
          scenarioId: "",
          min: min === "" ? null : min,
          max: max === "" ? null : max,
          equal: equal === "" ? null : equal,
          unit,
          type: category?.type || "",
          tempModifier,
          criteriaCategoryId: category?.id || "",
          userDefinedCriteriaName: criterionName,
        }
        handleAddCriterion(criterion, category?.type || "");
        criterionFormike.resetForm();
      } else {
        const criterion: ScenarioCriteriaModle = {
          scenarioId: "",
          min: min === "" ? null : min,
          max: max === "" ? null : max,
          equal: equal === "" ? null : equal,
          unit,
          type: category?.type || criterionAddToType || "",
          tempModifier,
          criteriaCategoryId: category?.id || selectedCriterionCategoryId,
          userDefinedCriteriaName: criterionName,
        }
        handleAddCustomCriterion(criterion);
        criterionFormike.resetForm();
      }
    },
  });
  useEffect(() => {
    if (newCustomCriterionName) {
      criterionFormike.setFieldValue("criterionName", newCustomCriterionName);
    } else if (templateCriterion) {
      criterionFormike.setFieldValue("criterionName", templateCriterion.name);
      criterionFormike.setFieldValue("id", templateCriterion.id);
      criterionFormike.setFieldValue("tempModifier", templateCriterion.tempModifier || "");
      criterionFormike.setFieldValue("max", templateCriterion.max || "");
      criterionFormike.setFieldValue("min", templateCriterion.min || "");
      criterionFormike.setFieldValue("equal", templateCriterion.equal || "");
      criterionFormike.setFieldValue("unit", templateCriterion.unit || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCustomCriterionName, templateCriterion]);

  const renderNewCriteriaForm = (criterion?: any, customName?: string) => {
    return <Grid container>
      <Grid item xs={5}>
        {!category && categoryOptions && (
          <FormControlCriterion>
            <FormLabel component="legend">
              <FieldTitle>Criterion Category</FieldTitle>
            </FormLabel>
            <Select
              variant="outlined"
              id="criterionCategory"
              name="criterionCategory"
              value={criterionFormike.values.criterionCategory}
              onChange={criterionFormike.handleChange}
              error={
                criterionFormike.touched.criterionCategory &&
                Boolean(criterionFormike.errors.criterionCategory)
              }
            >
              {categoryOptions.map((category: CriteriaCategoryModel) => (
                <option value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControlCriterion>
        )}
        <FormControlCriterion>
          <FormLabel component="legend">
            <FieldTitle>Criterion name</FieldTitle>
          </FormLabel>
          <Input
            variant="outlined"
            id="criterionName"
            name="criterionName"
            value={criterionFormike.values.criterionName}
            onChange={criterionFormike.handleChange}
            error={
              criterionFormike.touched.criterionName &&
              Boolean(criterionFormike.errors.criterionName)
            }
            helperText={
              criterionFormike.touched.criterionName &&
              criterionFormike.errors.criterionName
            }
          />
        </FormControlCriterion>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <FieldTitle>Qualifier (e.g. temporal)</FieldTitle>
          </FormLabel>
          <Input
            variant="outlined"
            id="tempModifier"
            name="tempModifier"
            value={criterionFormike.values.tempModifier}
            onChange={criterionFormike.handleChange}
            error={
              criterionFormike.touched.tempModifier &&
              Boolean(criterionFormike.errors.tempModifier)
            }
            helperText={
              criterionFormike.touched.tempModifier &&
              criterionFormike.errors.tempModifier
            }
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2}>

          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <FieldTitle>{`Min (>= )`}</FieldTitle>
              </FormLabel>
              <NumberInput
                variant="outlined"
                id="min"
                name="min"
                type="Number"
                value={criterionFormike.values.min}
                onChange={criterionFormike.handleChange}
                error={
                  criterionFormike.touched.min &&
                  Boolean(criterionFormike.errors.min)
                }
                helperText={
                  criterionFormike.touched.min &&
                  criterionFormike.errors.min
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <FieldTitle>{`Max (<= )`}</FieldTitle>
              </FormLabel>
              <NumberInput
                variant="outlined"
                id="max"
                name="max"
                type="Number"
                value={criterionFormike.values.max}
                onChange={criterionFormike.handleChange}
                error={
                  criterionFormike.touched.max &&
                  Boolean(criterionFormike.errors.max)
                }
                helperText={
                  criterionFormike.touched.max &&
                  criterionFormike.errors.max
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <FieldTitle>{`Equal (=)`}</FieldTitle>
              </FormLabel>
              <NumberInput
                variant="outlined"
                id="euqal"
                name="equal"
                type="Number"
                value={criterionFormike.values.equal}
                onChange={criterionFormike.handleChange}
                error={
                  criterionFormike.touched.equal &&
                  Boolean(criterionFormike.errors.equal)
                }
                helperText={
                  criterionFormike.touched.equal &&
                  criterionFormike.errors.equal
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <FieldTitle>Range</FieldTitle>
              </FormLabel>
              <RangeContainer>
                <NumberInput
                  variant="outlined"
                  id="range-min"
                  name="min"
                  value={criterionFormike.values.min}
                  type="Number"
                  onChange={criterionFormike.handleChange}
                />
                -
                <NumberInput
                  variant="outlined"
                  id="range-max"
                  name="max"
                  type="Number"
                  value={criterionFormike.values.max}
                  onChange={criterionFormike.handleChange}
                />
              </RangeContainer>
              {
                Boolean(criterionFormike.errors.range) && (
                  <RangeErrorText>
                    {
                      criterionFormike.errors.range
                    }
                  </RangeErrorText>
                )
              }
            </FormControl>

          </Grid>

        </Grid>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <FieldTitle>Unit</FieldTitle>
          </FormLabel>
          <Input
            variant="outlined"
            id="unit"
            name="unit"
            value={criterionFormike.values.unit}
            onChange={criterionFormike.handleChange}
          />
        </FormControl>
      </Grid>
      <ButtonContainer>
        <AddBtn onClick={() => { criterionFormike.handleSubmit() }}>Add</AddBtn>
      </ButtonContainer>
    </Grid>;
  };
  return <Modal
    open={open}
    onClose={() => {
      handleClose();
      criterionFormike.resetForm();
    }}
  >
    <CriteriaBoxContainerModal>
      <CriteriaDataContainer>
        <HeadingModal>
          {category?.name || ""}
          <CloseIcon
            tabIndex={0}
            onClick={() => {
              handleClose();
              criterionFormike.resetForm();

            }}
            onKeyPress={() => {
              handleClose();
              criterionFormike.resetForm();

            }}
          />
        </HeadingModal>
        <ModalContentWraper>
          {/* {renderTemplateCriteriaForm()} */}
          {renderNewCriteriaForm()}
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
const RangeContainer = styled("div")({
  display: "flex",
});
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
const RangeErrorText = styled("label")({
  fontSize: "10px",
  color: "red",
})
