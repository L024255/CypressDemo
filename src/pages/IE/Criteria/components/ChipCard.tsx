import React, { useState, useCallback, useRef, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Grid,
  styled,
  Paper,
  withStyles,
  fade,
  ButtonBase,
  TextField,
} from "@material-ui/core";
import { TreeView, TreeItem, TreeItemProps } from "@material-ui/lab";
import { Clear as ClearIcon, Search as SearchIcon } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { CriteriaModel } from "../../../../@types/Criteria";
import Tooltip from '@material-ui/core/Tooltip';
// import { Close } from "@material-ui/icons";

interface ChipCardProps {
  title: string;
  initialChips: ChipData[];
  criteriaOptions: CriteriaModel[];
  handleAddCriteria?: ( criteria?: CriteriaModel, newCriterionName?: string ) => void;
  handleDeleteCriteria?: (criterionId: string) => void;
  handleDeleteSoA?: (activityId: string) => void;
  search: boolean;
  clearIcon: boolean;
}
export interface ChipData {
  key: any;
  label: string;
  scenarioCriterionId?: string;
  criterionId?: string;
  soaId?: string;
  children?: ChipData[];
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: "center",
      listStyle: "none",
      margin: "0",
      height: "7.5rem",
      width: "100%",
      padding: "10px",
      paddingTop: "0",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);
const searchCriteriaUseStyles = makeStyles((theme) => ({
  root: {
    width: "150px",
  },
}));

