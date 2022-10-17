import React, { useCallback, useState } from "react";
import {
  Collapse,
  Typography,
  styled,
  Grid,
  Card,
  IconButton as MuiIconButton,
  CardHeader,
  Slider,
  withStyles,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ExpandMore, Visibility } from "@material-ui/icons";
import clsx from "clsx";
import { InfoOutlined } from "@material-ui/icons";
import { Popover } from "antd";
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

export enum Mode {
  Normal,
  Small,
}

interface InforamtionCardProps {
  title: any;
  description?: string;
  readonly?: boolean;
  mode?: Mode;
  author?: string;
  tooltips?: string;
  tableColumns?: string[];
  tableData?: [string[]];
  contentTitle: string;
  contents: string;
  historicalMarks?: [{ value: any; label: string }];
  sliderValue: any;
  sliderDisplayValue?: string;
}
const FairCard: React.FC<InforamtionCardProps> = ({
  title,
  readonly,
  mode,
  description,
  author,
  tooltips,
  tableColumns,
  tableData,
  contentTitle,
  contents,
  historicalMarks,
  sliderValue,
  sliderDisplayValue,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  // const [isEdit, setIsEdit] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // const handleEditClick = () => {
  //   setIsEdit(!isEdit);
  // };
  const renderAuthor = () => {
    return <Author variant="body1">{author}</Author>;
  };

  const getDisplayText = useCallback(() => {
    return sliderDisplayValue ? sliderDisplayValue : sliderValue;
  }, [sliderDisplayValue, sliderValue]);
  const CollapseRow: React.FC<{ row: string[]; index: any }> = ({ row, index }) => {
    const [openCollapse, setOpenCollapse] = useState(false);
    let changeLogs: any = [];
    return (
      <>
        <CustomTableRow key={index} className="normal">
          {row &&
            row.map((column) => {
              let display: any = column;
              if (typeof column === "object") {
                changeLogs = column;
                display = (
                  <IconButton onClick={() => setOpenCollapse(!openCollapse)}>
                    <Visibility style={openCollapse ? {} : { color: "#B4B4B3" }} />
                  </IconButton>
                );
              }
              return (
                <TableCell scope="row">
                  {display}
                </TableCell>
              )
            })}
        </CustomTableRow>
        <CustomTableRow key={`${index}-collapse`}>
          <TableCell colSpan={6} style={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <Collapse in={openCollapse}>
              <TableContainer style={{ maxHeight: 300 }}>
                <Table style={{ width: "100%", padding: 0 }} stickyHeader>
                  <TableHead>
                    <CustomTableRow
                      style={{
                        background: "#fff",
                        color: "rgba(0, 0, 0, 0.6)",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        borderBottom: "1px solid",
                      }}
                    >
                      <TableCell>
                        TEXT BEFORE
                      </TableCell>
                      <TableCell>
                        TEXT AFTER
                      </TableCell>
                    </CustomTableRow>
                  </TableHead>
                  <CustomTableBody>
                    {
                      changeLogs?.map((changeLog: any, index: any) => (
                        <CustomTableRow style={(index % 2 === 0) ? {
                          fontSize: "10px",
                          background: "#fff",
                        } : { fontSize: "10px", backgroundColor: "rgb(248,248,249)" }}>
                          <TableCell style={{ height: "60px" }} scope="row">
                            <div>
                              {
                                changeLog?.textBefore.toString().split(" ").map((word: any, index: number) => {
                                  if (
                                    Object.keys(changeLog?.beforeIndex).findIndex((key: any) => key.toString() === (index).toString()) > -1
                                  ) {
                                    return <><DeleteWord>{word}</DeleteWord>{" "}</>;
                                  }
                                  return word + " ";
                                })
                              }
                            </div>
                          </TableCell>
                          <TableCell style={{ height: "60px" }} scope="row">
                            <div>
                              {
                                changeLog?.textAfter.toString().split(" ").map((word: any, index: number) => {
                                  if (
                                    Object.keys(changeLog?.afterIndex).findIndex((key: any) => key.toString() === (index).toString()) > -1
                                  ) {
                                    return <><AddedWord>{word}</AddedWord>{" "}</>;
                                  }
                                  return word + " ";
                                })
                              }
                            </div>
                          </TableCell>
                        </CustomTableRow>
                      ))
                    }
                  </CustomTableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </TableCell>
        </CustomTableRow>
      </>
    );
  };
  return (
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
          <>
            <TitleContainer>
              {tooltips ? (
                <Popover
                  content={
                    <p style={{ maxWidth: "350px", whiteSpace: "normal" }}>
                      {tooltips}
                    </p>
                  }
                  placement="bottomLeft"
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <Title gutterBottom>
                        <InfoIcon /> {title}
                      </Title>
                    </Grid>
                    <Grid item xs={8}>
                      {contentTitle && (
                        <MiddleTitle>{contentTitle}</MiddleTitle>
                      )}
                    </Grid>
                  </Grid>
                </Popover>
              ) : (
                <Grid>
                  <Title gutterBottom>{title}</Title>
                  {contentTitle && <MiddleTitle>{contentTitle}</MiddleTitle>}
                </Grid>
              )}
              {author && renderAuthor()}
            </TitleContainer>
          </>
        }
      />
      <ScrollContent>
        <CardCollapse in>
          <Grid container>
            <Grid item xs={4}>
              <PrettoSlider
                disabled
                valueLabelDisplay="on"
                aria-label="disabled-slider"
                marks={historicalMarks}
                defaultValue={sliderValue}
                value={sliderValue}
                valueLabelFormat={getDisplayText}
              />
            </Grid>
            <Grid item xs={8}>
              <ItemMiddleRight>
                <ContentBottom>{contents}</ContentBottom>
              </ItemMiddleRight>
            </Grid>
          </Grid>
        </CardCollapse>
        <CardCollapse in={expanded} style={{ padding: 0 }}>
          <ItemMiddleRight style={{ width: "100%", padding: 0 }}>
            <Table style={{ width: "100%", padding: 0 }}>
              <TableHead>
                <CustomTableRow
                  style={{
                    background: "rgba(213, 210, 202, 1)",
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                  }}
                >
                  {tableColumns?.map((column, index) => (
                    <TableCell style={{ fontWeight: "bolder" }}>{column}</TableCell>
                  ))}
                </CustomTableRow>
              </TableHead>
              <CustomTableBody>
                {tableData?.map((row: string[], index) => (
                  <CollapseRow row={row} index={index} />
                ))}
              </CustomTableBody>
            </Table>
          </ItemMiddleRight>
        </CardCollapse>
      </ScrollContent>
    </CardContainer>
  );
};

const ScrollContent = styled(Card)({
  overflowY: "auto",
  maxHeight: "37.375rem",
  boxShadow: "none;",
  "&::-webkit-scrollbar": {
    background: "rgba(213, 210, 202, 0.25);",
    width: "8px;",
    height: "17.69rem;",
    borderRadius: "5px;",
  },
  "&::-webkit-scrollbar-thumb": {
    width: "8px",
    height: "2.89rem",
    background: "#D52B1E;",
    borderRadius: "5px;",
  },
});
const CardCollapse = styled(Collapse)({
  display: "flex",
  padding: "0 22px 0 26px",
  justifyContent: "space-between",
  "&& .MuiCardContent-root:last-child": {
    paddingTop: 0,
  },
  "&>.MuiCollapse-wrapper": {
    width: "100%",
    position: "relative",
  },
  "&>.MuiCollapse-wrapper .MuiCollapse-wrapperInner": {
    display: "flex",
    marginBottom: "18px",
  },
});
const CardContainer = styled(Card)({
  width: "100%",
  paddingTop: "18px",
  marginTop: "2.19rem",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);",
  paddingRight: "10px",
  position: "relative",
  "&> .MuiCardHeader-root": {
    alignItems: "upset",
    paddingLeft: "1.375rem",
    paddingBottom: "6px",
    "&> .MuiCardHeader-action": {
      fontSize: "0.75rem",
      marginTop: "-25px",
      marginRight: "-24px;",
      "&> .MuiIconButton-root": {
        color: "#D52B1E",
      },
    },
  },
});

