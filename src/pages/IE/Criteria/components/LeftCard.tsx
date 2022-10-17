import { Grid, styled } from "@material-ui/core";
import React, { FC, useState } from "react";
import Paper from "@material-ui/core/Paper";
import ClearIcon from "@material-ui/icons/Clear";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import SearchTool from "../../../NewTrial/components/SearchTool";
export interface HeroProps {
  chipData: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: "center",
      listStyle: "none",
      margin: "0",
      height: "7.5rem",
      padding: "10px",
      paddingTop: "0",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

const LeftCard: FC<HeroProps> = () => {
  interface ChipData {
    key: number;
    label: string;
  }
  const [chipData, setChipData] = React.useState<ChipData[]>([
    { key: 0, label: "Male or " },
    { key: 1, label: "Ages 25 - 85" },
    { key: 2, label: "Ages 25 - 852" },
  ]);
  const classes = useStyles();
  let trialNickNames: any = ["EOC-TE-LGRF", "H9H-MC-WGKA", "H6Q-MC-S062"];
  const [isEdit1, setIsEdit1] = useState(false);
  const handleDisplay1 = (key: any) => {
    let arr = chipData.filter((item) => {
      return item.key !== key;
    });
    setChipData(arr);
  };
  const handleClick1 = () => {
    setIsEdit1(!isEdit1);
  };
  const handleChangeTabValue = (value: any) => {
    Array.from(value).map((item: any, index: any) => ({
      label: item,
      key: index,
    }));
    let lengthChipData = chipData.length;
    let show = chipData.concat(
      Array.from(value).map((item: any, index: any) => ({
        key: index + lengthChipData,
        label: item,
      }))
    );
    // setIsEdit1(false)
  };
  const renderAddForm = () => {
    return (
      <AddNew>
        Add New
        <SearchIcon
          style={{
            color: "rgba(0, 0, 0, 0.38)",
            width: "1.2rem",
            marginLeft: "15px",
          }}
        />
      </AddNew>
    );
  };
  const renderSearchForm = () => {
    return (
      <SearchTool
        fieldTitle=""
        tagSearchBarId="trialNickName"
        tagSearchBarOptions={trialNickNames}
        // changeTabValue={(value: number) => handleChangeTabValue(value)}
      />
    );
  };
  return (
    <LeftItem>
      <TitleCard>Demographics</TitleCard>
      <Paper component="ul" className={classes.root}>
        {chipData.map((chip) => (
          <div>
            {
              <NewItem style={{ marginRight: "16px" }}>
                <Content>{chip.label}</Content>
                <ClearIcon
                  onClick={() => handleDisplay1(chip.key)}
                  style={{
                    color: "#D52B1E",
                    width: "1.2rem",
                    marginLeft: "14px",
                    marginRight: "14px",
                    cursor: "pointer",
                    marginTop: "-8px",
                  }}
                />
              </NewItem>
            }
          </div>
        ))}
        `
      </Paper>
      <div onClick={handleClick1}>{isEdit1 ? "" : renderAddForm()}</div>
      {isEdit1 ? renderSearchForm() : ""}
    </LeftItem>
  );
};

const LeftStuff = styled(Grid)({
  float: "left",
  width: "28.75rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#F1F1F1",
});
const LeftText = styled(Grid)({
  fontSize: "24px",
  color: "#000000",
  marginTop: "6.313rem",
  paddingBottom: "25px",
  borderBottom: "1px solid #979797",
  width: "21.625rem",
});
const TitleCard = styled(Grid)({
  fontSize: "0.625rem",
  color: "#000000;",
  letterSpacing: "1px;",
  webkitBackgroundClip: "text;",
  webkitTextFillColor: "transparent;",
  textTransform: "uppercase",
});
const LeftTitle = styled(Grid)({
  fontSize: "24px",
  color: "#000000",
  marginTop: "2.313rem",
  paddingBottom: "25px",
  borderBottom: "1px solid #979797",
  width: "21.625rem",
});
const LeftItem = styled(Grid)({
  width: "21.625rem",
  padding: "18px",
  background: "#fff",
  marginTop: "24px",
  boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.08);",
  borderRadius: "4px;",
  paddingBottom: "15px",
  "&>.MuiPaper-elevation1": {
    boxShadow: "none;",
    flexWrap: "nowrap",
    justifyContent: "left",
    paddingLeft: 0,
    paddingBottom: "15px",
    height: "unset",
    "&>div .MuiGrid-root": {
      float: "left",
      marginBottom: "15px",
      paddingTop: "8px",
    },
    "&>li .MuiChip-root": {
      background: "#EBEAE7",
      height: "44px;",
      borderRadius: "22px;",
      margin: 0,
      frontSize: "14px!important",
      marginRight: "18px",
      "&>.MuiChip-label": {
        overflow: "hidden;",
        "&>.MuiChip-label": {
          overflow: "hidden;",
          textOverflow: "ellipsis;",
          whiteSpace: "nowrap",
          width: "6.938rem",
          // whiteSpace:'nowrap;'
        },
      },
    },
  },
});
const AddNew = styled(Grid)({
  width: "7.313rem;",
  height: "2.75rem;",
  borderRadius: "22px;",
  border: "1px dashed #9E9E9E",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.875rem;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  clear: "both",
  marginTop: "56px",
});
const NewItem = styled(Grid)({
  height: "2.75rem;",
  lineHeight: "2.75rem",
  borderRadius: "1.375rem;",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.875rem;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  paddingLeft: "16px",
  background: "#EBEAE7",
  // maxWidth: '9.75rem;',
  maxWidth: "8.35rem",
  marginTop: "12px",
});
const Content = styled(Grid)({
  overflow: "hidden;",
  textOverflow: "ellipsis;",
  whiteSpace: "nowrap",
  maxWidth: "6.338rem",
  display: "inline-block",
});

export default LeftCard;
