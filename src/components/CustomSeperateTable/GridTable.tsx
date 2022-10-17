import React from 'react';
import { Grid, styled } from "@material-ui/core";

interface GridTableProps {
  columns: {
    left: {
      title: string, // column title.
      scale: any, // the scale of column. total scale is 12.
    }[],
    right: {
      title: string, // column title.
      scale: any, // the scale of column. total scale is 12.
    }[]
  },
  data: {
    left: any[], // left table data
    right: any[] //right table data
  }[],
  leftStyle?: any
  rightStyle?: any
  style?: any
  hideTableLine?: boolean
  hightLightRows?: any[]
}
export const GridTable: React.FC<GridTableProps> = ({
  columns,
  data,
  style,
  leftStyle,
  rightStyle,
  hideTableLine,
  hightLightRows,
}) => {
  const cellStyle = hideTableLine ? { border: "none" } : {};
  return (
    <TableContainer style={style} className="tableContainer">
      <Header className="header">
        <HeaderLeftWraper style={leftStyle}>
          <CellContainer container>
            {
              columns.left.map((column: { title: string, scale: any }, index) => {
                return (
                  <Cell item key={`left-${index}`} xs={column.scale} style={index === 0 ? { borderLeft: "none" } : cellStyle}>{column.title}</Cell>
                );
              })
            }
          </CellContainer>
        </HeaderLeftWraper>
        <HeaderRightWraper style={rightStyle}>
          <CellContainer container>
            {
              columns.right.map((column: { title: string, scale: any }, index) => {
                if (column.title) {
                  return (
                    <Cell item key={`right-${index}`} xs={column.scale} style={index === 0 ? { borderLeft: "none" } : cellStyle}>{column.title}</Cell>
                  );
                }
                return null;
              })
            }
          </CellContainer>
        </HeaderRightWraper>
      </Header>
      <Body>
        {
          data.map((row: any, rowIndex) => {
            const hightLight = hightLightRows && hightLightRows?.findIndex((index: any) => index === rowIndex) > -1;
            let leftRowStyle = leftStyle;
            let rightRowStyle = rightStyle;
            if (hightLight) {
              leftRowStyle = { ...leftStyle, backgroundColor: "rgba(213, 43, 30, 0.1)"};
              rightRowStyle = { ...rightStyle, backgroundColor: "rgba(213, 43, 30, 0.1)"};
            }
            return (
              <Row key={rowIndex} className={rowIndex % 2 !== 0 ? "row row-odd" : "row"}>
                <LeftWraper className={rowIndex === data.length - 1 ? "last" : ""} style={leftRowStyle}>
                  <CellContainer container>
                    {
                      columns.left.map((column: any, index) => {
                        return (
                          <Cell item key={`${rowIndex}-left-${index}`} xs={column.scale} style={index === 0 ? { borderLeft: "none" } : cellStyle}>
                            {row.left[index]}
                          </Cell>
                        );
                      })
                    }
                  </CellContainer>
                </LeftWraper>
                <RightWraper className={rowIndex === data.length - 1 ? "last" : ""} style={rightRowStyle}>
                  <CellContainer container>
                    {
                      columns.right.map((column: any, index) => {
                        if (row.right[index]) {
                          return (
                            <Cell item key={`${rowIndex}-right-${index}`} xs={column.scale} style={index === 0 ? { borderLeft: "none" } : cellStyle}>
                              {row.right[index]}
                            </Cell>
                          );
                        }
                        return null;
                      })
                    }
                  </CellContainer>
                </RightWraper>
              </Row>
            )
          })
        }
      </Body>
    </TableContainer>
  );
};

const TableContainer = styled("div")({
  width: "100%"
});
const Header = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(2, 3fr)",
  columnGap: "15px",
  textTransform: "uppercase",
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.4)",
  lineHeight: "1rem",
  fontWeight: 500

});
const Body = styled("div")({
  color: "#2D2D2D"
})
const Row = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(2, 3fr)",
  columnGap: "15px",

  "&.row-odd >div": {
    backgroundColor: "#F8F8F9"
  }
});

const LeftWraper = styled("div")({
  position: "relative",
  boxShadow: "3px 0px 0px 0px #ddd",
  borderLeft: "1px solid #ddd",
  gridColumn: "1",
  "&.last": {
    boxShadow: "2px 2px 2px 1px #ddd"
  }
});
const RightWraper = styled("div")({
  position: "relative",
  borderRight: "1px solid #ddd",
  boxShadow: "-3px 0px 0px 0px #ddd",
  "&.last": {
    boxShadow: "-2px 2px 2px 1px #ddd"

  }
});
const HeaderLeftWraper = styled(LeftWraper)({
  borderBottom: "1px solid #ddd",
  boxShadow: "3px -2px 3px 1px #ddd",
});
const HeaderRightWraper = styled(RightWraper)({
  borderBottom: "1px solid #ddd",
  boxShadow: "-2px -2px 1px 1px #ddd"
});
const CellContainer = styled(Grid)({
  height: "100%"
});
const Cell = styled((Grid))({
  display: "flex",
  // alignItems: "center",
  alignItems: "flex-start",
  padding: "10px",
  fontSize: "0.75rem",
  lineHeight: "1.625rem",
  // color: "#2D2D2D",
  borderLeft: "1px solid #dddddd",
});
