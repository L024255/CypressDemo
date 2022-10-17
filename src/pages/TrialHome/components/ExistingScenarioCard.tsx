import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  styled,
  Grid,
  Button,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import { MoreHoriz, ChevronRight } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import TabStyledMenuBox from "../../../components/CustomMenuContainer/TabStyledMenuBox";
import { formatTime } from "../../../utils/getDataUtil";

export interface ExsistingScenarioCardProps {
  title: string;
  author: string;
  description: string;
  time: string;
  id: string;
  isFinal: boolean;
  trialImpactMatrics: {
    ieComplexityScore: string;
    ieComplexityScoreRank: string;
    screenFailureRate: string;
    screenFailureRateRank: string;
    protocolAmendment: string;
    protocolAmendmentRank: string;
    overallCostPerPatient?: any;
  }
  handleCloneScenario: () => void;
  handleExportScenario: () => void;
}

const ExsistingScenarioCard: React.FC<ExsistingScenarioCardProps> = ({
  title,
  author,
  isFinal,
  description,
  time,
  id,
  trialImpactMatrics,
  handleCloneScenario,
  handleExportScenario,
}) => {
  const { push } = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleEditScenario = () => {
    push(`/edit-scenario/${id}`);
  };
  const handleClickMoreHoriz = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getStyleByDegree = (rank: any) => {
    if (rank) {
      if (rank.toLowerCase() === "good") {
         return { color: "#00AF3F" };
      } else if (rank.toLowerCase() === "fair") {
        return { color: "#FFA900" };
      } else if (rank.toLowerCase() === "poor") {
        return { color: "#D52B1E" };
      }
    }
    return {};
  };
  return (
    <CardContainer>
      <CardContentContainer>
        <Container container>
          <Left item xs={4}>
            <TitleContainer>
              {/* {isFinal ? <Favorite
                fontSize="small"
                color="primary"
                style={{ marginLeft: "10px" }}
              /> :
                <FavoriteBorder fontSize="small" color="primary" />
              } */}
              <TitleText>{title}&nbsp;<FinalLabel>{isFinal ? "(Final)" : ""}</FinalLabel></TitleText>
            </TitleContainer>
            <Author>by {author}</Author>
            <LastSaveTime variant="body1">Last Saved {formatTime(time)}</LastSaveTime>
            <Description variant="body2">{description}</Description>
          </Left>
          <Middle item xs={4}>
              <MetricTitle>Trial Impact Metrics</MetricTitle>
              <MetricRecord>
                <MetricItem>I/E Complexity Score</MetricItem>
                <MetricValue style={getStyleByDegree(trialImpactMatrics?.ieComplexityScoreRank)}>
                  {trialImpactMatrics?.ieComplexityScore || "-"}
                </MetricValue>
              </MetricRecord>
              <MetricRecord>
                <MetricItem>Screen Failure Rate</MetricItem>
                <MetricValue style={getStyleByDegree(trialImpactMatrics?.screenFailureRateRank)}>
                  {trialImpactMatrics?.screenFailureRate || "-"}
                </MetricValue>
              </MetricRecord>
              <MetricRecord>
                <MetricItem>Protocol Amendment</MetricItem>
                <MetricValue style={getStyleByDegree(trialImpactMatrics?.protocolAmendmentRank)}>
                  {trialImpactMatrics?.protocolAmendment || "-"}
                </MetricValue>
              </MetricRecord>
              <MetricRecord>
                <MetricItem>Overall cost per patient</MetricItem>
                <MetricValue>
                  {trialImpactMatrics?.overallCostPerPatient ? "$" + trialImpactMatrics?.overallCostPerPatient : "-"}
                </MetricValue>
              </MetricRecord>
          </Middle>
          <Right item xs={4}>
            <RightWrapper>
              <ButtonContainer>
                <EditButton variant="outlined" onClick={handleEditScenario}>
                  Edit Scenario
                </EditButton>
                <StyledIconButton
                  className={open ? "clicked" : ""}
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClickMoreHoriz}
                >
                  <MoreHoriz />
                </StyledIconButton>
                <TabStyledMenuBox anchorEl={anchorEl} onClose={handleClose}>
                  <StyledMenuItem key="exportScenario" onClick={handleExportScenario}>
                    Export Scenario
                    <ChevronRight color="primary" />
                  </StyledMenuItem>
                  <StyledMenuItem key="exportScenario" onClick={handleCloneScenario}>
                    Copy and Create New Scenario
                    <ChevronRight color="primary" />
                  </StyledMenuItem>
                </TabStyledMenuBox>
              </ButtonContainer>
            </RightWrapper>
          </Right>
        </Container>
      </CardContentContainer>
    </CardContainer>
  );
};


const FinalLabel = styled("span")({
  fontSize: "0.875rem",
  color: "#000",
  opacity: "0.6",
});

const CardContainer = styled(Card)({
  marginBottom: "2rem",
  width: "100%",
});
const CardContentContainer = styled(CardContent)({
  padding: "0 !important",
});
const Container = styled(Grid)({});
const Left = styled(Grid)({
  backgroundColor: "#F5F5F5",
  paddingTop: "1.438rem",
  paddingLeft: "1.625rem",
});
const Middle = styled(Grid)({
  padding: "40px",
});
const MetricTitle = styled(Typography)({
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "uppercase",
});
const MetricRecord = styled(Grid)({
  display: "flex",
  padding: "5px 0",
});
const MetricItem = styled(Typography)({
  color: "#A59D95",
  fontSize: "12px",
  width: "200px",
  textTransform: "uppercase",
});
const MetricValue = styled(Typography)({
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase",
})
const Right = styled(Grid)({
  backgroundColor: "#F5F5F5",
  padding: "1.438rem",
  position: "relative",
  display: "flex",
  justifyContent: "center",
});
const RightWrapper = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});
const TitleContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});
const TitleText = styled("label")({
  // marginLeft: "0.625rem",
  fontSize: "1.125rem",
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "1.625rem",
});
const LastSaveTime = styled(Typography)({
  color: "#A59D95",
  fontSize: "0.75rem",
  letterSpacing: 0,
  lineHeight: "1.375rem",
});
const Author = styled(Typography)({
  margin: "5px auto",
  color: "#000000",
  fontSize: "0.875rem",
  letterSpacing: 0,
  lineHeight: "1.375rem",
});
const Description = styled(Typography)({
  margin: "5px auto",
  color: "#000000",
  fontSize: "10px",
  letterSpacing: 0,
  lineHeight: "1.375rem",
});
const ButtonContainer = styled(Grid)({});
const StyledIconButton = styled(IconButton)({
  borderRadius: 0,
  marginLeft: "1.25rem",
  "&&.clicked": {
    opacity: 100,
    background: "#fff",
    border: "none",
    boxShadow: "none",
  },
});
const StyledMenuItem = styled(MenuItem)({
  display: "flex",
  justifyContent: "space-between",
  width: "18.938rem",
  fontSize: "0.75rem",
  paddingTop: "1.25rem",
  paddingBottom: "1.25rem",
});
const EditButton = styled(Button)({
  width: "12.188rem",
  height: "2.375rem",
  borderRadius: "1.25rem",
  borderWidth: "1px !important",
  fontWeight: 500,
  padding: "0.375rem 2rem",
  backgroundColor: "#FFF",
  lineHeight: "1.188rem",
});
export default ExsistingScenarioCard;
