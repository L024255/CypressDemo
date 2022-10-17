import React, { useCallback, useState } from "react";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  IconButton,
  Radio,
  styled,
  Typography,
} from "@material-ui/core";
import { Popover } from "antd";
import "antd/dist/antd.css";
import { DctCapability } from "../type/DctCapability";
import { AddCircleOutline } from "@material-ui/icons";

export interface SelectedTrialLevelCapability {
  dctCapabilityId: string;
  name: string;
  color: string;
}

interface TrialLevelCapabilitiesCardProps {
  capabilityList: DctCapability[];
  displayCapabilities: SelectedTrialLevelCapability[];
  handleUpdateScenarioCapability: (selectedCapabilities: SelectedTrialLevelCapability[]) => void;
}

const TrialLevelCapabilitiesCard: React.FC<TrialLevelCapabilitiesCardProps> = ({
  capabilityList: capabilities,
  displayCapabilities,
  handleUpdateScenarioCapability,
}) => {
  const [selectedDctCapabilities, setSelectedDctCapabilities] = useState<SelectedTrialLevelCapability[]>(displayCapabilities);
  const renderSelectedCapability = (selectedCapabilities: SelectedTrialLevelCapability[]) => {
    const capabilities = selectedCapabilities;
    return capabilities.map((selectedDctCapability: SelectedTrialLevelCapability, index) => (
      <Circle key={index} style={{
        marginLeft: "10px",
        background: selectedDctCapability.color,
      }} />
    ))
  };
  const renderCapabilityList = useCallback((capabilityArray: DctCapability[]) => {
    return <CapabilityList>
      <ListTitle>DCT CAPABILITY SELECTION</ListTitle>
      {
        capabilityArray
          .map((capacity: DctCapability, index) => {
            const checkedIndex = selectedDctCapabilities
              .findIndex((selected: SelectedTrialLevelCapability) => selected.dctCapabilityId === capacity.id);
            return (
              <Row key={index}>
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
    </CapabilityList>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDctCapabilities, handleUpdateScenarioCapability, displayCapabilities]);
  return (
    <Card >
      <CardContent>
        <CapabilityRow>
          <SelectedCapabilityContainer>
            {renderSelectedCapability(displayCapabilities)}
          </SelectedCapabilityContainer>
          <Popover
            trigger="click"
            onVisibleChange={(visible) => {
              if (visible) {
                setSelectedDctCapabilities(displayCapabilities);
              }
            }}
            placement="bottomRight"
            content={renderCapabilityList(capabilities)}
          >
            <BadgesButton>
              <AddCircleOutline />
            </BadgesButton>

          </Popover>
        </CapabilityRow>
        <Title>Selected Trial Dct Capabilities</Title>
      </CardContent>
    </Card>
  );
};
const Card = styled(MuiCard)({
  width: "210px",
  height: "125px",
  marginRight: "20px",
})
const CardContent = styled(MuiCardContent)({
  padding: "14px 18px",
});
const CapabilityRow = styled(Grid)({
  fontSize: "2.375rem",
  height: "3.125rem",
  color: "#000000",
  lineHeight: "2.875rem",
  display: "flex",
  alignItems: "center",
});
const Title = styled(Typography)({
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.6)",
  lineHeight: "1rem",
  letterSpacing: "0.063rem",
  textTransform: "uppercase",
});
const SelectedCapabilityContainer = styled(Grid)({
  width: "705px",
  display: "flex",
  flexWrap: "wrap",
});
const Circle = styled("div")({
  width: "20px",
  height: "20px",
  borderRadius: "10px",
  marginLeft: "10px",
});
const BadgesButton = styled(IconButton)({
  alignSelf: "start"
});
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
const RadioContainer = styled(Grid)({
  display: "flex",
  width: "70px",
  alignItems: "center",
  justifyContent: "flex-start",
});
export default TrialLevelCapabilitiesCard;
