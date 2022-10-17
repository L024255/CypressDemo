import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  styled,
  Button,
  Slider,
  Typography,
  Tooltip,
  withStyles,
} from "@material-ui/core";
// import CircleProgressBar from "../../../components/CustomCircleProgressBar/CircleProgressBar";

interface OptionScenarioInfoCardProps {
  title: string;
  avatar: React.ReactNode;
  optionName: string;
  optionValue: number;
  style?: any;
  progressData?: any;
  handleViewScenario?: () => void;
}
interface Props {
  children: React.ReactElement;
  open: boolean;
  value: number;
}
const ValueLabelComponent = ({ children, open, value }: Props) => {
  return (
    <SliderBarTip
      open={open}
      title={value}
      placement="top"
      style={{ color: "#222" }}
    >
      {children}
    </SliderBarTip>
  );
};
const OptionScenarioInfoCard: React.FC<OptionScenarioInfoCardProps> = ({
  title,
  avatar,
  optionName,
  optionValue,
  style,
  progressData,
  handleViewScenario,
}) => {
  return (
    <InfoCard style={style}>
      <Header title={title} avatar={avatar} />
      <CardContent>
        {progressData.map((data: any) => (
          <ProgressSliderContainer>
            <SliderTitle>
              {data.title}:{" "}
              <DegreeContainer
                className={data.degree ? data.degree.toLowerCase() : ""}
              >
                {data.degree}
              </DegreeContainer>
            </SliderTitle>
            <ProgressSlider
              disabled
              defaultValue={data.value}
              valueLabelDisplay="on"
              valueLabelFormat={data.format}
              marks={[
                {
                  value: data.historicalAverage,
                  label: `HISTORICAL AVERAGE: ${data.historicalDisplay}`,
                },
              ]}
              ValueLabelComponent={ValueLabelComponent}
            />
          </ProgressSliderContainer>
        ))}
        <ButtonContainer>
          <ViewScenarioButton variant="outlined" onClick={handleViewScenario}>
            View Scenario
          </ViewScenarioButton>
        </ButtonContainer>
      </CardContent>
    </InfoCard>
  );
};

const InfoCard = styled(Card)({ width: "100%" });
const Header = styled(CardHeader)({
  borderBottom: "1px solid rgba(165, 157, 149, 0.3)",
  display: "flex",
  alignItems: "center",
  "&& .MuiCardHeader-avatar": {
    marginRight: "0.375rem",
  },
  "&& .MuiCardHeader-content": {
    color: "rgba(0, 0, 0, 0.6)",
    lineHeight: "1rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
});
// const ProgressBarContainer = styled(Grid)({});
const ProgressSliderContainer = styled(Grid)({
  marginTop: "10px",
  marginBottom: "18px",
  paddingLeft: "16px",
  paddingRight: "16px",
  textAlign: "center",
});
const ProgressSlider = styled(Slider)({
  marginTop: "30px",
  "&& .MuiSlider-rail": {
    background:
      "linear-gradient(63deg, #FAB8B3 0%, #FAC4AC 25%, #FDE996 56%, #C7F3CF 82%, #C7F3D0 100%)",
    borderRadius: "5px",
    opacity: 0.69,
  },
  "&& .MuiSlider-track": {
    background: "transparent",
  },
  "&& .MuiSlider-thumb": {
    width: "0.75rem",
    height: "0.75rem",
    marginTop: "-0.313rem",
    background: "#FFFFFF",
    boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.1)",
    border: "0px solid #D5D2CA",
  },
  "& .MuiSlider-mark": {
    width: "12px",
    height: "12px",
    background: "#D3D3CA",
    boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.1)",
    border: "0px solid #D5D2CA",
    borderRadius: "12px",
    top: "9px",
  },
  "& .MuiSlider-markLabel": {
    width: "107px",
    fontSize: "10px",
    color: "#82786F",
    lineHeight: "14px",
    letterSpacing: "1px",
    whiteSpace: "normal",
  },
});
const SliderBarTip = withStyles({
  tooltip: {
    backgroundColor: "transparent",
    color: "#2D2D2D",
    fontSize: "1.125rem",
    lineHeight: "1.375rem",
    position: "relative",
    top: "0.625rem",
  },
})(Tooltip);
const SliderTitle = styled(Typography)({
  fontSize: "0.563rem",
  color: "#82786F",
  lineHeight: "1rem",
  textTransform: "uppercase",
  textAlign: "left",
});
const ButtonContainer = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
});
const ViewScenarioButton = styled(Button)({
  width: "195px",
  height: "38px",
  borderRadius: "20px",
  borderWidth: "1px !important",
  fontWeight: 500,
  padding: "6px 32px",
  backgroundColor: "#FFF",
  lineHeight: "1.188rem",
});
const DegreeContainer = styled("label")({
  "&.fair": {
    color: "#FFA900",
  },
  "&.good": {
    color: "#00AF3F",
  },
  "&.poor": {
    color: "#D52B1E",
  },
});
export default OptionScenarioInfoCard;
