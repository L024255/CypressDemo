import React, { useEffect, useState } from "react";
import {
  Collapse,
  CardContent,
  Typography,
  styled,
  Grid,
  Card,
  // IconButton,
  CardHeader,
  TextField,
  Chip,
  Link,
  FormControl,
  FormLabel,
} from "@material-ui/core";
// import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { 
  // ExpandMore, 
  Close 
} from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
// import clsx from "clsx";
import { CriteriaModel } from "../../../@types/Criteria";

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     expand: {
//       transform: "rotate(0deg)",
//       marginLeft: "auto",
//       transition: theme.transitions.create("transform", {
//         duration: theme.transitions.duration.shortest,
//       }),
//     },
//     expandOpen: {
//       transform: "rotate(180deg)",
//     },
//   })
// );

export enum Mode {
  Normal,
  Small,
}

interface OptionInfoCardProps {
  title: string;
  description?: string;
  readonly?: boolean;
  mode?: Mode;
  subtitle?: any;
  showEditUI?: boolean;
  singleForm?: boolean;
  scenarioCriteria?: any[];
  scenarioSoA?: any[];
  criteriaOptions?: any[];
  handleRemoveCriteria?: (id: string) => void;
  handleAddCriteria?: (criteria: CriteriaModel, type: string) => void;
  handleRemoveSoA?: (activityId: string) => void;
}
const OptionInfoCard: React.FC<OptionInfoCardProps> = ({
  title,
  readonly,
  mode,
  description,
  subtitle,
  scenarioSoA,
  showEditUI = false,
  singleForm = false,
  scenarioCriteria,
  criteriaOptions,
  handleRemoveCriteria,
  handleAddCriteria,
  handleRemoveSoA
}) => {

  // const collaborators: any = ["Alex Keans", "Tracy Klein"];
  // const classes = useStyles();
  const [
    expanded, 
    // setExpanded
  ] = useState(true);
  const [isEdit, setIsEdit] = useState(showEditUI);
  const [inclusionCriteria, setInclutionCriteria] = useState<any[]>([]);
  const [exclusionCriteria, setExclusionCriteria] = useState<any[]>([])
  const getCriteriasByCategory = (categoryId: string) =>
    criteriaOptions?.filter(
      (criteria: CriteriaModel) => criteria.criteriaCategoryId === categoryId
    ) || [];
  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };
  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };
  const formatValueByCriteria = (criterion: CriteriaModel) => {
    let value = criterion.name;
    if (criterion.min && criterion.max) {
      value = `${criterion.name} ${criterion.min}-${criterion.max}`;
    } else if (criterion.min) {
      value = `${criterion.name} ≥ ${criterion.min}`;
    } else if (criterion.max) {
      value = `${criterion.name} ≤ ${criterion.max}`;
    } else if (criterion.equal) {
      value = `${criterion.name} = ${criterion.equal}`;
    }
    return value;
  }
  const initialCriteria = (categories: any[], scenarioCriteria: any[]) => {
    return categories.map((category) => {
      const values = scenarioCriteria
        .filter((obj: any) => obj.criterion?.criteriaCategoryId === category.id)
        .map((obj) => {
          let value = obj.criterion.name;
          if (obj.min && obj.max) {
            value = `${obj.criterion.name} ${obj.min}-${obj.max}`;
          } else if (obj.min) {
            value = `${obj.criterion.name} ≥ ${obj.min}`;
          } else if (obj.max) {
            value = `${obj.criterion.name} ≤ ${obj.max}`;
          } else if (obj.equal) {
            value = `${obj.criterion.name} = ${obj.equal}`;
          }
          return {
            id: obj.id,
            criterionId: obj.criterion.id,
            value,
          }
        });
      return {
        label: category.name,
        values
      };
    });
  }
  useEffect(() => {
    if (scenarioCriteria) {
      const inclusionCategories: any[] = [];
      const scenarioInclusionCriteria = scenarioCriteria.filter((obj: any) => obj.type === "Include");
      scenarioInclusionCriteria.forEach((obj: any) => {
        if (obj.criterion && inclusionCategories.findIndex((category: any) => category.id === obj.criterion.criteriaCategoryId) === -1) {
          inclusionCategories.push({
            id: obj.criterion?.criteriaCategoryId,
            name: obj.criterion?.criteriaCategory.name,
          });
        }
      });
      const exclusionCategories: any[] = [];
      const scenarioExclusionCriteria = scenarioCriteria.filter((obj: any) => obj.type === "Exclude");
      scenarioExclusionCriteria.forEach((obj: any) => {
        if (exclusionCategories.findIndex((category: any) => category.id === obj.criterion.criteriaCategoryId) === -1) {
          exclusionCategories.push({
            id: obj.criterion.criteriaCategoryId,
            name: obj.criterion.criteriaCategory.name,
          });
        }
      });
      const inclusionCriteria = initialCriteria(inclusionCategories, scenarioInclusionCriteria);
      const exclusionCriteira = initialCriteria(exclusionCategories, scenarioExclusionCriteria);
      setInclutionCriteria(inclusionCriteria);
      setExclusionCriteria(exclusionCriteira);
    }
  }, [scenarioCriteria])
  const renderDetailForm = () => {
    return (
      <SubmitForm>
        <ContentBox>
          {inclusionCriteria.sort((category1, category2) => category1.label.localeCompare(category2.label)).map((category, index) => (
            <FormRow>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>{category.label}</FieldTitle>
                </FormLabel>
                <Autocomplete
                  multiple
                  id={`${category.label}-${index}`}
                  options={getCriteriasByCategory(category.id)}
                  style={{ minHeight: "44px" }}
                  getOptionLabel={(option: any) => formatValueByCriteria(option)}
                  freeSolo
                  onChange={(event, value, reason) => {}}
                  value={category.values}
                  renderTags={(value: any[], getTagProps) =>
                    value.map((option: any, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option.value}
                        {...getTagProps({ index })}
                        style={{
                          backgroundColor: "rgb(213, 210, 202, 0.38)",
                          border: "none",
                          fontSize: "0.875rem",
                          lineHeight: "1.375rem",
                          color: "#000",
                        }}
                        deleteIcon={
                          <Close style={{ color: "#D52B1E", opacity: 0.87 }} />
                        }
                        onDelete={() => {
                          handleRemoveCriteria && handleRemoveCriteria(option.id)
                        }}
                      />
                    ))
                  }
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
          ))}
          {!scenarioSoA && <TitleContainer style={{ marginTop: "2.5rem" }}>
            <Title gutterBottom>Exclusion Criteria</Title>
          </TitleContainer>}
          {exclusionCriteria.map((category, index) => (
            <FormRow>
              <FormControl component="fieldset" style={{ width: "100%" }}>
                <FormLabel component="legend">
                  <FieldTitle>{category.label}</FieldTitle>
                </FormLabel>
                <Autocomplete
                  multiple
                  id={`${category.label}-${index}`}
                  options={getCriteriasByCategory(category.id)}
                  style={{ minHeight: "44px" }}
                  getOptionLabel={(option: any) => formatValueByCriteria(option)}
                  freeSolo
                  onChange={(event, value, reason) => {}}
                  value={category.values}
                  renderTags={(value: any[], getTagProps) =>
                    value.map((option: any, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option.value}
                        {...getTagProps({ index })}
                        style={{
                          backgroundColor: "rgb(213, 210, 202, 0.38)",
                          border: "none",
                          fontSize: "0.875rem",
                          lineHeight: "1.375rem",
                          color: "#000",
                        }}
                        deleteIcon={
                          <Close style={{ color: "#D52B1E", opacity: 0.87 }} />
                        }
                        onDelete={() => {
                          handleRemoveCriteria && handleRemoveCriteria(option.id)
                        }}
                      />
                    ))
                  }
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
          ))}
          {
            scenarioSoA && scenarioSoA.length > 0 && (
              <FormRow>
                <FormControl>
                  <Autocomplete
                    multiple
                    id="scenario-soa-autocomplete"
                    options={[]}
                    style={{ minHeight: "44px" }}
                    getOptionLabel={(option: any) => option.name}
                    freeSolo
                    onChange={(event, value, reason) => {}}
                    value={scenarioSoA}
                    renderTags={(value: any[], getTagProps) =>
                      value.map((option: any, index: number) => {
                        let chipName = "";
                        if (option.activity) {
                          chipName = option.activity.name;
                        } else if (option.soaTaxonomy?.name) {
                          chipName = option.soaTaxonomy?.name.split(".").length > 1 ? option.soaTaxonomy?.name.split(".")[1] : option.soaTaxonomy?.name
                        }
                        return (
                          <Chip
                            variant="outlined"
                            label={chipName}
                            {...getTagProps({ index })}
                            style={{
                              backgroundColor: "rgb(213, 210, 202, 0.38)",
                              border: "none",
                              fontSize: "0.875rem",
                              lineHeight: "1.375rem",
                              color: "#000",
                            }}
                            deleteIcon={
                              <Close style={{ color: "#D52B1E", opacity: 0.87 }} />
                            }
                            onDelete={() => {
                              handleRemoveSoA && handleRemoveSoA(option.id)
                            }}
                          />
                        )
                      }
                      )
                    }
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
            )}
        </ContentBox>
      </SubmitForm>
    );
  };
  const renderSingleForm = () => {
    return (
      <SubmitForm>
        <ContentBox>
          <FormRow>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <Autocomplete
                multiple
                id="single-form-input"
                options={[]}
                style={{ minHeight: "44px" }}
                getOptionLabel={(option: any) => option}
                freeSolo
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      style={{
                        backgroundColor: "rgb(213, 210, 202, 0.38)",
                        border: "none",
                        fontSize: "0.875rem",
                        lineHeight: "1.375rem",
                        color: "#000",
                      }}
                      deleteIcon={
                        <Close style={{ color: "#D52B1E", opacity: 0.87 }} />
                      }
                    />
                  ))
                }
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
        </ContentBox>
      </SubmitForm>
    );
  };
  const renderForm = (isSingleForm: boolean) => {
    return isSingleForm ? renderSingleForm() : renderDetailForm();
  };
  return (
    <CardContainer>
      <CardHeader
        action={
          <>
            {!readonly && (
              <EditLink
                underline="always"
                style={{ cursor: "pointer" }}
                onClick={handleEditClick}
              >
                {isEdit ? "Done" : "Edit"}
              </EditLink>
            )}
            {/* <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMore />
            </IconButton> */}
          </>
        }
        title={
          <>
            <TitleContainer>
              <Title gutterBottom>{title}</Title>
            </TitleContainer>
          </>
        }
      />
      <CardCollapse in={expanded}>
        <CardWrapper>{isEdit && renderForm(singleForm)}</CardWrapper>
      </CardCollapse>
    </CardContainer>
  );
};

const EditLink = styled(Link)({
  marginRight: "24px",
  position: "relative",
  top: "15px",
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

const SubmitForm = styled("form")({
  marginTop: "2.5rem",
  marginBottom: "2.5rem",
  maxWidth: "54.438rem",
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
// const FormSelect = styled(Select)({
//   width: "100%",
//   "& > label": {
//     fontStyle: "italic",
//   },
//   "& > .MuiInput-underline:before": {
//     borderColor: "white !important",
//   },
// });
// const SubTitle = styled(Typography)({
//   color: "#A59D95",
//   fontSize: "0.75rem",
//   fontFamily: "Helvetica",
//   lineHeight: "1.375rem",
//   letterSpacing: 0,
//   display: "flex",
// });
export default OptionInfoCard;
