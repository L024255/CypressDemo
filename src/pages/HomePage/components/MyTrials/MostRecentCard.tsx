import React from "react";
import {
  Card,
  CardContent,
  Typography,
  styled,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { FavoriteBorder, Favorite } from "@material-ui/icons";

export interface MostRecentCardProps {
  title: String;
  trialId: string;
  isFavourate?: boolean;
  subTitle: String;
  author: String;
  description: String;
  scenarioInProgress: String;
  time: String;
  attributes: any[];
  handleUpdateFavourateTrial: Function;
  dataVersion: string;
}

const MostRecentCard: React.FC<MostRecentCardProps> = ({
  title,
  trialId,
  subTitle,
  author,
  description,
  scenarioInProgress,
  time,
  attributes,
  isFavourate,
  handleUpdateFavourateTrial,
  dataVersion,
}) => {
  const { push } = useHistory();
  const handleClickViewTiral = () => {
    push(`/trial-homepage/${trialId}`);
  };
  return (
    <CardContainer>
      <CardContentContainer>
        <Container container>
          <Left item xs={8}>
            {/* <Title gutterBottom>{title}</Title> */}
            <SubtitleContainer>
              <IconButton
                onClick={() => {
                  handleUpdateFavourateTrial && handleUpdateFavourateTrial();
                }}
              >
                {isFavourate ? (
                  <Favorite fontSize="small" color="primary" />
                ) : (
                  <FavoriteBorder fontSize="small" color="primary" />
                )}
              </IconButton>
              <SubTitleText>{subTitle}</SubTitleText>
            </SubtitleContainer>
            <Author variant="body1">{author}</Author>
            <Description variant="body2">{description}</Description>
            <Attributs container>
              {attributes.map((attribute, index) => {
                return (
                  <AttributeItem
                    key={index}
                    title={attribute.title}
                    value={attribute.value}
                    isMatched={attribute.matched}
                  />
                );
              })}
            </Attributs>
            <DataVersion>
              Data version {dataVersion}
            </DataVersion>
          </Left>
          <Right item xs={4}>
            <AttributeTitle variant="caption">
              SCENARIOS IN PROGRESS
            </AttributeTitle>
            <RightAtrributeValue variant="caption">
              <>
              { (Number(scenarioInProgress) === 0) && (
                "No Scenarios"
              )}
              { (Number(scenarioInProgress) === 1) && (
               "1 Scenario"
              )}
              { (Number(scenarioInProgress) > 1) && (
                `${Number(scenarioInProgress)} Scenarios`
              )}
              </>
            </RightAtrributeValue>
            <Time variant="body2">{time}</Time>
            <ViewTrialButton variant="outlined" onClick={handleClickViewTiral}>
              View Trial Workspace
            </ViewTrialButton>
          </Right>
        </Container>
      </CardContentContainer>
    </CardContainer>
  );
};
const CardContainer = styled(Card)({
  marginBottom: "2rem",
  width: "100%",
});
const CardContentContainer = styled(CardContent)({
  padding: "0 !important",
});
const Container = styled(Grid)({});
const Left = styled(Grid)({
  padding: "28px 36px",
});
const Right = styled(Grid)({
  backgroundColor: "#F5F5F5",
  padding: "38px",
  position: "relative",
});
// const Title = styled(Typography)({
//   color: "#252525",
//   fontFamily: "Helvetica",
//   fontSize: "0.688rem",
//   letterSpacing: 0,
//   lineHeight: "0.813rem",
// });
const SubTitleText = styled("label")({
  fontSize: "1.25rem",
  color: "#000",
  fontWeight: 500,
  lineHeight: "1.625rem",
  letterSpacing: 0,
});
const Author = styled(Typography)({
  color: "#A59D95",
  fontSize: "0.75rem",
  fontFamily: "Helvetica",
  lineHeight: "1.375rem",
  letterSpacing: 0,
});
const Description = styled(Typography)({
  margin: "2rem auto",
  fontSize: "0.813rem",
  letterSpacing: 0,
  lineHeight: "1.375rem",
});
const SubtitleContainer = styled("div")({
  fontSize: "18px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
});
const Attributs = styled(Grid)({});
const AttributeTitle = styled(Typography)({
  display: "block",
  fontSize: "0.625rem",
  letterSpacing: "0.094rem",
  lineHeight: "1rem",
  color: "#666",
});
const AttributeValue = styled(Typography)({
  display: "block",
  fontSize: "1rem",
  letterSpacing: 0,
  lineHeight: "1.5rem",
  fontWeight: 500,
});
const RightAtrributeValue = styled(Typography)({
  color: "#252525",
  fontSize: "1.25rem",
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "1.625rem",
  display: "block",
  marginTop: "1.361rem",
});
const Time = styled(Typography)({
  display: "block",
  fontSize: "0.875rem",
  color: "#A59D95",
  marginTop: "0.875rem",
  lineHeight: "1.375rem",
  marginBottom: "20px",
});
const ViewTrialButton = styled(Button)({
  fontWeight: 500,
  backgroundColor: "#F9F9F9",
  borderRadius: "1.563rem",
  border: "1px solid #D52B1E !important",
  height: "37px",
  paddingLeft: "26px",
  paddingRight: "26px",
});
interface AttributeItemProps {
  title: String;
  value: String;
  isMatched?: boolean;
}
const AttributeItem: React.FC<AttributeItemProps> = ({
  title,
  value,
  isMatched,
}) => {
  return (
    <Attributewrapper item xs={3}>
      <AttributeTitle variant="caption">{title}</AttributeTitle>
      <AttributeValue
        variant="caption"
        style={
          isMatched
            ? { background: "rgba(249, 70, 56, 0.4)", width: "fit-content" }
            : {}
        }
      >
        {value}
      </AttributeValue>
    </Attributewrapper>
  );
};

const Attributewrapper = styled(Grid)({
  paddingBottom: "20px",
});
const DataVersion = styled(Grid)({
  fontSize: "0.625rem",
  letterSpacing: "0.094rem",
  lineHeight: "1rem",
  color: "#666",
  textTransform: "uppercase",
});

export default MostRecentCard;
