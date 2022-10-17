import React from "react";
import { Card, CardContent, styled, Grid, Button } from "@material-ui/core";

export interface OptionCardProps {
  title: string;
  buttonTxt: string;
  handleClickButton?: Function;
  scenarioCriteria?: any[];
  soaActivities?: any[];
  disabled?: any;
}

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  buttonTxt,
  handleClickButton,
  disabled
}) => {
  console.log('disabled', disabled)
  return (
    <CardContainer>
      <CardContentContainer>
        <Container container>
          <Left item xs={6}>
            <TitleContainer>
              <TitleText>{title}</TitleText>
            </TitleContainer>
          </Left>
          <Right item xs={6}>
            <RightWrapper>
              <EditButton
                variant="outlined"
                onClick={() => {
                  handleClickButton && handleClickButton();
                }}
                disabled={disabled && disabled}
              >
                {buttonTxt}
              </EditButton>
            </RightWrapper>
          </Right>
        </Container>
      </CardContentContainer>
    </CardContainer>
  );
};
const CardContainer = styled(Card)({
  marginBottom: "2rem",
  width: "100%",
  boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.08)",
});
const CardContentContainer = styled(CardContent)({
  padding: "0 !important",
});
const Container = styled(Grid)({});
const Left = styled(Grid)({
  paddingTop: "2.625rem",
  paddingBottom: "2.625rem",
  paddingLeft: "2.063rem",
});
const Right = styled(Grid)({
  padding: "2.313rem",
  paddingRight: "1.625rem",
  position: "relative",
  display: "flex",
  justifyContent: "center",
});
const RightWrapper = styled(Grid)({
  display: "flex",
});
const TitleContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});
const TitleText = styled("label")({
  marginLeft: "0.625rem",
  fontSize: "1.125rem",
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "1.625rem",
});
const EditButton = styled(Button)({
  width: "7.813rem",
  height: "2.25rem",
  borderRadius: "1.563rem",
  borderWidth: "1px !important",
  fontWeight: 500,
  padding: "6px 32px",
  backgroundColor: "#FFF",
  lineHeight: "1.188rem",
});
export default OptionCard;
