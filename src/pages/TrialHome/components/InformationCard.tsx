import React, { useEffect, useState } from "react";
import {
  Collapse,
  CardContent,
  Typography,
  styled,
  Grid,
  Card,
  IconButton,
  CardHeader,
  TextField,
  Chip,
  Link,
  FormControl,
  FormLabel,
  Button,
  MenuItem,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ExpandMore, Close } from "@material-ui/icons";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import clsx from "clsx";
import * as yup from "yup";
import { useFormik } from "formik";
import SearchTool from "../../NewTrial/components/SearchTool";
import Select from "../../../components/CustomSelect";
import InputMask from "react-input-mask";
import { useJwtInfo } from "../../../hooks/JwtInfo";
import { reject, sortBy } from "lodash";
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

interface AttrubutesProps {
  id: string;
  name: string;
  inputValue?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  })
);

export enum Mode {
  Normal,
  Small,
}

interface InforamtionCardProps {
  title: string;
  description?: string;
  readonly?: boolean;
  mode?: Mode;
  author?: string;
  hideExpand?: boolean;
  therapeuticArea?: string;
  indication?: string;
  indications?: { id: string; name: string }[];
  studyType?: string;
  studyPhase?: string;
  trialTitle?: string;
  trialAlias?: string;
  pediatricStudy?: string;
  molecule?: string;
  duration?: number;
  collaborators?: any[];
  users?: any[];
  phaseOptions?: { id: string; name: string }[];
  studyTypeOptions?: { id: string; name: string }[];
  indicationOptions?: { id: string; name: string }[];
  therapeuticAreasOptions?: { id: string; name: string }[];
  // moleculeOptions?: { id: string; name: string; inputValue: string }[];
  moleculeOptions?: { id: string; name: string }[];
  dataVersion?: string;
  handleRefresh?: () => void;
  handleSubmit?: (e: any) => void;
  handleError?: (e: string) => void;
}

