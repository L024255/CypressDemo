import React, { useEffect, useState } from "react";
import { PDFViewer } from '@react-pdf/renderer';
import { Grid, styled } from "@material-ui/core";
import { SoaVisitModal } from "./type/SoaVisit";
import DctCapabilityPdf from "./DctCapabilityPdf";
import { QueryByStringWithClient } from "../../api/apollo";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import { DisplayDctCapability } from "./type/DctCapability";
import PdfSkeleton from "./components/PdfSkeleton";

const DctCapabilitySummary: React.FC = () => {
  const [visitCapabilities, setVisitCapabilities] = useState<SoaVisitModal[]>();
  const [dctCapabilityDic, setDctCapabilityDic] = useState<DisplayDctCapability[]>();
  const [trialCapabilities, setTrialCapabilities] = useState<[]>([]);
  const scenarioId =  sessionStorage.getItem("PdfScenarioId");
  useEffect(() => {
    if (scenarioId) {
      QueryByStringWithClient(graphqlStringMap.fetchDctCapabilitySummary, { id: scenarioId })
      .then((res: any) => {
        const result: SoaVisitModal[] = res?.data?.dctCapabilitySummary?.soaVisits|| [];
        setVisitCapabilities(result);
      });
      QueryByStringWithClient(graphqlStringMap.fetchScenarioCapabilities, { id: scenarioId })
      .then((res: any) => {
        const result: [] = res?.data?.scenario?.dctCapabilities|| [];
        setTrialCapabilities(result);
      });
      fetchByGraphqlString(graphqlStringMap.fetchCapabilityAndRelations)
      .then((res: any) => {
        const dctCapabilities = res?.data?.dctCapabilities || [];
        setDctCapabilityDic(dctCapabilities)
      })
    }
  }, [scenarioId]);
  return (
    <Container>
      {
        (visitCapabilities && dctCapabilityDic) ? (
          <PDFViewer width="100%" height="100%">
            <DctCapabilityPdf
              visitDctCapabilities={visitCapabilities}
              dctCapabilityDic={dctCapabilityDic}
              trialCapabilities={trialCapabilities} />
          </PDFViewer>
        ) : <PdfSkeleton />
      }
    </Container>
  );
};

const Container = styled(Grid)({
  height: "100vh",
  width: "100%",
})

export default DctCapabilitySummary;
// ReactPDF.render(<DctCapabilitySummary />, "");