import React from "react";
import { makeStyles } from "@material-ui/core/styles";

interface CircleProgressBarProps {
  value: number;
  title?: string;
  historicalValue?: number;
  description?: string;
  diameter?: number;
  colors?: string[];
}
const useStyles = makeStyles({
  root: {
    textAlign: "center",

    "&& #svgcontainer": {
      position: "relative",
      width: (props: any) => `${props.diameter}px`,
    },

    "&& #svg": {
      position: "relative",
      transform: "rotate(90deg)",
    },
    "&& #progressbg": {
      zIndex: 0,
      position: "absolute",
      top: 0,
      boxShadow: "5px 5px 5px 5px #333",
      stroke: "#fbfbfb",
    },
    "&& #progress": {
      strokeDashoffset: (props: any) => props.offset,
      transition: "stroke-dashoffset 1s ease",
      zIndex: 1,
      position: "absolute",
      strokeLinecap: "round",
      top: 0,
    },
    "&& #progressbar-marker": {
      fill: (props: any) => props.strokeColor,
      transformOrigin: "center",
      transform: (props: any) => `rotate(${props.rotate})`,
      transition: "transform 1s ease",
    },
    "&& #history-progressbar-marker": {
      fill: "#D3D3CA",
      // fill: "#fff",
      // boxShadow: "5px 5px 5px 5px #333",
      // border: "3px solid #D5D2CA",
      transformOrigin: "center",
      transform: (props: any) => `rotate(${props.historicalRotate})`,
      transition: "transform 1s ease",
    },
    "&& #slidervalue": {
      width: "70%",
      textAlign: "center",
      position: "absolute",
      top: "40%",
      left: "16%",
      transition: "color 1s linear",
    },
    "&& #title": {
      fontSize: "2.125rem",
      lineHeight: "2.25rem",
      fontWeight: 500,
      color: "#2D2D2D",
      textTransform: "uppercase",
    },
    "&& #description": {
      fontSize: "0.563rem",
      lineHeight: "1.5",
      color: "#82786F",
      textTransform: "uppercase",
      marginTop: "4px",
    },
    "&& #value": {
      fontSize: "50px",
      fontWeight: 500,
      color: "#000",
      textTransform: "uppercase",
    },
  },
});
const getOffsetByValue = (value: number, diameter: number) => {
  const progress_in_percent = value * (diameter / 300);
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress_in_pixels =
    (circumference * (100 - progress_in_percent)) / 100;
  const offset = progress_in_pixels.toFixed(2) + "px";
  return offset;
};
export const getTransformRotateByValue = (value: number) => {
  const rotate = (value / 100) * 360;
  return `${rotate}deg`;
};

export const getStrokeColorByValue = (value: number, colors?: string[]) => {
  if (value / 100 <= 1 / 3) {
    return colors && colors.length > 0 ? colors[0] : "#D52B1E"
    // return "#D52B1E";
  }
  if (value / 100 <= 2 / 3) {
    return colors && colors.length > 1 ? colors[1] : "#F7D355"
    // return "#F7D355";
  }
  return colors && colors.length > 2 ? colors[2] : "#00AF3F"
  // return "#00AF3F";
};

const renderBar = (
  value: number,
  classes: any,
  dotColor: string,
  title?: string,
  description?: string,
  diameter: number = 300,
  historicalValue?: number, 
) => {
  return (
    <div className={classes.root}>
      <div id="svgcontainer">
        <svg height={diameter} width={diameter} id="svg">
          <linearGradient id="gradient">
            <stop id="stop1" offset="0%" stopColor="red" stopOpacity="0.5" />
            <stop
              id="stop2"
              offset="50.00%"
              stopColor="yellow"
              stopOpacity="0.5"
            />
            <stop id="stop4" offset="99%" stopColor="green" stopOpacity="0.5" />
          </linearGradient>
          <circle
            id="progressbg"
            cx={diameter / 2}
            cy={diameter / 2}
            r={diameter * 0.4}
            strokeWidth="7"
            fill="transparent"
            strokeDasharray="753.9822368615503"
          />
          <circle
            id="progress"
            cx={diameter / 2}
            cy={diameter / 2}
            r={diameter * 0.4}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="753.9822368615503"
            stroke="url(#gradient)"
          />
          <circle
            id="progressbar-marker"
            r="10"
            fill={dotColor}
            cx={diameter * 0.9}
            cy={diameter / 2}
          />
          {historicalValue && (
            <circle
            id="history-progressbar-marker"
            r="10"
            fill={dotColor}
            cx={diameter * 0.9}
            cy={diameter / 2}
          />
          )}
        </svg>
        <div id="slidervalue">
          {title && <div id="title">{title}</div>}
          <div id="description">{description}</div>
        </div>
      </div>
    </div>
  );
};

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  value,
  title,
  description,
  diameter = 300,
  historicalValue,
  colors,
}) => {
  const offset = getOffsetByValue(value, diameter);
  const rotate = getTransformRotateByValue(value);
  const historicalRotate = historicalValue ? getTransformRotateByValue(historicalValue) : "0deg";
  const strokeColor = getStrokeColorByValue(value, colors);
  const classes = useStyles({ offset, rotate, strokeColor, diameter, historicalRotate });
  return renderBar(value, classes, strokeColor, title, description, diameter, historicalValue);
};

export default CircleProgressBar;
