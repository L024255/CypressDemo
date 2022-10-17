import React, { useState } from "react";
import { Popover, Button } from "antd";
import "antd/dist/antd.css";
import { Grid, styled, TextField } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

interface VisitsPopoverFormProps {
  id: any;
  label: any;
  defaultValue: any,
  className: any,
  emptyValue: any,
  handleSubmit: (value: any) => Promise<any>;
  handleError: (error: string) => void;
}

const VisitsPopoverForm: React.FC<VisitsPopoverFormProps> = ({
  id,
  label,
  defaultValue,
  className,
  emptyValue,
  handleError,
  handleSubmit
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [helperText, setHelperText] = useState("");
  return (
    <Popover
      key={`${id}--popover`}
      visible={visible}
      content={<Container>
        <AliasLabel>
          {label}:
        </AliasLabel>
        <FormInput
          disabled={loading}
          multiline
          helperText={helperText}
          value={inputValue}
          variant="outlined"
          defaultValue={defaultValue}
          onChange={(e: any) => {
            const newValue = e.target.value === "" ?  null : e.target.value;
            setInputValue(newValue);
            if (newValue && newValue.length > 40) {
              setHelperText("alias must within 40 characters.");
            } else {
              setHelperText("");
            }
          }}
          onBlur={(e: any) => {
            const value = e.target.value;
            if (value === null || value === "") {
              setInputValue(emptyValue);
            }
          }}
        />
        <SubmitButton
          loading={loading}
          disabled={helperText !== ""}
          onClick={() => {
            setLoading(true);
            handleSubmit(inputValue + '')
              .then((res: any) => {
                setVisible(false);
              })
              .catch((error: any) => {
                const errorMessage = "update alias error!";
                handleError(errorMessage);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          Submit
        </SubmitButton>
      </Container>}
      placement="topRight"
      trigger="click"
      onVisibleChange={(visible: boolean) => {
        setVisible(visible);
      }}
    >
      <EditIcon className={className} style={{ cursor: "pointer" }} />
    </Popover>
  )
};
const Container = styled(Grid)({
  display: "flex",
  alignItems: "center",
});
const AliasLabel = styled("label")({
  marginRight: "10px",
});
const FormInput = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& > label": {
    fontStyle: "italic",
  },
  "& > .MuiInput-underline:before": {
    borderColor: "white !important",
  },
}));
const EditIcon = styled(Edit)({
  width: "1rem",
  height: "1rem",
  marginLeft: "5px",
});
const SubmitButton = styled(Button)({
  width: "80px;",
  height: "30px;",
  lineHeight: "19px",
  background: "#F9F9F9",
  borderRadius: "25px",
  border: "1px solid #D52B1E",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "10px",
  color: "#252525",
  cursor: "pointer",
  letterSpacing: "1px",
  marginLeft: "10px",
})

export default VisitsPopoverForm;
