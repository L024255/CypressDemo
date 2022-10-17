import { styled, TextField, TextFieldProps } from "@material-ui/core";
import React, { useState } from "react";


const CustomNumberInput: React.FC<TextFieldProps> = (
  props,
) => {
  const [inputValue, setInputValue] = useState(props.defaultValue || "");
  return <Input
    {...props}
    value={inputValue} 
    onChange={(e: any) => {
      const value = e.target.value;
      const result = /^[0-9]*$/.test(value);
      if (!result) {
        setInputValue("");
      } else {
        setInputValue(value);
      }
    }}
  />
};

const Input = styled(TextField)({});

export default CustomNumberInput