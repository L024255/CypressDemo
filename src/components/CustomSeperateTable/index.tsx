import React from "react";
import {
  Grid,
  styled,
  Typography,
} from "@material-ui/core";
import { Popover } from "antd";
import "antd/dist/antd.css";
import { GridTable } from "./GridTable";

interface SeperateTableProps {
  tableId: string;
  title: string;
  action?: any;
  leftColumns: any[];
  rightColumns?: any[];
  leftData: any[];
  rightData?: any[];
  leftStyle?: any;
  rightStyle?: any;
  style?: React.CSSProperties;
  dotColumnindex?: number;
  hasLastColorRow?: boolean;
  hideTableLine?: boolean;
  hightLightRows?: any[];
}
const SeperateTable: React.FC<SeperateTableProps> = ({
  tableId,
  title,
  action,
  leftColumns,
  rightColumns,
  leftStyle,
  rightStyle,
  rightData,
  style,
  leftData,
  dotColumnindex = 0,
  hasLastColorRow,
  hideTableLine,
  hightLightRows,
}) => {
  const renderDotByColumnVal = (val: any, index: number, explain?: string) => {
    if (index === dotColumnindex) {
      const content = <TipContent variant="body1">{explain}</TipContent>;
      return explain !== "" && explain !== undefined ? (
        <>
          <Popover content={content} placement="bottomLeft">
            {val}
          </Popover>
        </>
      ) : (
        <>{val}</>
      );
    }
    return val;
  };
  const columns = {
    left: leftColumns.map((column: any) => {
      let scale = leftColumns.length > 1 ? 12 / leftColumns.length : 12;
      if (column.scale) {
        scale = column.scale;
      }
      return {
        title: column.label,
        scale
      }
    }),
    right: rightColumns?.map((column: any) => {
      let scale = rightColumns.length > 1 ? 12 / rightColumns.length : 12;
      if (column.scale) {
        scale = column.scale;
      }
      return {
        title: column.label,
        scale: scale
      }
    }) || [],
  };
  const data: any = leftData.map((row: any[], rowIndex) => {
    return {
        left: row.map((column: any) => {
          let val = column;
          if (column === "true") {
            val = "Yes";
          } else if (column === "false") {
            val = "No";
          }
          return val;
        }),
        right: rightData ? rightData[rowIndex]?.map((column: any, columnIndex: any) => {
        let val = column.val;
        if (column.val === "true") {
          val = "Yes";
        } else if (column.val === "false") {
          val = "No";
        }
         const content = renderDotByColumnVal(val, columnIndex, column.explain); 
         return content;
        }) : [],
      };
  });
  return (
    <Container container style={style}>
      <Row container justify="space-between">
        <Title>{title}</Title>
        {action}
      </Row>
      <Row container justify="space-between">
        <GridTable
          columns={columns}
          data={data}
          leftStyle={leftStyle}
          rightStyle={rightStyle}
          hideTableLine={hideTableLine}
          hightLightRows={hightLightRows}
        />
      </Row>
    </Container>
  );
};
const Container = styled(Grid)({});
const Row = styled(Grid)({
  marginTop: "1.5rem",
});
const Title = styled(Typography)({
  fontSize: "1rem",
  color: "#82786F",
  lineHeight: "1.188rem",
});
const TipContent = styled(Typography)({
  maxWidth: "341px",
  padding: "10px",
  fontSize: "12px",
  color: "#2D2D2D",
  lineHeight: "14px",
});
export default SeperateTable;
