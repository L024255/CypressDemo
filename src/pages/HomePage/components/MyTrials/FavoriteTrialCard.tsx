import React from "react";
import { Card, CardContent, styled } from "@material-ui/core";
import { Favorite } from "@material-ui/icons";

export interface FavoriteTrialCardProps {
  title: String;
  subTitle: React.ReactNode;
}

const FavoriteTrialCard: React.FC<FavoriteTrialCardProps> = ({
  title,
  subTitle,
}) => {
  return (
    <CardContainer>
      <CardWrapper>
        {/* <Title gutterBottom>{title}</Title> */}
        <SubtitleContainer>
          <Favorite fontSize="small" color="primary" />
          <SubTitleText>{subTitle}</SubTitleText>
        </SubtitleContainer>
      </CardWrapper>
    </CardContainer>
  );
};

const CardContainer = styled(Card)({
  width: "20rem",
  marginBottom: "2rem",
  marginRight: "2rem",
});

const CardWrapper = styled(CardContent)({
  padding: "28px",
});

// const Title = styled(Typography)({
//   color: "#252525",
//   fontFamily: "Helvetica",
//   fontSize: "0.688rem",
//   letterSpacing: 0,
//   lineHeight: "0.813rem",
// });

const SubTitleText = styled("label")({
  marginLeft: "10px",
  fontSize: "1.25rem",
  color: "#000",
  fontWeight: 500,
  lineHeight: "1.625rem",
  letterSpacing: 0,
});

const SubtitleContainer = styled("div")({
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
});

export default FavoriteTrialCard;
