import React, { useCallback, useState } from "react";
import { Popover } from "antd";
import "antd/dist/antd.css";
import { Button, Grid, IconButton, Radio, styled } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
// import { Scrollbar as RCScrollbar } from "react-scrollbars-custom";
import { DctCapability } from "../type/DctCapability";
import { DctCapabilityRelation } from "../type/DctCapabilityRelation";

interface CapabilityBagesProps {
  capabilities: DctCapability[];
  displayCapabilities: SelectedCapability[];
  capabilityRelations: DctCapabilityRelation[];
  soaTaxonomyId: string;
  disabled: boolean;
  handleUpdateSoaTaxonomyCapability: (selectedCapabilities: SelectedCapability[]) => void;
  handleApplyToAllVisits: (selectedCapabilities: SelectedCapability[]) => void;
}
export interface SelectedCapability {
  dctCapabilityId: string;
  name: string;
  status: string;
  color: string;
  soaTaxonomyId: string;
}
const CapabilityBages: React.FC<CapabilityBagesProps> = ({
  capabilities,
  displayCapabilities,
  capabilityRelations,
  soaTaxonomyId,
  disabled,
  handleUpdateSoaTaxonomyCapability: updateCapability,
  handleApplyToAllVisits,
}) => {
  const [selectedDctCapabilities, setSelectedDctCapabilities] = useState<SelectedCapability[]>(displayCapabilities);
  const renderCapabilityList = useCallback((capabilityArray: DctCapability[]) => {
    return <CapabilityList>
      <ListTitle>DCT CAPABILITY SELECTION</ListTitle>
      {
        capabilityRelations
          .filter((relation: DctCapabilityRelation) => relation.soaTaxonomyId === soaTaxonomyId)
          .map((relation: DctCapabilityRelation, index) => {
            const dctCapacityInfo = capabilityArray.find((capacity: DctCapability) => capacity.id === relation.dctCapabilityId);
            const ReadyNowcheckedIndex = selectedDctCapabilities
              .findIndex((selected: SelectedCapability) => selected.dctCapabilityId === relation.dctCapabilityId && selected.status === "Ready Now");
            const PilotCheckedIndex = selectedDctCapabilities
              .findIndex((selected: SelectedCapability) => selected.dctCapabilityId === relation.dctCapabilityId && selected.status === "Pilot");

            const readyNowDisable: boolean = relation.status.findIndex((status: string) => status === "Ready Now") === -1;
            const pilotDisable: boolean = relation.status.findIndex((status: string) => status === "Pilot") === -1;
            return (
              <Row key={index}>
                <RadioContainer>
                  <Radio
                    checked={ReadyNowcheckedIndex > -1}
                    disabled={readyNowDisable}
                    onClick={(e) => {
                      const selectedCapability: SelectedCapability = {
                        dctCapabilityId: relation.dctCapabilityId,
                        name: dctCapacityInfo?.name || "",
                        status: "Ready Now",
                        color: dctCapacityInfo?.color,
                        soaTaxonomyId,
                      }
                      const selectedArray: any[] = [...selectedDctCapabilities];
                      if (ReadyNowcheckedIndex > -1) {
                        selectedArray.splice(ReadyNowcheckedIndex, 1);
                      } else {
                        if (PilotCheckedIndex > -1) {
                          selectedArray.splice(PilotCheckedIndex, 1);
                        }
                        selectedArray.push(selectedCapability);
                      }
                      setSelectedDctCapabilities(selectedArray);
                      updateCapability(selectedArray);
                    }}
                  />
                  <Circle
                    style={{
                      background: readyNowDisable ? "#dfdfdf" : dctCapacityInfo?.color,
                      marginLeft: "-5px",
                    }}
                  />
                  <Radio
                    checked={PilotCheckedIndex > -1}
                    disabled={pilotDisable}
                    onClick={(e) => {
                      const selectedCapability: SelectedCapability = {
                        dctCapabilityId: relation.dctCapabilityId,
                        name: dctCapacityInfo?.name || "",
                        status: "Pilot",
                        color: dctCapacityInfo?.color,
                        soaTaxonomyId,
                      }
                      const selectedArray: any[] = [...selectedDctCapabilities];
                      if (PilotCheckedIndex > -1) {
                        selectedArray.splice(PilotCheckedIndex, 1);
                      } else {
                        if (ReadyNowcheckedIndex > -1) {
                          selectedArray.splice(ReadyNowcheckedIndex, 1);
                        }
                        selectedArray.push(selectedCapability);
                      }
                      setSelectedDctCapabilities(selectedArray);
                      updateCapability(selectedArray);
                    }}
                  />
                  <PilotCircle style={{
                    background: pilotDisable ? "#dfdfdf" : dctCapacityInfo?.color,
                    marginLeft: "-5px"
                  }}>
                    P
                  </PilotCircle>
                </RadioContainer>
                <CapabilityName>{dctCapacityInfo?.name}</CapabilityName>
              </Row>
            )
          })
      }
      {/* </Scrollbar> */}
      <ButtonRow>
        <CapabilityName><strong>Apply DCT Capabilities to All Visits for this activity.</strong> This will overwrite any capability selections made on the other visits.</CapabilityName>
        <ApplyButton
          variant="contained"
          color="primary"
          onClick={(e) => {
            handleApplyToAllVisits(selectedDctCapabilities);
          }}
        >
          Apply to all visits
        </ApplyButton>
      </ButtonRow>
    </CapabilityList>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capabilityRelations, handleApplyToAllVisits, selectedDctCapabilities, soaTaxonomyId, updateCapability, displayCapabilities]);
  const renderSelectedCapability = (selectedCapabilities: SelectedCapability[]) => {
    const capabilities = selectedCapabilities
      .filter((capability: SelectedCapability) => capability.status === "Pilot" || capability.status === "Ready Now")
    if (capabilities.length === 0) {
      return <AddCircleOutline />;
    }
    return capabilities.map((selectedDctCapability: SelectedCapability, index) => (
      selectedDctCapability?.status === "Pilot" ?
        <PilotCircle key={`pilot-${index}`} style={{
          marginLeft: index > 0 ? "-5px" : "10px",
          background: selectedDctCapability.color,
          zIndex: 8 - index
        }}>
          P
        </PilotCircle> :
        <Circle key={index} style={{
          marginLeft: index > 0 ? "-5px" : "10px",
          background: selectedDctCapability.color,
          zIndex: 8 - index
        }} />
    ))
  }
  return (
    <Popover
      trigger="click"
      placement="right"
      onVisibleChange={(visible) => {
        if (visible) {
          setSelectedDctCapabilities(displayCapabilities);
        }
      }}
      content={renderCapabilityList(capabilities)}
    >
      <BadgesButton disabled={disabled}>
        {renderSelectedCapability(displayCapabilities)}
      </BadgesButton>
    </Popover>
  )
};
const CapabilityList = styled(Grid)({
  width: "400px"
});
const ListTitle = styled(Grid)({
  fontWeight: "bold",
});
const Row = styled(Grid)({
  display: "flex",
  alignItems: "center",
  width: "390px"
});
const ButtonRow = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginTop: "20px"
})
const CapabilityName = styled(Grid)({
  marginLeft: "5px",
});
const RadioContainer = styled(Grid)({
  display: "flex",
  width: "120px",
  alignItems: "center",
  justifyContent: "flex-start",
});
const Circle = styled("div")({
  width: "20px",
  height: "20px",
  borderRadius: "10px",
  marginLeft: "10px",
});
const PilotCircle = styled(Circle)({
  color: "#fff",
  fontSize: "12px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const BadgesButton = styled(IconButton)({
  maxWidth: "100px"
});
const ApplyButton = styled(Button)({
  marginTop: "1rem",
  borderRadius: "3rem",
  fontWeight: 500,
  border: "1px solid #D52B1E",
  backgroundColor: "#F9F9F9",
  color: "black",
  "&:hover": {
    backgroundColor: "#F9F9F9"
  }
});
export default CapabilityBages;