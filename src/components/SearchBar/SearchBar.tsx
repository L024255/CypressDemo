import React, { useState } from "react";
import {
  styled,
  Button,
  Typography,
  // Chip,
  makeStyles,
  TextField,
  Grid,
} from "@material-ui/core";
import { Search as MUISearchIcon } from "@material-ui/icons";
// import { Cancel } from "@material-ui/icons";
import { 
  Autocomplete, 
  // AutocompleteChangeReason 
} from "@material-ui/lab";

type SearchBarProps = {
  value?: string;
  size?: "small" | "large";
  iconPosition?: "start" | "end";
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onSearch: (searchValue?: any) => void;
};

const searchBarUseStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& .MuiAutocomplete-root": {
      display: "flex",
    },
    backgroundColor: "#F7F7F7",
    // width: "100% !important",
    border: "none !important",
    "& .MuiInput-underline:before": {
      border: "none",
    },
    "& & .MuiInput-underline:after": {
      border: "none",
    },
    "& & .Mui-focused": {
      border: "none",
    },
    "&::placeholder": {
      color: "#000000 !important",
      fontSize: "1rem",
      letterSpacing: 0,
      lineHeight: "1.5rem",
    },
    "&&:focus": {
      outline: "none",
    },
    "&&.Mui-focused": {
      border: `1px solid ${theme.palette.primary.main}`,
      "&& svg": {
        color: theme.palette.primary.main,
      },
    },
    "&.small": {
      padding: "4px 10px 4px 22px",
      fontSize: "0.875rem",
    },
    "&.large": {
      backgroundColor: "transparent",
      border: `1px solid ${theme.palette.grey[200]}`,
      margin: "20px 10px",
      fontSize: "1rem",
      paddingRight: "20px",
    },
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  size = "small",
  iconPosition = "end",
  placeholder,
  autoFocus = false,
  className,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const handleSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };
  const handleSearch = (searchValues: any) => {
    onSearch(searchValues);
  };
  const searchBarClasses = searchBarUseStyles();
  return (
    <SearchContainer>
      <SearchTitle>I'm Looking For</SearchTitle>
      <Autocomplete
        // multiple
        id="homepage-searchbar"
        options={[]}
        getOptionLabel={(option: any) => option}
        disableClearable
        freeSolo
        onChange={(e, value, reason) => handleSearch(value)}
        renderInput={(params) => (
          <InputContainer>
            <TextField
              {...params}
              classes={{ root: searchBarClasses.root }}
              variant="standard"
              className={`${className} ${size}`}
              placeholder={searchValue.length > 0 ? "" : placeholder}
              inputMode="text"
              onChange={handleSearchValue}
            />
            <SearchIconAdornment onSearch={() => handleSearch(searchValue)} />
          </InputContainer>
        )}
      />
    </SearchContainer>
  );
};

const SearchIconAdornment: React.FC<{
  onSearch?: (searchString?: string) => void;
  value?: string;
}> = ({ onSearch, value }) => (
  <SearchButton
    variant="contained"
    color="primary"
    onClick={() => !!onSearch && onSearch(value)}>
    Search
  </SearchButton>
);

const InputContainer = styled(Grid)({ display: "flex", alignItems: "center" });
const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  height: "80px",
  maxWidth: "1115px",
  width: "100%",
  backgroundColor: "#FFF",
  color: "inherit",
  borderRadius: "30px",
  border: `1px solid #D1D1D1`,
  padding: "10px 15px 10px 22px",
}));

const SearchTitle = styled(Typography)({
  textTransform: "uppercase",
  color: "#666666",
  fontSize: "10px",
  letterSpacing: "1px",
  lineHeight: "16px",
  position: "absolute",
  left: "32px",
  top: "10px",
  zIndex: 999,
});

const SearchButton = styled(Button)({
  height: "38px",
  width: "145px",
  borderRadius: "25px",
  backgroundColor: "#D52B1E",
  color: "#FFFFFF",
  fontSize: "1rem",
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "21px",
});

export const SearchIcon = styled(MUISearchIcon)(({ theme }) => ({
  fontSize: "1.5rem",
  lineHeight: "1.5rem",
  marginRight: ".1rem",
  color: "rgb(102, 102, 102, 0.5)",
  "&:hover": {
    cursor: "pointer",
  },
}));

export default SearchBar;
