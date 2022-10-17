import React, { useState } from "react";
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
  MenuItem,
  Select,
  Slider,
  withStyles,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ExpandMore, Close } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import clsx from "clsx";
// import SearchTool from "../../../NewTrial/components/SearchTool";
import CircleProgressBar from "../../../../components/CustomCircleProgressBar/CircleProgressBar";

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
}
interface Props {
  children: React.ReactElement;
  open: boolean;
  value: number;
}
const ValueLabelComponent = ({ children, open, value }: Props) => {
  return (
    <SliderBarTip
      open={open}
      title={value}
      placement="top"
      style={{ color: "#222" }}
    >
      {children}
    </SliderBarTip>
  );
};

// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         webkitScrollbarTrack: {
//             boxShadow : 'inset 0 0 5px rgba(0, 0, 0, 0.2);',
//             background :' #ededed;',
//             borderRadius: '10px;',
//         },
//     }),
// );
const RightCard: React.FC<InforamtionCardProps> = ({
  title,
  readonly,
  mode,
  description,
  author,
}) => {
  const indications: any = ["Diabetes"];
  const collaborators: any = ["Alex Keans", "Tracy Klein"];
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };
  const renderAuthor = () => {
    return <Author variant="body1">{author}</Author>;
  };
  return (
    <CardContainer>
      <CardHeader
        action={
          <>
            {!readonly && (
              <Link underline="always" href="#" onClick={handleEditClick}>
                {expanded ? "Done" : "View"}
              </Link>
            )}
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
          <>
            <TitleContainer>
              <Title gutterBottom>{title}</Title>
              {author && renderAuthor()}
            </TitleContainer>
          </>
        }
      />
      <CardCollapse in={expanded}>
        <ProgressSlider
          disabled
          defaultValue={21}
          valueLabelDisplay="on"
          valueLabelFormat={(value: number) => {
            return `${value}%`;
          }}
          ValueLabelComponent={ValueLabelComponent}
        />
        <ItemMiddleRight>
          <ContentBottom>
            Your score is calculated using predictive models driven by
            historical data. Right now, your score of 'Fair' demonstrates
            disproportionate influence exerted by your Screening Failure and
            Patient Burden predicted metrics. Consider revising or analyzing
            these selections accordingly to change your composite score.
          </ContentBottom>
        </ItemMiddleRight>
      </CardCollapse>
    </CardContainer>
  );
};
const CardContainer = styled(Card)({
  width: "851px",
  marginLeft: "3.813rem",
  marginTop: "35px",
  "&> .MuiCardHeader-root": {
    alignItems: "upset",
    paddingLeft: "22px",
    paddingBottom: "6px",
    "&> .MuiCardHeader-action": {
      fontSize: "0.75rem",
      marginTop: "-18px",
      "&> .MuiIconButton-root": {
        color: "#D52B1E",
      },
    },
  },
});
const CardWrapper = styled(CardContent)({
  padding: "28px",
});
const CardCollapse = styled(Collapse)({
  display: "flex",
  padding: "0 22px 0 26px",
  justifyContent: "space-between",
  "&& .MuiCardContent-root:last-child": {
    paddingTop: 0,
  },
  "&>.MuiCollapse-wrapper .MuiCollapse-wrapperInner": {
    display: "flex",
    justifyContent: "space-between",
    width: "800px",
    marginBottom: "38px",
  },
});
const ProgressSlider = styled(Slider)({
  marginTop: "30px",
  width: "283px",
  marginRight: "20px",
  "&& .MuiSlider-rail": {
    background:
      "linear-gradient(63deg, #FAB8B3 0%, #FAC4AC 25%, #FDE996 56%, #C7F3CF 82%, #C7F3D0 100%)",
    borderRadius: "5px",
    opacity: 0.69,
  },
  "&& .MuiSlider-track": {
    background: "transparent",
  },
  "&& .MuiSlider-thumb": {
    width: "0.75rem",
    height: "0.75rem",
    marginTop: "-0.313rem",
    background: "#FFFFFF",
    boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.1)",
    border: "0px solid #D5D2CA",
  },
});
const ItemMiddleLeft = styled(Grid)({});
const ItemMiddleRight = styled(Grid)({
  width: "506px;",
  paddingTop: 0,
});
const CardItem = styled(Grid)({});
const SliderBarTip = withStyles({
  tooltip: {
    backgroundColor: "transparent",
    color: "#2D2D2D",
    fontSize: "1.125rem",
    lineHeight: "1.375rem",
    position: "relative",
    top: "0.625rem",
  },
})(Tooltip);
const ContentTop = styled(Grid)({
  width: "506px;",
  height: "28px;",
  fontSize: "24px;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  marginBottom: "10px",
});
const ContentBottom = styled(Grid)({});
const TitleContainer = styled(Grid)({
  // paddingLeft: '0.75rem'
});
const Title = styled(Typography)({
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
});
const TitleTop = styled(Typography)({
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
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
export default RightCard;
