import React from "react";
import {
  FormControl,
  FormLabel,
  styled,
  Grid,
  Typography,
  Chip,
  TextField,
} from "@material-ui/core";
import { SearchOutlined, Close } from "@material-ui/icons";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from "@material-ui/lab";

interface SearchToolProps {
  tagSearchBarId: string;
  tagSearchBarOptions: any[];
  searchResultAttributes?: any;
  fieldTitle: string;
  error?: boolean;
  helperText?: string;
  searchValue?: any;
  onChange?:
    | ((
        event: React.ChangeEvent<{}>,
        value: any[],
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<any> | undefined
      ) => void)
    | undefined;
  onBlur?: any
}
const SearchTool: React.FC<SearchToolProps> = ({
  tagSearchBarId,
  tagSearchBarOptions,
  searchResultAttributes,
  fieldTitle,
  searchValue,
  onChange,
  onBlur,
  error,
  helperText,
}) => {
  return (
    <>
      <FormControl component="fieldset" style={{ width: "100%" }}>
        <FormLabel component="legend">
          <FieldTitle>{fieldTitle}</FieldTitle>
        </FormLabel>
        <TagSearchBar
          id={tagSearchBarId}
          options={tagSearchBarOptions}
          value={searchValue}
          error={error}
          helperText={helperText}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormControl>
      {searchResultAttributes && (
        <SearchResult>
          <Attributs container>
            {Object.values(searchResultAttributes).map((attribute: any) => {
              return (
                <AttributeItem
                  title={attribute.title}
                  value={attribute.value || "-"}
                />
              );
            })}
          </Attributs>
        </SearchResult>
      )}
    </>
  );
};

const SearchResult = styled("div")({
  backgroundColor: "#fff",
  marginTop: "2.125rem",
  border: "0.063rem solid #ddd",
  padding: "2rem",
  paddingBottom: 0,
  display: "flex",
  borderRadius: "4px",
});
const Attributs = styled(Grid)({});
const AttributeTitle = styled(Typography)({
  display: "block",
  fontSize: "0.625rem",
  lineHeight: "1rem",
  letterSpacing: "0.094rem",
  color: "#666",
});
interface AttributeItemProps {
  title: String;
  value: String;
}
interface TagSearchBarProps {
  options: any[];
  id: string;
  value?: any;
  error?: boolean;
  helperText?: string;
  onChange?:
    | ((
        event: React.ChangeEvent<{}>,
        value: any[],
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<any> | undefined
      ) => void)
    | undefined;
  onBlur?: any
}
const TagSearchBar: React.FC<TagSearchBarProps> = ({
  options,
  id,
  value,
  error,
  helperText,
  onChange,
  onBlur,
}) => {
  return (
    <Autocomplete
      multiple
      id={id}
      options={options}
      getOptionLabel={(option: any) => option}
      disableClearable
      freeSolo
      renderTags={(value: string[], getTagProps) =>
        value?.map((option: string, index: number) => (
          <Chip
            key={index}
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
            deleteIcon={<Close style={{ color: "#D52B1E", opacity: 0.87 }} />}
          />
        ))
      }
      renderInput={(params) => (
        <>
          <Input
            {...params}
            variant="outlined"
            id="trilNickName"
            name="trilNickName"
            label=""
            error={error}
            helperText={helperText}
          />
          <SearchOutlined
            style={{
              position: "absolute",
              right: "16px",
              top: "12px",
              color: "rgba(0,0,0,0.38)",
            }}
          />
        </>
      )}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
const AttributeItem: React.FC<AttributeItemProps> = ({ title, value }) => {
  return (
    <AttributeContainer item xs={3}>
      <AttributeTitle variant="caption">{title}</AttributeTitle>
      <AttributeValue variant="caption">{value}</AttributeValue>
    </AttributeContainer>
  );
};
const AttributeContainer = styled(Grid)({
  marginBottom: "2rem",
});
const AttributeValue = styled(Typography)({
  display: "block",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  letterSpacing: "normal",
  color: "#000",
  fontWeight: 500,
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
  "& .MuiFormHelperText-contained": {
    marginLeft: 0,
  },
  "& > label": {
    fontStyle: "italic",
  },
  "& > .MuiInput-underline:before": {
    borderColor: "white !important",
  },
}));
export default SearchTool;
