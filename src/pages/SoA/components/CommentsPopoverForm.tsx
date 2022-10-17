import React, { useState } from "react";
import { Popover, Button } from "antd";
import "antd/dist/antd.css";
import { Grid, styled, TextField } from "@material-ui/core";

interface CommentsPopoverFormProps {
  id: any;
  activeName: any,
  defaultValue: any,
  handleSubmit: (value: any) => Promise<any>;
  handleError: (error: string) => void;
}

const CommentsPopoverForm: React.FC<CommentsPopoverFormProps> = ({
  id,
  activeName,
  defaultValue,
  children,
  handleError,
  handleSubmit
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <Popover
      key={`${id}--popover`}
      visible={visible}
      content={<Container>
        <Row>
          <ContentsLabel> {activeName} Comments</ContentsLabel>
        </Row>
        <Row>
          <FormInput
            multiline
            rows={3}
            // minRows={3}
            disabled={loading}
            variant="outlined"
            defaultValue={defaultValue}
            onChange={(e: any) => {
              const newValue = e.target.value === "" ?  null : e.target.value;
              setInputValue(newValue);
            }}
          />
        </Row>
        <Row style={{ justifyContent: "flex-end" }}>
          <SubmitButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              handleSubmit(inputValue)
                .then((res: any) => {
                  setVisible(false);
                })
                .catch((error: any) => {
                  const errorMessage = "update comments error!";
                  handleError(errorMessage);
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            Submit
          </SubmitButton>
        </Row>
      </Container>}
      placement="topRight"
      trigger="click"
      onVisibleChange={(visible: boolean) => {
        setVisible(visible);
      }}
    >
      {/* <EditIcon className={className} style={{ cursor: "pointer" }} /> */}
      <ChildContainer>
        {children}
      </ChildContainer>
    </Popover>
  )
};
const Container = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  width: "300px",
});
const Row = styled(Grid)({
  margin: "10px 0",
  display: "flex",
});
const ContentsLabel = styled("label")({
  marginRight: "10px",
});
const FormInput = styled(TextField)(({ theme }) => ({
  width: "100%",
  fontWeight: 500,
  "& > label": {
    fontStyle: "italic",
  },
  "& > .MuiInput-underline:before": {
    borderColor: "white !important",
  },
  "& .MuiOutlinedInput-inputMultiline::-webkit-scrollbar-thumb": {
    background: "#D52B1E !important",
    borderRadius: "10px !important",
  },
  "& .MuiOutlinedInput-inputMultiline::-webkit-scrollbar": {
    background: "rgba(0, 0, 0, 0.1) !important",
    border: "1px solid rgb(240, 240, 240)",
    height: "7px !important",
    width: "7px !important",
  },
}));
const ChildContainer = styled(Grid)({
  cursor: "pointer",
  display: "flex",
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

export default CommentsPopoverForm;