const InformationCard: React.FC<InforamtionCardProps> = ({
  title,
  readonly,
  mode,
  description,
  author,
  hideExpand,
  therapeuticArea,
  indication,
  indications,
  studyType,
  studyPhase,
  trialTitle,
  trialAlias,
  duration,
  pediatricStudy,
  molecule,
  phaseOptions,
  studyTypeOptions,
  indicationOptions,
  therapeuticAreasOptions,
  moleculeOptions,
  collaborators,
  users,
  dataVersion,
  handleSubmit,
  handleError,
  handleRefresh,
}) => {
  const getNameById = (options: any[] | undefined, id: any) => {
    const obj = options?.find((option: any) => option.id === id);
    return obj?.name || "";
  };
  const attributes = [
    {
      title: "THERAPEUTIC AREA",
      value:
        therapeuticArea === ""
          ? therapeuticArea
          : getNameById(therapeuticAreasOptions, therapeuticArea),
    },
    {
      title: "INDICATION",
      value:
        indication === ""
          ? indication
          : getNameById(indications, indication),
    },
    {
      title: "STUDY PHASE",
      value:
        studyPhase === "" ? studyPhase : getNameById(phaseOptions, studyPhase),
    },
    {
      title: "STUDY TYPE",
      value:
        studyType === "" ? studyType : getNameById(studyTypeOptions, studyType),
    },
    {
      title: "TRIAL ALIAS",
      value: trialAlias,
    },
    {
      title: "PEDIATRIC STUDY",
      value: pediatricStudy,
    },
    {
      title: "MOLECULE",
      value:
        molecule === "" || molecule === null || molecule === undefined ? "" : getNameById(moleculeOptions, molecule),
    },
    {
      title: "DURATION",
      value: (duration === null || duration === undefined) ? duration : `${duration} Months`
    }
  ];
  const initialEditForm = {
    trialTitle,
    collaborators:
      collaborators?.map((collaborator: any) => collaborator.id) || [],
    trialDescription: description,
    therapeuticArea,
    indication: indication ? [indication] : [],
    studyPhase,
    studyType,
    duration,
    trialAlias,
    pediatricStudy,
    molecule,
  };
  const editWorkspaceSchema = yup.object().shape({
    trialTitle: yup
      .string()
      .required("Trial Titile is required.")
      .max(80, "The max length of title is 80."),
    trialAlias: yup
      .string()
      .required("Trial Alias is required")
      .matches(
        /([a-zA-Z0-9]{3})+-([a-zA-Z0-9]{2})+-([a-zA-Z0-9]{4})/gm,
        "Trial Alias Format Should be XXX-XX-XXXX"
      ),
    therapeuticArea: yup
      .string()
      .required("Therapeutic Area is required"),
    indication: yup.array()
      .required("Indication are required")
      .length(1, "Indication are required"),
    trialDescription: yup
      .string()
      .max(250, "You've entered more than 250 characters"
      ),
    duration: yup.number()
      .typeError('Duration must be a number')
      .min(1, 'Duration must be greater than 0')
  });
  const workspaceFormike = useFormik({
    initialValues: initialEditForm,
    validationSchema: editWorkspaceSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit && handleSubmit(values);
    },
  });
  const { jwtInfo } = useJwtInfo();
  const collaboratorOptions: any = users || [];

  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isClickSubmit, setIsClickSubmit] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const getCollaboratorsByIdArr = (idArr: string[]) => {
    const result: any[] = [];
    idArr.forEach((id: string) => {
      const index = collaboratorOptions.findIndex(
        (user: any) => user.id === id
      );
      if (index > -1) {
        result.push(collaboratorOptions[index]);
      }
    });
    return result;
  };
  const handleEditClick = (e: any) => {
    if (isEdit && handleRefresh) {
      handleRefresh();
    }
    setIsEdit(!isEdit);
  };
  const renderDetailAttributes = (mode?: Mode) => {
    return (
      <>
        <Attributs container>
          {attributes.map((attribute: any, index) => {
            return (
              <AttributeItem
                key={index}
                mode={mode}
                title={attribute.title}
                value={attribute.value ? attribute.value : "-"}
              />
            );
          })}
        </Attributs>
        <DataVersion>Data version {dataVersion}</DataVersion>
      </>
    );
  };
  useEffect(() => {
    const workspaceFormErrors = Object.values(workspaceFormike.errors);
    const workspaceFormTouched = Object.values(workspaceFormike.touched);
    if (workspaceFormErrors.length > 0 && workspaceFormTouched.length > 0 && isClickSubmit) {
      handleError && handleError(
        "This page has detected errors. Please resolve all errors before submitting."
      );
      setIsClickSubmit(false);
    }
  }, [workspaceFormike.touched, workspaceFormike.errors, isClickSubmit, handleError]);

  const filter = createFilterOptions<AttrubutesProps>();
  const renderCloseButton = (optionName: string) => {
    if (optionName !== jwtInfo?.preferred_username) {
      return <Close style={{ color: "#D52B1E", opacity: 0.87 }} />
    }
    return <></>;
  }
  const renderDetailForm = () => {
    return (
      <SubmitForm
        id="edit-workspace-form"
        onSubmit={workspaceFormike.handleSubmit}>
        <ContentBox>
          <FormRow>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>TRIAL TITLE*</FieldTitle>
              </FormLabel>
              <Input
                error={Boolean(workspaceFormike.errors.trialTitle && workspaceFormike.touched.trialTitle)}
                helperText={workspaceFormike.errors.trialTitle}
                variant="outlined"
                id="trialTitle"
                name="trialTitle"
                label=""
                value={workspaceFormike.values.trialTitle}
                onChange={workspaceFormike.handleChange}
              />
            </FormControl>
          </FormRow>
          <FormRow>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>COLLABORATORS</FieldTitle>
              </FormLabel>
              <Autocomplete
                multiple
                id="name"
                options={reject(sortBy(users, o => o.name), function (o) {
                  return o.username === jwtInfo?.preferred_username
                }) || []}
                style={{ height: "44px" }}
                getOptionLabel={(option: any) => option.name}
                value={getCollaboratorsByIdArr(
                  workspaceFormike.values.collaborators
                )}
                onChange={(event, value, reason) => {
                  const values = value.map((option) => option.id);
                  workspaceFormike.setFieldValue("collaborators", values);
                }}
                freeSolo
                renderTags={(value: any[], getTagProps) => {
                  return value.map((option: any, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option.name || ""}
                      {...getTagProps({ index })}
                      style={{
                        backgroundColor: "rgb(213, 210, 202, 0.38)",
                        border: "none",
                        fontSize: "0.875rem",
                        lineHeight: "1.375rem",
                        color: "#000",
                      }}
                      deleteIcon={
                        renderCloseButton(option.username)
                        //   <Close style={{ color: "#D52B1E", opacity: 0.87 }} />
                        // }

                      }
                    />
                  ));
                }}
                renderInput={(params) => (
                  <Input
                    {...params}
                    variant="outlined"
                    id="collaborators"
                    name="collaborators"
                    label=""
                  />
                )}
              />
            </FormControl>
          </FormRow>
          <FormRow>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>TRIAL NOTES/DESCRIPTION</FieldTitle>
              </FormLabel>
              <Input
                multiline
                variant="outlined"
                id="trialDescription"
                name="trialDescription"
                label=""
                error={Boolean(workspaceFormike.errors.trialDescription && workspaceFormike.touched.trialDescription)}
                helperText={workspaceFormike.errors.trialDescription}
                value={workspaceFormike.values.trialDescription}
                onChange={workspaceFormike.handleChange}
              />
            </FormControl>
          </FormRow>
          <FormRow container spacing={3}>
            <Grid item xs={4}>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>THERAPEUTIC AREA</FieldTitle>
                </FormLabel>
                <FormSelect
                  id="therapeuticArea"
                  variant="outlined"
                  labelId="new-trial-detail-therapeutic-area"
                  disableunderline="true"
                  value={workspaceFormike.values.therapeuticArea}
                  onChange={workspaceFormike.handleChange}
                  error={
                    workspaceFormike.touched.therapeuticArea &&
                    Boolean(workspaceFormike.errors.therapeuticArea)
                  }
                  helperText={
                    workspaceFormike.touched.therapeuticArea &&
                    workspaceFormike.errors.therapeuticArea
                  }
                >
                  <MenuItem key="option" value="">Select one option</MenuItem>
                  {therapeuticAreasOptions?.map((therapeuticArea, index) => (
                    <MenuItem
                      key={`therapeuticArea-${index}`} 
                      value={therapeuticArea?.id}>
                      {therapeuticArea?.name}
                    </MenuItem>
                  ))}
                </FormSelect>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <SearchTool
                tagSearchBarId="indication"
                tagSearchBarOptions={
                  indicationOptions?.map((indication) => indication.name) || []
                }
                fieldTitle="INDICATION*"
                searchValue={workspaceFormike.values.indication.map(
                  (value: any) =>
                    indications?.find(
                      (indication) => indication.id === value
                    )?.name || value
                )}
                error={
                  workspaceFormike.touched.indication &&
                  Boolean(workspaceFormike.errors.indication)
                }
                helperText={workspaceFormike.touched.indication ? workspaceFormike.errors.indication?.toString() : ""}
                onChange={(event, value, reason) => {
                  const result =
                    value?.map((v) => {
                      const obj = indicationOptions?.find(
                        (indication) =>
                          value.length > 0 && indication.name === v
                      );
                      return obj?.id || value.length > 0 && v;
                    }) || [];
                  workspaceFormike.setFieldValue("indication", result);
                }}
                onBlur={(event: any) => {
                  let value = event.target?.value
                  value && workspaceFormike.setFieldValue("indication", [...workspaceFormike.values.indication, value]);
                }}
              />
            </Grid>
          </FormRow>
          <FormRow container spacing={3}>
            <Grid item xs={4}>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>STUDY PHASE</FieldTitle>
                </FormLabel>
                <FormSelect
                  id="studyPhase"
                  name="studyPhase"
                  variant="outlined"
                  labelId="new-trial-detail-study-phase"
                  disableunderline="true"
                  value={workspaceFormike.values.studyPhase}
                  onChange={workspaceFormike.handleChange}
                >
                  {phaseOptions?.map((phase, index) => (
                    <MenuItem key={`study-phase-${index}`} value={phase.id}>{phase.name}</MenuItem>
                  ))}
                </FormSelect>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>STUDY TYPE</FieldTitle>
                </FormLabel>
                <FormSelect
                  id="studyType"
                  name="studyType"
                  variant="outlined"
                  labelId="new-trial-detail-study-type"
                  disableunderline="true"
                  value={workspaceFormike.values.studyType}
                  onChange={workspaceFormike.handleChange}
                >
                  {studyTypeOptions?.map((option, index) => (
                    <MenuItem key={`study-type-${index}`} value={option.id}>{option.name}</MenuItem>
                  ))}
                </FormSelect>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>TRIAL ALIAS*</FieldTitle>
                </FormLabel>
                <InputMask
                  mask="***-**-****"
                  value={workspaceFormike.values.trialAlias?.toUpperCase()}
                  onChange={workspaceFormike.handleChange}
                  onBlur={() => { }}
                  disabled={false}
                >
                  {() => (
                    <Input
                      variant="outlined"
                      id="trialAlias"
                      name="trialAlias"
                      error={
                        workspaceFormike.touched.trialAlias &&
                        Boolean(workspaceFormike.errors.trialAlias)
                      }
                      helperText={
                        workspaceFormike.touched.trialAlias &&
                        workspaceFormike.errors.trialAlias
                      }
                      label=""
                    />
                  )}
                </InputMask>

              </FormControl>
            </Grid>
          </FormRow>
          <FormRow container spacing={3}>
            <Grid item xs={4}>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>PEDIATRIC STUDY</FieldTitle>
                </FormLabel>
                <FormSelect
                  id="pediatricStudy"
                  name="pediatricStudy"
                  variant="outlined"
                  labelId="new-trial-detail-pediatric-study"
                  disableunderline="true"
                  value={workspaceFormike.values.pediatricStudy}
                  onChange={workspaceFormike.handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </FormSelect>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>DURATION</FieldTitle>
                </FormLabel>
                <Input
                  id="duration"
                  name="duration"
                  variant="outlined"
                  value={workspaceFormike.values.duration}
                  onChange={workspaceFormike.handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Month(s)</InputAdornment>,
                  }}
                  error={
                    Boolean(workspaceFormike.errors.duration && workspaceFormike.touched.duration)
                  }
                  helperText={
                    workspaceFormike.errors.duration
                  }
                />

              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>MOLECULE</FieldTitle>
                </FormLabel>
                <MoleculeList
                  id="molecule"
                  freeSolo
                  value={workspaceFormike.values.molecule}
                  options={moleculeOptions || []}
                  getOptionLabel={(molecule: any) => {
                    // Value selected with enter, right from the input
                    const index = moleculeOptions ? moleculeOptions.findIndex((mole: any) => mole.id === molecule) : -1;
                    if (typeof molecule === 'string') {
                      if (moleculeOptions && index > -1) {
                        return moleculeOptions[index]?.name || "";
                      }
                      return molecule;
                    }
                    // Add "xxx" option created dynamically
                    if (molecule.inputValue) {
                      return molecule.inputValue;
                    }
                    // Regular option
                    return molecule.name;
                  }}

                  renderOption={(molecule: any) => {
                    //display value in Popper elements
                    return <span>{molecule.name}</span>;
                  }}

                  onChange={(event: any, newValue: any) => {
                    if (newValue !== null) {
                      if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        workspaceFormike.setFieldValue("molecule", newValue.inputValue);
                        workspaceFormike.setFieldValue("moleculeName", newValue.inputValue);
                      } else {
                        workspaceFormike.setFieldValue("molecule", newValue.id);
                      }
                    } else {
                      // when user hits the X to erase a value
                      workspaceFormike.setFieldValue("molecule", "");
                    }
                  }}
                  filterOptions={(options: any, params: any) => {
                    const filtered = filter(options, params);
                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                      filtered.push({
                        inputValue: params.inputValue,
                        name: `Add "${params.inputValue}"`,
                        id: params.inputValue,
                      });
                    }
                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label=""
                      margin="normal"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </FormRow>
          <CreateButton
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => {
              setIsClickSubmit(true);
            }}
          >
            Submit
          </CreateButton>
        </ContentBox>
      </SubmitForm>
    );
  };
  const renderDescription = () => {
    return (
      <DescriptionContainer>
        <Description variant="body1">{description}</Description>
      </DescriptionContainer>
    );
  };
  const renderAuthor = () => {
    return <Author variant="body1">{author}</Author>;
  };
  const renderLinkButton = (isEdit: boolean) => {
    if (isEdit) {
      return (
        <Link underline="always" href="#" onClick={handleEditClick}>
          Done
        </Link>
      );
    }
    return (
      <Link underline="always" href="#" onClick={handleEditClick}>
        Edit
      </Link>
    );
  };
  return (
    <CardContainer>
      <CardHeader
        action={
          <>
            {!readonly && renderLinkButton(isEdit)}
            {!hideExpand && (
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMore />
              </IconButton>
            )}
          </>
        }
        title={
          <>
            <TitleContainer>
              <Title gutterBottom>{title}</Title>
              {author && renderAuthor()}
            </TitleContainer>
          </>
        }
      />
      <CardCollapse in={expanded}>
        <CardWrapper>
          {description && renderDescription()}
          {isEdit ? renderDetailForm() : renderDetailAttributes(mode)}
        </CardWrapper>
      </CardCollapse>
    </CardContainer>
  );
};

