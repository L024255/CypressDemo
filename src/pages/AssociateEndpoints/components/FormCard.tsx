import { Grid, styled, IconButton } from "@material-ui/core";
import React, { FC } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";
import CustomSelect from "../../../components/CustomSelect";
import { GroupedSoAActivityType } from "../Types";
import SeperateTable from "../../../components/CustomSeperateTable";

interface AssociateEndpointsFormCardProps {
  groupedActivities: GroupedSoAActivityType[];
  endpoints: { id: string; name: string }[];
  totalSoaCost: number,
  updateSoAActivities: (
    activityId: string,
    endpointId: string,
    rationale: any,
    soaActivityId: any,
  ) => void;
  deleteSoAActivities: (activityId: string) => void;
}
const FormCard: FC<AssociateEndpointsFormCardProps> = ({
  groupedActivities,
  endpoints,
  totalSoaCost,
  deleteSoAActivities,
  updateSoAActivities,
}) => {
  interface TableData {
    soaActivityId: string;
    activeSelectedTitle: string;
    activeId: string;
    activeSelectedValue: any;
    approximateCost: string;
    frequency: any;
    soaVisitsCount: any;
    totalCost: any;
    totalCostPercentage: any;
    activeSelectedOptions: any[];
    selectedJustification?: string;
  }

  const handleUpdateActivity = (
    activityId: any,
    endpointId: any,
    rationale: any,
    soaActivityId: any
  ) => {
    updateSoAActivities(activityId, endpointId, rationale, soaActivityId);
  };
  const getTableDataByActivity = (
    group: GroupedSoAActivityType,
    endpoints: any[]
  ) => {
    const tableData: TableData[] = [];
    group.activities.forEach((activity: any) => {
      let activeValue = activity.endpointId;
      if (activity.endpointId === null) {
        activeValue = "none";
      } else if (activity.endpointId === undefined) {
        activeValue = "";
      } else if (endpoints.findIndex((endpint: any) => endpint.id === activity.endpointId) < 0) {
      // if endpoints dones not contain this endpoint id, it should not be selected to none.
        activeValue = "none";
      }
      const totalCostPercentage: any = totalSoaCost ? activity.totalCost / totalSoaCost * 100 : 0;
      const row: TableData = {
        activeSelectedTitle: activity.activityName || "",
        activeSelectedValue: activeValue,
        approximateCost: activity.cost,
        frequency: activity.frequency,
        activeId: activity.activityId || "",
        activeSelectedOptions: endpoints.map((endpoint) => ({
          value: endpoint.id,
          label: endpoint.name,
        })),
        soaVisitsCount: activity.soaVisitsCount,
        soaActivityId: activity.id,
        selectedJustification: activity.rationale,
        totalCost: activity.totalCost,
        totalCostPercentage,
      };
      tableData.push(row);
    });
    return tableData;
  };
  const renderTableByGroupedActivities = (
    groupedActivities: GroupedSoAActivityType[],
    endpoints: any[]
  ) => {
    return groupedActivities.map((group: GroupedSoAActivityType) => {
      const activityData = getTableDataByActivity(group, endpoints);
      return renderRelationshipTable(group.categoryName, activityData, () => { })
    });
  };
  const renderRelationshipTable = (
    title: string,
    data: TableData[],
    setData: Function
  ) => {
    const leftData: any[] = [];
    const rightData: any[] = [];
    const hightLightRows: any[] = []

    data.forEach((row: TableData, rowIndex: any) => {
      leftData.push([
        <ItemContent>
          <IconButton onClick={() => {
            deleteSoAActivities(row.soaActivityId);
          }
          }>
            <ClearIcon
              style={{
                color: "#D52B1E",
                width: "1.2rem",
                marginLeft: "10px",
                marginRight: "8px",
                cursor: "pointer",
                marginTop: "-2px",
              }}
            />
          </IconButton>
          <Content>{row.activeSelectedTitle}</Content>
        </ItemContent>
      ]);
      rightData.push([
        {
          val: (
            <CustomSelect
              value={row.activeSelectedValue}
              variant="outlined"
              className={
                row.activeSelectedValue === ""
                  ? "placeholder"
                  : ""
              }
              labelId="new-trial-detail-placeboControlled"
              disableunderline="true"
              native
              onChange={(e: any) =>
                handleUpdateActivity(
                  row.activeId,
                  e.target.value === "none" ? null : e.target.value,
                  null,
                  row.soaActivityId
                )
              }
              style={{
                background: "transparent",
                width: "290px",
                marginLeft: "12px",
                height: "32px",
                marginRight: "30px",
                // marginTop: "8px",
              }}
            >
              {row.activeSelectedOptions.map((optionObj) => (
                <option value={optionObj.value}>
                  {optionObj.label}
                </option>
              ))}
              <option value="none">None</option>
            </CustomSelect>
          )
        },
        { val: row.approximateCost !== undefined && row.approximateCost !== null ? <Cost>${row.approximateCost}</Cost> : <Cost>N/A</Cost>},
        { val: <Number>{row.soaVisitsCount}</Number> },
        { val: row.totalCost !== undefined && row.totalCost !== null ? <Cost>${row.totalCost.toFixed(0)}</Cost> : <Cost>N/A</Cost>},
        { val: <Number style={ row.totalCostPercentage >= 25 ? {color: "red"} : {}}>{row.totalCostPercentage.toFixed(0)}%</Number>},
        {
          val: (row.selectedJustification ||
            row.activeSelectedValue === "none")  ? (
              <SelectedContainer>
                <SelectBelow>
                  Select justification / rationale below:
                </SelectBelow>
                <RightItem style={{ height: "30px" }}>
                  <InputBlow>
                    <Input
                      id="outlined-basic"
                      variant="outlined"
                      defaultValue={row.selectedJustification}
                      onBlur={(e) => {
                        handleUpdateActivity(
                          row.activeId,
                          null,
                          e.target.value,
                          row.soaActivityId
                        )
                      }}
                    />
                  </InputBlow>
                </RightItem>
              </SelectedContainer>
            ) : null
        }
      ]);
      if (!row.selectedJustification && row.activeSelectedValue === "none") {
        hightLightRows.push(rowIndex)
      }
    });

    return (
      <Container>
        <SeperateTable
          tableId={`activity-endpoint-relationship-table-${title}`}
          title={title}
          leftColumns={[
            {
              label: "ACTIVITIES SELECTED"
            }
          ]}
          rightColumns={[
            { label: "Associated Endpoint", scale: 3 },
            { label: "Approximate Cost (US Data)", scale: 2 },
            { label: "Frequency of Activity Over Trial Duration", scale: 3 },
            { label: "Total Cost", scale: 2 },
            { label: "Percentage of Total SoA Cost", scale: 2 },
            { external: true }
          ]}
          leftStyle={{
            gridColumn: 1,
          }}
          rightStyle={{
            gridColumn: "2 / 34",
            borderLeft: "none",
          }}
          leftData={leftData}
          rightData={rightData}
          hideTableLine
          hightLightRows={hightLightRows}
        />
      </Container>
    )
  }
  return <>{renderTableByGroupedActivities(groupedActivities, endpoints)}</>;
};
const Input = styled(TextField)({
  width: "667px",
  marginLeft: "12px",
  height: "32px",
  marginRight: "26px",
  marginTop: "-4px",
  "& .MuiOutlinedInput-root": {
    background: "transparent",
  },
  "& .MuiInputBase-input": {
    fontSize: "12px",
  },
});
const SelectedContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column"
})
const Container = styled(Grid)({
  display: "flex",
  width: "950px",
  justifyContent: "space-between",
  marginTop: "26px",
  marginLeft: "-26px",
});
const InputBlow = styled(Grid)({
  width: "702px",
  "&> div div .MuiOutlinedInput-input": {
    height: "8px",
  },
});
const Cost = styled(Grid)({
  width: "114px",
  fontSize: "12px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
});
const Number = styled(Grid)({
  width: "172px",
  fontSize: "12px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
});
const RightItem = styled(Grid)({
  display: "flex",
  minHeight: "48px",
  lineHeight: "48px",
  "&.even": {
    backgroundColor: "#F8F8F9",
  },
  "&.none": {
    backgroundColor: "rgba(213, 43, 30, 0.1)",
  },
});
const SelectBelow = styled(Grid)({
  fontSize: "12px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
  height: "48px",
  lineHeight: "48px",
  paddingLeft: "12px",
  marginBottom: "7px",
});
const Content = styled(Grid)({
  fontFamily: "Helvetica;",
  color: "#000000;",
  marginBottom: "3px",
  fontSize: "12px",
  textOverflow: "ellipsis",
  overflow: "hidden",
  lineHeight: "1.4",
});
const ItemContent = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default FormCard;
