import React, { useCallback, useEffect, useState } from "react";
import { Popover } from "antd";
import "antd/dist/antd.css";
import { Grid, IconButton, Radio, styled } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import { Scrollbar as RCScrollbar } from "react-scrollbars-custom";
import { DctCapability } from "../../SoA/type/DctCapability";

interface CapabilityBadgeListProps {
  capabilityList: DctCapability[];
  displayCapabilities: SelectedTrialLevelCapability[];
  handleUpdateScenarioCapability: (selectedCapabilities: SelectedTrialLevelCapability[]) => void;
}
export interface SelectedTrialLevelCapability {
  dctCapabilityId: string;
  name: string;
  color: string;
}
const CapabilityBadgeList: React.FC<CapabilityBadgeListProps> = ({
  capabilityList: capabilities,
  displayCapabilities,
  handleUpdateScenarioCapability,
}) => {
  const [selectedDctCapabilities, setSelectedDctCapabilities] = useState<SelectedTrialLevelCapability[]>(displayCapabilities);
  useEffect(() => {
    setSelectedDctCapabilities(displayCapabilities);
  }, [displayCapabilities])
  const renderCapabilityList = useCallback((capabilityArray: DctCapability[]) => {
    return <CapabilityList>
      <ListTitle>DCT CAPABILITY SELECTION</ListTitle>
      <Scrollbar style={{
        height: "300px",
        width: "390px",
      }}>
        {
          capabilityArray
            .map((capacity: DctCapability) => {
              const checkedIndex = selectedDctCapabilities
                .findIndex((selected: SelectedTrialLevelCapability) => selected.dctCapabilityId === capacity.id);
              return (
                <Row>
                  <RadioContainer>
                    <Radio
                      checked={checkedIndex > -1}
                      onClick={(e) => {
                        const selectedCapability: SelectedTrialLevelCapability = {
                          dctCapabilityId: capacity.id,
                          name: capacity.name,
                          color: capacity.color,
                        }
                        const selectedArray: any[] = [...selectedDctCapabilities];
                        if (checkedIndex > -1) {
                          selectedArray.splice(checkedIndex, 1);
                        } else {
                          selectedArray.push(selectedCapability);
                        }
                        setSelectedDctCapabilities(selectedArray);
                        handleUpdateScenarioCapability(selectedArray);
                      }}
                    />
                    <Circle
                      style={{
                        background: capacity?.color,
                        marginLeft: "-5px",
                      }}
                    />
                  </RadioContainer>
                  <CapabilityName>{capacity?.name}</CapabilityName>
                </Row>
              )
            })
        }
      </Scrollbar>
    </CapabilityList>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDctCapabilities, handleUpdateScenarioCapability, displayCapabilities]);
  const renderSelectedCapability = (selectedCapabilities: SelectedTrialLevelCapability[]) => {
    const capabilities = selectedCapabilities;
    return capabilities.map((selectedDctCapability: SelectedTrialLevelCapability, index) => (
      <DisplayCapabilityContainer>
        <Circle style={{
          marginLeft: "10px",
          background: selectedDctCapability.color,
        }} />
        <DisplayCapabilityName>{selectedDctCapability.name}</DisplayCapabilityName>
      </DisplayCapabilityContainer>
    ))
  }
  return (
    <Container>
      <Popover
        trigger="click"
        placement="bottomRight"
        content={renderCapabilityList(capabilities)}
      >
        <BadgesButton>
          <AddCircleOutline />
        </BadgesButton>

      </Popover>
      <SelectedCapabilityContainer>
        {renderSelectedCapability(displayCapabilities)}
      </SelectedCapabilityContainer>
    </Container>
  )
};
const CapabilityList = styled(Grid)({});
const ListTitle = styled(Grid)({
  fontWeight: "bold",
});
const Row = styled(Grid)({
  display: "flex",
  alignItems: "center",
  width: "350px"
});
const CapabilityName = styled(Grid)({
  marginLeft: "5px",
  width: "280px",
});
const DisplayCapabilityName = styled(Grid)({
  marginLeft: "10px",
});
const RadioContainer = styled(Grid)({
  display: "flex",
  width: "70px",
  alignItems: "center",
  justifyContent: "flex-start",
});
const Circle = styled("div")({
  width: "20px",
  height: "20px",
  borderRadius: "10px",
  marginLeft: "10px",
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
const Container = styled(Grid)({
  display: "flex",
  marginLeft: "-10px",
});
const BadgesButton = styled(IconButton)({
  alignSelf: "start"
});
const SelectedCapabilityContainer = styled(Grid)({
  width: "705px",
  display: "flex",
  flexWrap: "wrap",
});
const DisplayCapabilityContainer = styled(Grid)({
  display: "flex",
  maxWidth: "350px",
  minHeight: "40px",
  background: "#ffffff",
  margin: "10px",
  padding: "5px 15px 5px 5px",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #dfdfdf",
  borderRadius: "20px",
});
export default CapabilityBadgeList;