const PrettoSlider = withStyles({
  root: {
    color: "#FAB8B3!important",
    height: 8,
    width: "80%",
    marginTop: "2.19rem",
    marginLeft: "1.75rem;",
    "&>.MuiSlider-thumb": {
      width: "1rem;",
      height: "1rem;",
      marginTop: "-6px;",
    },
    "& .MuiSlider-mark": {
      width: "12px",
      height: "12px",
      background: "#D3D3CA",
      boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.1)",
      border: "0px solid #D5D2CA",
      borderRadius: "12px",
      top: "9px",
    },
    "& .MuiSlider-markLabel": {
      width: "107px",
      fontSize: "10px",
      color: "#82786F",
      lineHeight: "14px",
      letterSpacing: "1px",
      whiteSpace: "normal",
      marginTop: "6px",
    },
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
    "& >.MuiSlider-valueLabel": {
      left: "calc(-50% - 13px);",
      color: "#fff",
      zIndex: "0",
      "&> span span": {
        color: "#000",
        fontSize: "26px;",
        marginTop: "20px;",
      },
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 4,
    borderRadius: 4,
    backgroundColor: "inherit!important",
  },
  rail: {
    height: 4,
    borderRadius: 4,
    background:
      "linear-gradient(63deg, #C7F3D0 0%, #C7F3CF 25%, #FDE996 56%, #FAC4AC 82%, #FAB8B3 100%)",
  },
})(Slider);
const ItemMiddleRight = styled(Grid)({
  paddingTop: 0,
  position: "relative",
  width: "90%",
});
const MiddleTitle = styled(Grid)({
  fontSize: "10px",
  color: "#82786F",
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginLeft: "30px",
});
const ContentBottom = styled(Grid)({
  // width: "459px;",
  fontSize: "16px;",
  fontFamily: "Helvetica;",
  color: "#2D2D2D;",
  lineHeight: "24px;",
  marginLeft: "12px",
});
const TitleContainer = styled(Grid)({});
const Title = styled(Typography)({
  fontSize: "10px",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
});
const InfoIcon = styled(InfoOutlined)({
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.6)",
  marginRight: "10px",
});
const IconButton = styled(MuiIconButton)({
  "&&:focus-visible": {
    outline: "-webkit-focus-ring-color auto 1px !important",
  },
});
const Author = styled(Typography)({
  color: "#A59D95",
  fontSize: "0.75rem",
  fontFamily: "Helvetica",
  lineHeight: "1.375rem",
  letterSpacing: 0,
});
const CustomTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "rgba(213, 210, 202, 0.2)",
      "&.normal:nth-of-type(n+3)": {
        background: "#FCFCFA",
      },
      "&.last-color:last-child": {
        background: "rgba(213, 43, 30, 0.1)",
      },
      border: "none",
      "&& .MuiTableCell-body": {
        fontSize: "0.875rem",
        color: "#000",
        lineHeight: "1.625rem",
        border: "none !important",
        paddingTop: "4px",
        paddingBottom: "4px",
        paddingLeft: "26px",
      },
      "&& .MuiTableCell-head": {
        color: "rgba(0, 0, 0, 0.6)",
        fontSize: "11px",
        border: "none !important",
        textTransform: "uppercase",
        paddingLeft: "25px",
      },
    },
  })
)(TableRow);
const CustomTableBody = withStyles((theme: Theme) =>
  createStyles({
    root: {
      border: "none",
    },
  })
)(TableBody);
const DeleteWord = styled("span")({
  color: "#D52B1E"
});
const AddedWord = styled("span")({
  color: "#00AF3F"
});
export default FairCard;