const ChipCard: React.FC<ChipCardProps> = ({
  title,
  initialChips = [],
  criteriaOptions = [],
  handleAddCriteria,
  handleDeleteCriteria,
  handleDeleteSoA,
  search,
  clearIcon,
}) => {
  const [chipData, setChipData] = useState<ChipData[]>(initialChips);
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  const searchCriteriaClasses = searchCriteriaUseStyles();
  const autoCompleteRef = useRef<HTMLInputElement>();

  const handleClickAdd = () => {
    setIsEdit(true);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (chipToDelete: ChipData) => {
    if (handleDeleteCriteria && chipToDelete.scenarioCriterionId) {
      handleDeleteCriteria(chipToDelete.scenarioCriterionId);
    } else if (handleDeleteSoA && chipToDelete.soaId) {
      handleDeleteSoA(chipToDelete.soaId);
    }
  };

  // Modal

  // const [criteriaModal, setCriteriaModal] = useState(false);

  // const openCriteriaModal = () => {
  //   setCriteriaModal(true);
  // };

  //////
  const renderChipsByChipData = useCallback(() => {
    const renderChip = (chipNode: any, isChild?: boolean) => {
      const chipUnit = chipNode.unit || "";
      const labelUnit = chipNode.label + " " + chipUnit;
      return (
        <NewItem
          style={{ marginRight: "18px" }}
          className={isChild ? "child" : ""}
        >
          <CriteriaTooltip title={labelUnit} aria-label="add">
            <Content>{labelUnit}</Content>
          </CriteriaTooltip>
          { clearIcon && (
            <ClearIcon
              style={{
                color: "#D52B1E",
                width: "1.2rem",
                marginLeft: "12px",
                cursor: "pointer",
              }}
              onClick={() => handleDelete(chipNode)}
            />
          )}
        </NewItem>
      );
    };
    return (
      <StyledTreeView expanded={chipData.map((chip) => `${chip.key}`)}>
        {chipData.map((chip, index) => (
          <StyledTreeItem
            nodeId={`${chip.key}`}
            label={renderChip(chip)}
            className="parent"
          >
            {chip.children &&
              chip.children.map((subChip) => (
                <ChildTreeItem
                  nodeId={`${subChip.key}`}
                  label={renderChip(subChip, true)}
                ></ChildTreeItem>
              ))}
          </StyledTreeItem>
        ))}
      </StyledTreeView>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chipData]);
  const renderAddForm = () => {
    return (
      <AddNew>
        Search Criteria
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
    const options = criteriaOptions.filter((criterion: CriteriaModel) => {
      return (
        chipData.findIndex(
          (data: ChipData) => data.criterionId === criterion.id
        ) === -1
      );
    });
    return (
      <SearchCriteriaFrom>
        <Autocomplete
          freeSolo
          id="auto-complete"
          getOptionLabel={(option) => option.name}
          options={options}
          renderInput={(params) => (
            <>
              <TextField
                {...params}
                inputMode="text"
                inputRef={autoCompleteRef}
                classes={{ root: searchCriteriaClasses.root }}
              />
              <AddCriteriaButton
                onClick={() => {
                  const addValue = autoCompleteRef?.current?.value;  
                  const addCriteria = criteriaOptions.find(
                    (criteria: CriteriaModel) => criteria.name === addValue
                  );
                  if (handleAddCriteria) {
                    if(addCriteria) {
                      handleAddCriteria(addCriteria);
                    } else if (addValue) {
                      handleAddCriteria(undefined, addValue);
                    }
                    }
                    
                  if (autoCompleteRef && autoCompleteRef.current) {
                    autoCompleteRef.current.value = "";
                  }
                  setIsEdit(false);
                }}
              >
                Add
              </AddCriteriaButton>
            </>
          )}
          onBlur={(e) => {
            setIsEdit(false);
          }}
        />
      </SearchCriteriaFrom>
    );
  };
  useEffect(() => {
    setChipData(initialChips);
  }, [initialChips]);
  return (
    <LeftItem>
      <TitleCard>{title}</TitleCard>
      <Paper component="div" className={classes.root}>
        {renderChipsByChipData()}
      </Paper>
      <div onClick={handleClickAdd}>{isEdit || !search ? "" : renderAddForm()}</div>
      {isEdit ? renderSearchForm() : ""}
    </LeftItem>
  );
};






const CriteriaTooltip = styled(Tooltip)({
  fontSize: "1rem",
});

const SearchCriteriaFrom = styled("div")({
  width: "250px",
  height: "2.75rem",
  borderRadius: "22px",
  border: "1px dashed rgba(130, 120, 111, 0.4)",
  fontSize: "10px",
  color: "#252525",
  lineHeight: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const AddCriteriaButton = styled(ButtonBase)({
  width: "64px",
  height: "30px",
  background: "#F9F9F9",
  borderRadius: "25px",
  border: "1px solid #D52B1E",
});
const LeftItem = styled(Grid)({
  width: "100%",
  padding: "18px",
  background: "#fff",
  marginTop: "24px",
  boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.08);",
  borderRadius: "4px;",
  paddingBottom: "15px",
  "&>.MuiPaper-elevation1": {
    boxShadow: "none",
    flexWrap: "wrap",
    justifyContent: "left",
    padding: 0,
    paddingBottom: "15px",
    height: "unset",
    display: "flex",
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
const AddNew = styled(ButtonBase)({
  width: "10.313rem;",
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
  "&&:focus-visible": {
    outline: "-webkit-focus-ring-color auto 1px !important",
  },
});
const NewItem = styled(Grid)({
  height: "2.75rem;",
  lineHeight: "2.75rem",
  borderRadius: "1.375rem;",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "0.875rem;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  paddingLeft: "16px",
  paddingRight: "16px",
  background: "#EBEAE7",
  marginTop: "12px",
  "&.child": {
    background: "#D5D2CB",
  },
});
const TitleCard = styled(Grid)({
  fontSize: "0.625rem",
  color: "#000000;",
  letterSpacing: "1px;",
  webkitBackgroundClip: "text;",
  webkitTextFillColor: "transparent;",
});
const Content = styled(Grid)({
  overflow: "hidden;",
  textOverflow: "ellipsis;",
  whiteSpace: "nowrap",
  maxWidth: "10.338rem",
  display: "inline-block",
});
const StyledTreeView = styled(TreeView)({
  minHeight: "20px",
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
});
const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    group: {
      borderLeft: `1px solid ${fade(theme.palette.text.primary, 0.4)}`,
    },
    root: {
      background: "none !important",
      "& .MuiTreeItem-content .MuiTreeItem-label": {
        background: "none !important",
      },
      "& .MuiTreeItem-label": {
        padding: 0,
      },
      "&.parent > .MuiTreeItem-content": {
        marginLeft: "0",
        "& > .MuiTreeItem-iconContainer": { width: 0 },
      },
    },
  })
)((props: TreeItemProps) => <TreeItem {...props} />);
const ChildTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      borderBottom: `1px solid ${fade(theme.palette.text.primary, 0.4)}`,
    },
  })
)((props: TreeItemProps) => <TreeItem {...props} />);

export default ChipCard;