const MoleculeList = styled(Autocomplete)({
  "& .MuiFormControl-marginNormal": {
    marginTop: "0",
    marginBottom: "0",
    "& .MuiAutocomplete-input": {
      fontSize: "0.8rem",
    }
  },
});

const CardContainer = styled(Card)({
  width: "100%",
  paddingTop: "1rem",
});
const CardWrapper = styled(CardContent)({
  padding: "28px",
});
const CardCollapse = styled(Collapse)({
  "&& .MuiCardContent-root:last-child": {
    paddingTop: 0,
  },
});
const TitleContainer = styled(Grid)({
  paddingLeft: "0.75rem",
});
const Title = styled(Typography)({
  color: "#2D2D2D",
  fontWeight: 500,
  fontSize: "1.25rem",
  marginBottom: "0.5rem",
});
const DescriptionContainer = styled(Grid)({
  marginBottom: "2.5rem",
  fontSize: "0.875rem",
});
const Description = styled(Typography)({
  fontSize: "0.875rem",
  lineHeight: "1.375",
});
const Attributs = styled(Grid)({});
const AttributeTitle = styled(Typography)({
  display: "block",
  fontSize: "0.625rem",
  lineHeight: "1rem",
  letterSpacing: "0.094rem",
  color: "#666",
});
const AttributeValue = styled(Typography)({
  display: "block",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  letterSpacing: 0,
  color: "#2D2D2D",
});
interface AttributeItemProps {
  title: String;
  value: String;
  mode?: Mode;
}
const AttributeItem: React.FC<AttributeItemProps> = ({
  title,
  value,
  mode,
}) => {
  return (
    <AttributeContainer item xs={mode === Mode.Small ? 6 : 3}>
      <AttributeTitle variant="caption">{title}</AttributeTitle>
      <AttributeValue variant="caption">{value}</AttributeValue>
    </AttributeContainer>
  );
};

