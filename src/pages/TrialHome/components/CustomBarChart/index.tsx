import React from "react";
import {
  Grid,
  styled,
} from "@material-ui/core";

interface CustomBarChartProps {
  title: string;
  data: {
    itemName: string;
    itemValue: number;
    indicator?: string;
  }[];
  style?: any;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  title,
  data,
  style
}) => {
  const colors = [
    "rgba(27,96,151,1)",
    "rgba(60,130,187,1)",
    "rgba(94,160,213,1)",
    "rgba(128,181,219,1)",
    "rgba(167,203,229,1)",
  ];
  return <Container style={style}>
    <TitleContainer>{title}</TitleContainer>
    <ChartContainer>
      {data.map((item, index) => {
        const backgroundColor = index < 5 ? colors[index] : colors[4];
        return (
          <Row container>
            <ItemTitle item xs={3}>
              <ItemLabel>{item.itemName}</ItemLabel>
            </ItemTitle>
            <ItemBar item xs={9}>
              <ItemBarStuff style={{ backgroundColor, width: `calc(${item.itemValue}% - 10px)`}}></ItemBarStuff>
              <ItemBarIndicator xs={1} style={{ color: backgroundColor}}>{item.indicator}</ItemBarIndicator>
            </ItemBar>
          </Row>
        )
      })}
    </ChartContainer>
  </Container>;
};
const Container = styled(Grid)({

});
const TitleContainer = styled(Grid)({
  color: "#A59D95",
  fontSize: "14px",
  fontWeight: 500
});
const ChartContainer = styled(Grid)({})
const Row = styled(Grid)({
  width: "100%",
  height: "30px",
});
const ItemTitle = styled(Grid)({
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
});
const ItemLabel = styled("span")({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: "150px",
  overflow: "hidden",
});
const ItemBar = styled(Grid)({
  padding: "5px 0",
  display: "flex",
  alignItems: "center",
});
const ItemBarStuff = styled("div")({
  height: "15px",
});
const ItemBarIndicator = styled(Grid)({
  marginLeft: "5px"
});
export default CustomBarChart;