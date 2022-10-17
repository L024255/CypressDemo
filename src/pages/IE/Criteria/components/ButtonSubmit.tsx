import { Button, Grid, styled } from "@material-ui/core";
import React, { FC } from "react";
export interface HeroProps {
  content: string;
  onClick?: any
}

const ButtonSubmit: FC<HeroProps> = ({ content, onClick }) => {
  return (
    <Btn>
      <div>
        <Submit
          variant="contained"
          color="primary"
          onClick={() => {onClick && onClick()}}>
            {content}
        </Submit>
      </div>
    </Btn>
  );
};

const Submit = styled(Button)({
  width: "20.5rem;",
  height: "3.938rem;",
  background: "#D52B1E;",
  boxShadow: "2px 4px 9px 0px rgba(0, 0, 0, 0.5);",
  borderRadius: "32px;",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#ffffff",
  cursor: "pointer",
});
const Btn = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  position: "fixed",
  bottom: "25px",
  width: "100%",
});

export default ButtonSubmit;