const AttributeContainer = styled(Grid)({
  marginBottom: "2rem",
});

const SubmitForm = styled("form")({
  marginTop: "2.5rem",
  width: "54.438rem",
});
const ContentBox = styled(Grid)({
  "& .MuiStep-horizontal": {
    padding: 0,
  },
  "& .MuiStepLabel-root": {
    minWidth: "6.875rem",
    "&.step-0 .MuiStepLabel-labelContainer": {
      marginLeft: "30%",
    },
  },
});
const FormRow = styled(Grid)({
  marginTop: "2.5rem",
  '&& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
    padding: "3px",
  },
});
const FieldTitle = styled(Typography)({
  color: "#82786F",
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.094rem",
  textTransform: "uppercase",
  paddingBottom: "1.125rem",
});

const Input = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& > label": {
    fontStyle: "italic",
  },
  "& > .MuiInput-underline:before": {
    borderColor: "white !important",
  },
}));
const FormSelect = styled(Select)({
  width: "100%",
  "& > label": {
    fontStyle: "italic",
  },
  "& > .MuiInput-underline:before": {
    borderColor: "white !important",
  },
});
const Author = styled(Typography)({
  color: "#A59D95",
  fontSize: "0.75rem",
  fontFamily: "Helvetica",
  lineHeight: "1.375rem",
  letterSpacing: 0,
});
const CreateButton = styled(Button)(({ theme }) => ({
  borderRadius: "3rem",
  margin: "auto",
  left: 0,
  right: 0,
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  lineHeight: "1.313rem",
  letterSpacing: "normal",
  color: "#FFF",
  width: "20.5rem",
  height: "3.938rem",
  position: "fixed",
  bottom: "1.688rem",
  zIndex: 9999,
}));
const DataVersion = styled(Grid)({
  fontSize: "0.625rem",
  letterSpacing: "0.094rem",
  lineHeight: "1rem",
  color: "#666",
  textTransform: "uppercase",
});
export default InformationCard;
