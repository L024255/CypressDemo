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
// import { TrailWorkspaceDetail } from "../../../@types/TrailWorkspace";
import { TrialWorkspaceInputType } from "../../../hooks/useCreateWorkspace";
import { debounce } from "lodash";
// import SearchTool from "../../NewTrial/components/SearchTool";

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

interface InforamtionCardProps {
  title: string;
  description?: string;
  readonly?: boolean;
  mode?: Mode;
  subtitle?: any;
  showEditUI?: boolean;
  trialWorkspace?: any;
  users?: any[];
  updateTrial?: (trial: TrialWorkspaceInputType) => void;
}
const InformationCard: React.FC<InforamtionCardProps> = ({
  title,
  readonly,
  mode,
  description,
  subtitle,
  showEditUI = false,
  trialWorkspace,
  users = [],
  updateTrial,
}) => {
  const initialAttributes = [
    {
      title: "THERAPEUTIC AREA",
      value: "Endocrinology",
    },
    {
      title: "INDICATION",
      value: "1 Indication",
    },
    {
      title: "STUDY PHASE",
      value: "Phase 1A",
    },
    {
      title: "STUDY TYPE",
      value: "Interventional",
    },
    {
      title: "LY NUMBER",
      value: "LY10236",
    },
    {
      title: "TRIAL TITLE",
      value: "Comparison Two Basal...",
    },
    {
      title: "PEDIATRIC STUDY",
      value: "Yes",
    },
    {
      title: "MOLECULE",
      value: "Kevinsamab",
    },
  ];
  // const collaborators: any = ["Alex Keans", "Tracy Klein"];
  // const classes = useStyles();
  const [
    expanded,
    // setExpanded
  ] = useState(true);
  const [isEdit, setIsEdit] = useState(showEditUI);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [attributes, setAttrubutes] = useState(initialAttributes);
  const [trialDescription, setTrialDescription] = useState("")
  
  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };
  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };
  const handleChangeDescription = (newValue: string, trialId: string) => {
    setTrialDescription(newValue);
    const inputObj: TrialWorkspaceInputType = {
      input: {
        id: trialId,
        userTrial: {
          trialDescription: newValue
        }
      }
    }
    const handleUpdateTrial = updateTrial ? debounce(updateTrial, 3000) : () => {};
    handleUpdateTrial(inputObj);
  }
  const handleChangeCollaborators = (value: any, trialId: string) => {
    const users = value.map((user: any) => user.id);
    const inputObj: TrialWorkspaceInputType = {
      input: {
        id: trialId,
        users,
      }
    };
    updateTrial && updateTrial(inputObj);
  }
  useEffect(() => {
    if (trialWorkspace) {
      // const ownerId = trialWorkspace.ownerId;
      const users = trialWorkspace.users?.map((user: any) => {
        return {
          id: user.id,
          name: user?.name.split(" -")[0] || ""
        };
      }) || [];
      const newAttributes = [
        {
          title: "THERAPEUTIC AREA",
          value: trialWorkspace.userTrial.therapeuticArea.name,
        },
        {
          title: "INDICATION",
          value: trialWorkspace.userTrial.indication.name,
        },
        {
          title: "STUDY PHASE",
          value: trialWorkspace.userTrial.phase.name,
        },
        {
          title: "STUDY TYPE",
          value: trialWorkspace.userTrial.studyType.name,
        },
        {
          title: "TRIAL ALIAS",
          value: trialWorkspace.userTrial.trialAlias,
        },
        {
          title: "PEDIATRIC STUDY",
          value: trialWorkspace.userTrial.pediatricStudy,
        },
        {
          title: "MOLECULE",
          value:trialWorkspace.userTrial?.molecule?.name,
        },
      ];
      setCollaborators(users);
      setAttrubutes(newAttributes);
      setTrialDescription(trialWorkspace.userTrial.trialDescription || "");
    }
  }, [trialWorkspace]);
  const renderDetailAttributes = (mode?: Mode) => {
    return (
      <Attributs container>
        {attributes.map((attribute: any) => {
          return (
            <AttributeItem
              mode={mode}
              title={attribute.title}
              value={attribute.value || "-"}
            />
          );
        })}
      </Attributs>
    );
  };
  const renderDetailForm = () => {
    return (
      <SubmitForm>
        <ContentBox>
          <FormRow>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>COLLABORATORS</FieldTitle>
              </FormLabel>
              <Autocomplete
                multiple
                id="name"
                options={users}
                style={{ height: "44px" }}
                getOptionLabel={(option: any) => option.name}
                freeSolo
                value={collaborators}
                onChange={(e, value, reason) => {
                  handleChangeCollaborators(value, trialWorkspace.id);
                }}
                renderTags={(value: any[], getTagProps) =>
                  value.map((option: any, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option?.name || ""}
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
          <FormRow>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>TRIAL NOTES/DESCRIPTION</FieldTitle>
              </FormLabel>
              <Input
                variant="outlined"
                id="trialNotes"
                name="trialNotes"
                label=""
                value={trialDescription}
                onChange={(e) => handleChangeDescription(e.target.value, trialWorkspace.id)}
                multiline
              />
            </FormControl>
          </FormRow>
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
    return <SubTitle variant="body1">{subtitle}</SubTitle>;
  };
  return (
    <CardContainer>
      <CardHeader
        action={
          <>
            {!readonly && (
              <EditLink underline="always" href="#" onClick={handleEditClick}>
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
              {subtitle && renderAuthor()}
            </TitleContainer>
          </>
        }
      />
      <CardCollapse in={expanded}>
        <CardWrapper>
          {description && renderDescription()}
          {isEdit && renderDetailForm()}
          {renderDetailAttributes(mode)}
        </CardWrapper>
      </CardCollapse>
    </CardContainer>
  );
};
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

const EditLink = styled(Link)({
  marginRight: "24px",
  position: "relative",
  top: "15px",
});

const AttributeContainer = styled(Grid)({
  marginBottom: "2rem",
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
const SubTitle = styled(Typography)({
  color: "#A59D95",
  fontSize: "0.75rem",
  fontFamily: "Helvetica",
  lineHeight: "1.375rem",
  letterSpacing: 0,
  display: "flex",
});
export default InformationCard;
