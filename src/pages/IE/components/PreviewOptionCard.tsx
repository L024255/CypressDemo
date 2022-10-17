import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  styled,
  Grid,
  Collapse,
  IconButton,
  Typography,
  TextField,
  Link,
  // Checkbox as MuiCheckbox,
  Switch,
} from "@material-ui/core";
import { Popover } from "antd";
import { ExpandMore, FiberManualRecord, Edit, CheckRounded, ClearRounded } from "@material-ui/icons";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import SummaryCard from "./SummaryCard";
import "antd/dist/antd.css";

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

export interface PreviewOptionCardProps {
  title: string;
  author: string;
  selected?: boolean;
  exportNotes?: string;
  showExportNotes?: boolean;
  description?: string;
  criteriaData?: {
    title: string;
    values: any[];
    columnHeaders?: any;
  }[];
  indicatorData?: {
    title: string;
    value: any;
  }[];
  handleCheck: (val: boolean) => void;
  handleChangeExportNotes?: (value: string) => void;
}

const OptionCard: React.FC<PreviewOptionCardProps> = ({
  title,
  author,
  description,
  selected,
  criteriaData,
  indicatorData,
  exportNotes,
  showExportNotes,
  handleCheck,
  handleChangeExportNotes,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showExportNote, setShowExportNote] = useState(showExportNotes);
  const [notes, setNotes] = useState(exportNotes);
  const classes = useStyles();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleAddExportNote = () => {
    setShowExportNote(true);
  };
  const renderAddOptionExportNote = () => {
    if (showExportNote) {
      return (
        <>
          <NoteFieldTitle>Optional export note:</NoteFieldTitle>
          <ExportNoteInput
            value={notes}
            variant="outlined"
            multiline
            placeholder="Write notes here"
            onChange={(e) => {setNotes(e.target.value)}}
          />
          <IconButton onClick={() => {
            if (notes && handleChangeExportNotes) {
              handleChangeExportNotes(notes);
              setShowExportNote(false);
            }

          }}>
            <CheckRounded />
          </IconButton>
          <IconButton onClick={() => {
            setShowExportNote(false);
          }}><ClearRounded /></IconButton>
        </>
      );
    }
    return (
      exportNotes ? (
        <NotesContent>
          {exportNotes}
          <IconButton onClick={handleAddExportNote}>
            <Edit style={{ width: "20px", height: "20px"}} />
          </IconButton>
        </NotesContent>
      ) : (
        <AddLink underline="always" onClick={handleAddExportNote}>
          Add optional export note
        </AddLink>
      )
      
    );
  };
  const renderCriteriaGroups = useCallback(() => {
    return criteriaData?.map((critera, index) => (
      <CriteriaContainer key={index}>
        <AttributeTitle>{critera.title}</AttributeTitle>
        {critera.values.length > 0 ? critera.columnHeaders : null}
        {critera.values.map((value: any) => {
          if (typeof value === "string") {
            return <AttributeValue>{value}</AttributeValue>
          } else if (value.hasTip) {
            return <Popover
            content={
              <p style={{ maxWidth: "350px", whiteSpace: "normal" }}>
                Criteria changes across scenarios
              </p>
            }
            placement="bottomLeft"
            >
              <PopoverContent>
                <Dot />
                <AttributeValue>{value.value}</AttributeValue>
              </PopoverContent>
            </Popover>
          } else if (value.value) {
              return <AttributeValue>{value.value}</AttributeValue>
          } else {
            return value;
          }
        })}
      </CriteriaContainer>
    ));
  }, [criteriaData]);
  const renderIndicators = useCallback(() => {
    return indicatorData?.map((indicator, index) => (
      <SummaryCard
        key={index}
        style={{ marginBottom: "21px", paddingTop: '10px' }}
        value={indicator.value}
        description={indicator.title}
      />
    ));
  }, [indicatorData]);
  const renderSwitch = () => {
    return (
      <CheckBoxContainer>
        <StyledSwtich
          color="primary"
          checked={selected}
          onChange={(e) => handleCheck(!selected)}
        />Mark as Final
      </CheckBoxContainer>
    );
  };
  return (
    <OptionContainer style={!selected ? { background: "#FAFAFA" } : {}}>
      <CardContainer>
        <CardHeader
          action={
            <>
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
            </>
          }
          title={
            <HeaderContainer>
              <TitleContainer>
                {renderSwitch()}
                <Title>
                  <TitleText>{title}{selected && <Typography variant="body1">&nbsp; (Final)</Typography>}</TitleText>
                </Title>
                <Author variant="body1">{author}</Author>
              </TitleContainer>
            </HeaderContainer>
          }
        />
        <CardCollapse in={expanded}>
          <CardContentContainer>
            <Container container>
              <Left item xs={8}>
                {description && (
                  <DescriptionContainer>
                    <Description>{description}</Description>
                  </DescriptionContainer>
                )}
                {selected && renderAddOptionExportNote()}
                {renderCriteriaGroups()}
              </Left>
              <Right item xs={4}>
                {renderIndicators()}
              </Right>
            </Container>
          </CardContentContainer>
        </CardCollapse>
      </CardContainer>
    </OptionContainer>
  );
};
const CardContainer = styled(Card)({
  marginBottom: "2rem",
  width: "100%",
  boxShadow: "none",
  background: "transparent",
  maxWidth: "65rem",
  margin: "auto",
});
const CardContentContainer = styled(CardContent)({
  padding: "0 !important",
});
const CardCollapse = styled(Collapse)({
  "&& .MuiCardContent-root:last-child": {
    paddingTop: 0,
  },
});
const Container = styled(Grid)({});
const HeaderContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});
const Title = styled(Grid)({
  display: "flex",
  alignItems: "center",
});
const TitleText = styled(Grid)({
  display: "flex",
  fontSize: "1.125rem",
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "1.625rem",
});
const TitleContainer = styled(Grid)({
  paddingLeft: "0.75rem",
});
const Author = styled(Typography)({
  color: "#A59D95",
  fontSize: "0.75rem",
  fontFamily: "Helvetica",
  lineHeight: "1.375rem",
  letterSpacing: 0,
});
const Left = styled(Grid)({
  paddingBottom: "8.625rem",
  paddingLeft: "2.063rem",
});
const DescriptionContainer = styled(Grid)({
  marginBottom: "2.5rem",
  fontSize: "0.875rem",
});
const Description = styled(Typography)({
  fontSize: "0.875rem",
  lineHeight: "1.375",
});
const Right = styled(Grid)({
  padding: "2.313rem",
  paddingTop: 0,
  paddingRight: "1.625rem",
  position: "relative",
});
const ExportNoteInput = styled(TextField)({
  minWidth: "530px",
  minHeight: "80px",
  borderRadius: "4px",
  border: "1px solid #D5D2CA",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-multiline": {
    background: "transparent",
  },
  "& textarea::placeholder": {
    fontSize: "12px",
    color: "#82786F",
    lineHeight: "16px",
  },
});
const CheckBoxContainer = styled(Grid)({
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  fontSize: "1rem",
});
const NoteFieldTitle = styled(Typography)({
  fontSize: "0.75rem",
  color: "#2D2D2D",
  lineHeight: "26px",
});
const CriteriaContainer = styled(Grid)({
  marginTop: "13px",
});
const AttributeTitle = styled(Typography)({
  textTransform: "uppercase",
  fontSize: "12px",
  color: "#A59D95",
  lineHeight: "22px",
});
const AttributeValue = styled(Typography)({
  fontSize: "1rem",
  color: "#000000",
  lineHeight: "24px",
});
const AddLink = styled(Link)({
  cursor: "pointer",
  fontSize: "12px",
  color: "#2D2D2D",
  lineHeight: "26px",
});
const OptionContainer = styled(Grid)({});
// const Checkbox = styled(MuiCheckbox)({
//   "&&.MuiCheckbox-colorSecondary.Mui-checked": {
//     color: "#00AF3F",
//     width: "12px",
//     height: "12px",
//     padding: 0,
//   },
//   "&&.MuiCheckbox-root.MuiCheckbox-root svg": {
//     width: "18px",
//     height: "18px",
//   },
// });
const StyledSwtich = styled(Switch)(({ theme }) => ({
  marginLeft: "-10px",
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#82d182',
        opacity: 1,
      },
    },
  }
}));
// const DisabledCheck = styled("div")({
//   width: "13px",
//   height: "13px",
//   background: "#D5D2CA",
//   borderRadius: "2px",
//   cursor: "pointer",
// });
const Dot = styled(FiberManualRecord)({
  width: "0.625rem",
  height: "0.625rem",
  marginRight: "0.625rem",
  color: "#01A2E5",
});
const PopoverContent = styled(Grid)({
  display: "flex",
  alignItems: "center",
})
const NotesContent = styled(Grid)({
  display: "flex",
  alignItems: "center",
})

export default OptionCard;
