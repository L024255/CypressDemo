import React, { useEffect, useState } from "react";
import SummaryCard from "../IE/components/SummaryCard";
import {
  InfoOutlined,
  Visibility
} from "@material-ui/icons";
import {
  Button,
  createStyles,
  Grid,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Scrollbar as RCScrollbar } from "react-scrollbars-custom";
import { Popover } from "antd";
import "antd/dist/antd.css";
import EndpointTextModal from "./components/EndpointTextModal";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import { ExternalEndpointTermEndpoint, ExternalEndpointTermType, ExternalEndpointType } from "./type/ExternalEndpoint";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import CustomErrorBar from "../../components/CustomErrorBar";
import { QueryByStringWithClient } from "../../api/apollo";

interface ExternalEndpointsProps {
  trialWorkspaceId: string,
  scenarioId: string,
}
const ExternalEndpoints: React.FC<ExternalEndpointsProps> = ({
  trialWorkspaceId,
  scenarioId,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState("");
  const [enteredPrimaryEndpointsCount, setEnteredPrimaryEndpointsCount] = useState(0);
  const [enteredSecondaryEndpointsCount, setEnteredSecondaryEndpointsCount] = useState(0);
  const [externalEndpointsData, setExternalEndpointsData] = useState<ExternalEndpointType>();
  const [openModalTermEndpoints, setOpenModalTermEndpoints] = useState<ExternalEndpointTermEndpoint[]>([]);
  const [openModalActivityName, setOpenModalActivityName] = useState("");
  useEffect(() => {
    setLoading(true);
    fetchByGraphqlString(graphqlStringMap.fetchExternalEndpoints)
      .then((res: any) => {
        const externalEndpointArr = res.data.externalEndpoints;
        setExternalEndpointsData(externalEndpointArr);
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);
  useEffect(() => {
    setLoading(true);
    if (scenarioId) {
      QueryByStringWithClient(graphqlStringMap.fetchScenario, {
        id: scenarioId,
      })
        .then((res: any) => {
          const endpoints = res.data?.scenario?.endpoints || [];
          const primaryEndpoints = endpoints.filter((endpoint: any) => endpoint.endpointCategory?.name?.toLowerCase() === "primary");
          const scendaryEndpoints = endpoints.filter((endpoint: any) => endpoint.endpointCategory?.name?.toLowerCase() === "secondary");
          setEnteredPrimaryEndpointsCount(primaryEndpoints.length);
          setEnteredSecondaryEndpointsCount(scendaryEndpoints.length);
        })
        .catch((error: any) => {
          setSysError(error.message || "There was an error, please try again");
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }, [scenarioId]);
  return (
    <Container>
      <CustomLoading open={loading} />
      <CustomErrorBar
        open={Boolean(sysError)}
        content={sysError}
        onClose={() => setSysError("")}
      />
      <EndpointTextModal
        open={openModal}
        activityName={openModalActivityName}
        handleClose={() => setOpenModal(false)}
        modalData={openModalTermEndpoints}
      />
      <BasicInfoContainer>
        <Title>View External (Industry-Sponsored) Alzheimer Study Endpoints</Title>
        <Description>
          View data and insights associated with primary and secondary endpoints from non-Lilly Alzheimer’s study sponsors. Use
          insights from this page to consider your endpoints added in the “Enter Endpoints” tab.
        </Description>
      </BasicInfoContainer>
      <SummaryCardContainer container spacing={3}>
        <Grid item xs={3}>
          <SummaryCard
            style={SummaryCardStyle}
            value={enteredPrimaryEndpointsCount}
            description={
              <>
                <div>NUMBER OF PRIMARY</div>
                <div>ENDPOINTS ENTERED FOR MY</div>
                <div>SCENARIO</div>
              </>
            }
          />
        </Grid>
        <Grid item xs={3}>
          <SummaryCard
            style={SummaryCardStyle}
            value={externalEndpointsData?.maxPrimary && externalEndpointsData?.minPrimary ? `${externalEndpointsData?.minPrimary}-${externalEndpointsData?.maxPrimary}` : 'N/A'}
            description={
              <>
                <div>Min - Max Number Of</div>
                <div>Primary Endpoints</div>
                <div>Across External Alz</div>
                <div>Sponsors</div>
              </>
            }
          />
        </Grid>
        <Grid item xs={3}>
          <SummaryCard
            style={SummaryCardStyle}
            value={enteredSecondaryEndpointsCount}
            description={
              <>
                <div>Number Of Secondary</div>
                <div>Endpoints Entered For</div>
                <div>My Scenario</div>
              </>
            }
          />
        </Grid>
        <Grid item xs={3}>
          <SummaryCard
            style={SummaryCardStyle}
            value={externalEndpointsData?.maxSecondary && externalEndpointsData?.minSecondary ? `${externalEndpointsData?.minSecondary}-${externalEndpointsData?.maxSecondary}` : 'N/A'}
            // value="4-7"
            description={
              <>
                <div>Min-Max Number Of</div>
                <div>Secondary Endpoints</div>
                <div>Across External Alz</div>
                <div>Sponsors</div>
              </>
            }
          />
        </Grid>
      </SummaryCardContainer>
      <TableContainer>
        <Scrollbar style={{ height: "800px" }}>
          <Table stickyHeader>
            <TableHead style={{ height: "2.5rem" }}>
              <TableRow>
                <TableHeaderCell>Endpoint Activity</TableHeaderCell>
                <TableHeaderCell>Frequency as Primary Endpoint</TableHeaderCell>
                <TableHeaderCell>Frequency as Secondary Endpoint</TableHeaderCell>
                <TableHeaderCell>
                <Popover
                  content={
                    <p style={{ maxWidth: "350px", whiteSpace: "normal" }}>
                      The overall frequency with which this endpoint activity occurs as a primary or secondary endpoint in external trials.
                    </p>
                  }
                  placement="bottomLeft"
                >
                  Frequency Overall
                  <InfoIcon />
                  </Popover>
                </TableHeaderCell>
                <TableHeaderCell>View Endpoint Text</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ maxHeight: "800px" }}>
              {externalEndpointsData?.terms.map((externalEndpointTerm: ExternalEndpointTermType) => {
                return (
                  <StyledTableRow key={externalEndpointTerm.term}>
                    <CriteriaTooltip title={externalEndpointTerm.term} aria-label="add">
                      <StyledTableCell scope="row" style={{ minWidth: "250px" }}>
                        <CellContainer>
                          {externalEndpointTerm.term}
                        </CellContainer>
                      </StyledTableCell>
                    </CriteriaTooltip>
                    <StyledTableCell scope="row">
                      <CellContainer>
                        {!isNaN(externalEndpointTerm.primaryFrequency) ? `${(externalEndpointTerm.primaryFrequency * 100).toFixed(0)}%` : 'N/A'}
                      </CellContainer>
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      <CellContainer>
                        {!isNaN(externalEndpointTerm.secondaryFrequency) ? `${(externalEndpointTerm.secondaryFrequency * 100).toFixed(0)}%` : 'N/A'}
                      </CellContainer>
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      <CellContainer>
                        {!isNaN(externalEndpointTerm.totalFrequency) ? `${(externalEndpointTerm.totalFrequency * 100).toFixed(0)}%` : 'N/A'}
                      </CellContainer>
                    </StyledTableCell>
                    <StyledTableCell scope="row" align="center">
                      <CellContainer>
                        <IconButton
                          onClick={() => {
                            setOpenModalTermEndpoints(externalEndpointTerm.endpoints);
                            setOpenModalActivityName(externalEndpointTerm.term);
                            setOpenModal(true);
                          }
                          }
                        >
                          <Visibility style={{ color: "#B4B4B3" }} />
                        </IconButton>
                      </CellContainer>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <ButtonContainer>
        <SubmitButton
          variant="contained"
          color="primary"
        >
          Submit
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled(Grid)({
  paddingTop: "2.75rem",
  margin: "auto",
});
const Title = styled(Typography)({
  fontSize: "1.5rem",
  color: "#2D2D2D",
  lineHeight: "1.813rem",
});
const Description = styled(Typography)({
  fontSize: "1rem",
  color: "#2D2D2D",
  lineHeight: "1.5rem",
  marginTop: "0.438rem",
});
const BasicInfoContainer = styled(Grid)({
  maxWidth: "60rem",
  margin: "auto",
});
const SummaryCardContainer = styled(Grid)({
  marginTop: "1.813rem",
  display: "flex",
  justifyContent: "flex-start",
  maxWidth: "60rem",
  margin: "auto",

  "& .MuiGrid-item": {
    paddingLeft: 0
  },
});
const TableContainer = styled(Grid)({
  maxWidth: "60rem",
  margin: "auto",
  marginTop: "3rem",
  marginBottom: "7rem",
  boxShadow: "0px 0px 4px 2px #ddd",
});
const TableHeaderCell = styled(TableCell)({
  height: "5rem",
  minWidth: "7.188rem",
  fontSize: "0.675rem",
  color: "rgba(0,0,0,.6)",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
  textTransform: "uppercase",
  border: "none !important",
  "&.MuiTableRow-head.MuiTableRow-head th:not(:first-child)": {
    borderLeft: "none",
  },
});
const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(even)": {
        backgroundColor: "#F8F8F9",
      },
      border: "none",
      "&& .MuiTableCell-body": {
        fontSize: "0.75rem",
        color: "#2D2D2D",
        lineHeight: "1.625rem",
      },
    },
  })
)(TableRow);
const StyledTableCell = styled(TableCell)({
  border: "none !important",
});
const CriteriaTooltip = styled(Tooltip)({
  fontSize: "1rem",
});
const CellContainer = styled("div")({
  display: "block",
  width: "100%",
});
const ButtonContainer = styled(Grid)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  paddingBottom: "2rem",
});
const SubmitButton = styled(Button)({
  width: "328px",
  height: "63px",
  borderRadius: "2rem",
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: "1.5rem",
  letterSpacing: 0,
  boxShadow: "2px 4px 9px 0px rgba(0, 0, 0, 0.5)",
});
const SummaryCardStyle = {
  height: "130px",
};
const Scrollbar = styled(RCScrollbar)({
  "& .ScrollbarsCustom-ThumbY": {
    background: "#D52B1E !important",
    width: "7px !important",
  },
  "& .ScrollbarsCustom-TrackY": {
    width: "7px !important",
  }
});
const InfoIcon = styled(InfoOutlined)({
  fontSize: "0.8rem",
  color: "rgba(0, 0, 0, 0.6)",
  position: "relative",
  top: "2px",
  left: "5px",
});
export default ExternalEndpoints;
