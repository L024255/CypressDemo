import React from "react";
import {
  styled,
  Grid,
  Modal as MUIModal,
  Button,
} from "@material-ui/core";
import { Scrollbar as RCScrollbar } from "react-scrollbars-custom";
import { ExitToApp, FiberManualRecord } from "@material-ui/icons";
import { ExternalEndpointTermEndpoint } from "../type/ExternalEndpoint";

interface EndpointTextModalProps {
  open: boolean;
  activityName: string;
  modalData: ExternalEndpointTermEndpoint[];
  handleClose: Function;
};
const EndpointTextModal: React.FC<EndpointTextModalProps> = ({
  open,
  modalData,
  activityName,
  handleClose,
}) => {
  return (
    <Modal open={open}>
      <CriteriaDataContainer>
        <HeadingModal>
          <HeadingColumn>{activityName}</HeadingColumn>
        </HeadingModal>
        <ModalContentWraper>
          <Scrollbar style={{ width: "100%", height: "600px" }}>
            {
              modalData.map((endpoint: ExternalEndpointTermEndpoint, index) => (
                <Row style={ index % 2 === 0 ? { background: "#F7F6F3" } : {}}>
                  <IDContainer container>
                    <NctId item>
                      {endpoint.nctId}
                    </NctId>
                    <Grid item>
                    </Grid>
                    <InternalType item>
                      {
                        endpoint.sponsor !== 'null' && (
                         <>
                            <span style={{ margin: "auto 10px"}}>/</span> {endpoint.internal ? <RedDot /> : <BlueDot />} {endpoint.sponsor}
                         </> 
                        )
                      }
                      
                    </InternalType>
                  </IDContainer>
                  <StudyTitleContainer>
                    {endpoint.studyTitle !== 'null' && (
                      <>{endpoint.studyTitle}</>
                    )}
                  </StudyTitleContainer>
                  <TextContainer>
                    <Scrollbar style={{ height: "100px"}}>
                      {endpoint.rawText}
                    </Scrollbar>
                  </TextContainer>
                 </Row>
              ))
            }

          </Scrollbar>
        </ModalContentWraper>
        <ModalActionWapper>
            <CloseButton
              startIcon={<ExitToApp />}
              variant="contained"
              color="primary"
              onClick={() => handleClose()}
            >
                Close
            </CloseButton>
        </ModalActionWapper>
      </CriteriaDataContainer>
    </Modal>
  )
};

const CriteriaDataContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: 931,
  height: 699,
  border: "1px solid #DDDDDD",
  boxShadow: "0 1px 5px 0 rgba(0,0,0,0.12)",
  backgroundColor: "#ffffff",
  paddingTop: "10px",
  borderRadius: 12,
});
const Modal = styled(MUIModal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const HeadingModal = styled(Grid)({
  borderBottom: "1px solid #ddd",
  padding: "20px",
  height: "30px",
  display: "flex",
  alignItems: "center",
});
const HeadingColumn = styled(Grid)({
  color: "#82786F",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1rem",
  letterSpacing: "1px",
  textTransform: "uppercase",
})
const ModalContentWraper = styled(Grid)({});
const Row = styled(Grid)({
  width: "100%",
  height: "200px",
  padding: "10px 20px",
});
const IDContainer = styled(Grid)({});
const NctId = styled(Grid)({
  color: "#D52B1E",
});
const InternalType = styled(Grid)({
  color: "#A9A49D",
  textTransform: "uppercase",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const StudyTitleContainer = styled(Grid)({
  color: "#A9A49D",
  fontWeight: 500,
  textTransform: "uppercase",
});
const TextContainer = styled(Grid)({
  marginTop: "10px"
});
const Scrollbar = styled(RCScrollbar)({
  "& .ScrollbarsCustom-ThumbY": {
    background: "#D52B1E !important",
    width: "7px !important",
  },
  "& .ScrollbarsCustom-TrackY": {
    width: "7px !important",
  }
});
const ModalActionWapper = styled(Grid)({
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  padding: "0 20px",

})
const RedDot = styled(FiberManualRecord)({
  width: "15px",
  height: "15px",
  marginRight: "5px",
  color: "#B82F24",
});
const BlueDot = styled(FiberManualRecord)({
  width: "15px",
  height: "15px",
  marginRight: "5px",
  color: "#2F416C",
});
const CloseButton = styled(Button)({
  width: "137px",
  height: "36px",
  borderRadius: "3rem",
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: "1.5rem",
  letterSpacing: 0,
});

export default EndpointTextModal;