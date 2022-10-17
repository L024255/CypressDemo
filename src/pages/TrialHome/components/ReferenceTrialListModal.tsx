import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  styled,
  Checkbox,
  Tooltip,
} from "@material-ui/core"
import ReactDataGrid from '@inovua/reactdatagrid-community'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import '@inovua/reactdatagrid-community/index.css'

import "./ReferenceTrialListModal.css"
import CustomBarChart from "./CustomBarChart";
import { Close } from "@material-ui/icons";
import CustomLoading from "../../../components/CustomLoading/CustomLoading";

export interface ReferenceTableDataType {
  id: string,
  trialId: string,
  includeTrial: boolean,
  studyTitle: string,
  sponsor: string,
  status: string,
  pediatric: string,
  date: string,
  moa: string,
  roa: string
}
export interface StatisticDataType {
  sponsor: {
    itemName: string;
    itemValue: any;
    indicator?: string;
  }[];
  date: {
    itemName: string;
    itemValue: any;
    indicator?: string;
  }[];
}

export interface TableFilterType {
  sponsor: any[];
  status: any[];
  pediatric: any[];
  date: any[];
  moa: any[];
  roa: any[];
}

interface ReferenceTrialListModalProps {
  open: boolean;
  tableLoading: boolean,
  tableData: ReferenceTableDataType[],
  statisticData: StatisticDataType,
  title: any;
  tableFilter: TableFilterType,
  onClose: () => void;
  handleFilterChange: (filters: { name: string, value: any[] }[]) => void;
  handleUpdateReferenceTrial: () => void;
  handleUpdateCheckbox: (id: string) => void;
}
/**
 * 
 * @returns 
 */
const ReferenceTrialListModal: React.FC<ReferenceTrialListModalProps> = ({
  open,
  tableLoading,
  title,
  tableFilter,
  tableData,
  statisticData,
  onClose,
  handleFilterChange,
  handleUpdateReferenceTrial,
  handleUpdateCheckbox
}) => {
  const filterTypes: any = Object.assign(
    {},
    ReactDataGrid.defaultProps.filterTypes,
    {
      multiselect: {
        name: 'multiselect',
        operators: [
          {
            name: 'multiselect',
            fn: ({ value, filterValue, data }: any) => {
              if (filterValue && filterValue.length > 0) {
                const index = filterValue.findIndex((item: any) => item === value);
                return index > -1;
              }
              return true;
            }
          }
        ]
      }
    });
  const defaultFilterValues: any[] = [
    { name: 'sponsor', operator: 'inlist', type: 'select' },
    { name: 'status', operator: 'inlist', type: 'select' },

    { name: 'pediatric', operator: 'inlist', type: 'select' },
    { name: 'date', operator: 'inlist', type: 'select' },
    { name: 'moa', operator: 'inlist', type: 'select' },
    { name: 'roa', operator: 'inlist', type: 'select' },
  ];
  const columns = [
    {
      name: 'trialId',
      header: <Tooltip title="TRIAL IDENTIFIER"><TableHeaderLabel>TRIAL IDENTIFIER</TableHeaderLabel></Tooltip>,
      defaultFlex: 2,
      render: ({ value, data }: any) =>
        <Tooltip title={value}><label style={data.includeTrial ? { color: "red" } : {}}>{value}</label></Tooltip>
    },
    {
      name: 'includeTrial',
      header: <Tooltip title="INCLUDE TRIAL"><TableHeaderLabel>INCLUDE TRIAL</TableHeaderLabel></Tooltip>,
      defaultFlex: 1,
      type: 'boolean',
      render: ({ value, data }: any) => {
        return value ? <Checkbox checked onClick={() => {
          handleUpdateCheckbox(data.id);
        }} /> :
          <DisabledCheck
            onClick={() => {
              handleUpdateCheckbox(data.id);
            }}
          />
      }
    },
    {
      name: 'studyTitle',
      header: <Tooltip title="STUDY TITLE"><TableHeaderLabel>STUDY TITLE</TableHeaderLabel></Tooltip>,
      defaultFlex: 3,
      render: ({ value }: any) => <Tooltip title={value}><label>{value}</label></Tooltip>
    },
    {
      name: "sponsor",
      header: <Tooltip title="SPONSOR"><TableHeaderLabel>SPONSOR</TableHeaderLabel></Tooltip>,
      defaultFlex: 3,
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: tableFilter.sponsor,
      },
      render: ({ value }: any) => <Tooltip title={value}><label>{value}</label></Tooltip>
    },
    {
      name: "status",
      header: <Tooltip title="STATUS"><TableHeaderLabel>STATUS</TableHeaderLabel></Tooltip>,
      defaultFlex: 3,
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: tableFilter.status,
      },
      render: ({ value }: any) => <Tooltip title={value}><label>{value}</label></Tooltip>
    },
    {
      name: "pediatric",
      header: <Tooltip title="PEDIATRIC"><TableHeaderLabel>PEDIATRIC</TableHeaderLabel></Tooltip>,
      defaultFlex: 3,
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: tableFilter.pediatric,
      },
      render: ({ value }: any) => <Tooltip title={value}><label>{value}</label></Tooltip>
    },
    {
      name: "date",
      header: <Tooltip title="DATE"><TableHeaderLabel>DATE</TableHeaderLabel></Tooltip>,
      defaultFlex: 3,
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: tableFilter.date,
      },
      render: ({ value }: any) => <Tooltip title={value}><label>{value}</label></Tooltip>
    },
    {
      name: "moa",
      header: <Tooltip title="MECHANISM OF ACTION"><TableHeaderLabel>MECHANISM OF ACTION</TableHeaderLabel></Tooltip>,
      defaultFlex: 3,
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: tableFilter.moa,
      },
      render: ({ value }: any) => <Tooltip title={value}><label>{value}</label></Tooltip>
    },
    {
      name: "roa",
      header: <Tooltip title="ROUTE OF ADMINISTRATION"><TableHeaderLabel>ROUTE OF ADMINISTRATION</TableHeaderLabel></Tooltip>,
      defaultFlex: 3,
      filterEditor: SelectFilter,
      filterEditorProps: {
        multiple: true,
        wrapMultiple: false,
        dataSource: tableFilter.roa,
      },
      render: ({ value }: any) => <Tooltip title={value}><label>{value}</label></Tooltip>
    },
  ];
  return (
    <>
      <CustomLoading open={tableLoading} />
      <Dialog
        maxWidth="lg"
        open={open}
        onClose={onClose}
      >
        <Header>
          <DialogTitle id="alert-dialog-title" style={{ width: "1200px" }}>
            {title}
          </DialogTitle>
          <CloseIcon
            tabIndex={0}
            onClick={() => { onClose && onClose() }}
          />
        </Header>
        <DialogContent style={{ width: "1280px" }}>
          <GraphContainer container>
            <GraphContainerItem item xs={6}>
              <CustomBarChart
                style={{
                  minWidth: "500px"
                }}
                title="BY SPONSOR"
                data={statisticData.sponsor}
              />
            </GraphContainerItem>
            <GraphContainerItem item xs={6}>
              <CustomBarChart
                style={{
                  minWidth: "500px"
                }}
                title="BY DATE"
                data={statisticData.date}
              />
            </GraphContainerItem>
          </GraphContainer>
          <TableContainer>
            <TableTitle>REFERENCE TRIALS</TableTitle>
            <ReactDataGrid
              showColumnMenuTool={false}
              style={{
                minHeight: "350px"
              }}
              filterTypes={filterTypes}
              sortable={false}
              columns={columns}
              dataSource={tableData}
              defaultFilterValue={defaultFilterValues}
              pagination="local"
              onFilterValueChange={(filterValues) => {
                const filters = filterValues?.map((obj: any) => {
                  return {
                    name: obj.name,
                    value: obj.value || []
                  }
                }) || [];
                handleFilterChange(filters);
              }}
              defaultLimit={7}
            />
          </TableContainer>
        </DialogContent>
        <DialogActions style={{ padding: "30px" }}>
          <BackToTrialButton
            variant="contained"
            color="primary"
            onClick={() => {
              // const includedReferenceTrials = tableData.filter((row) => row.includeTrial).map((row) => row.id);
              handleUpdateReferenceTrial();
            }}
          >
            Save selections
          </BackToTrialButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
const GraphContainer = styled(Grid)({
  marginBottom: "20px"
});
const GraphContainerItem = styled(Grid)({})
const TableContainer = styled(Grid)({
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14);",

})
const TableTitle = styled(Grid)({
  padding: "10px",
  fontSize: "12px",
  color: "#666"
});
const TableHeaderLabel = styled("label")({
  fontSize: "12px",
  color: "#666",
  fontWeight: 500,
})
const BackToTrialButton = styled(Button)({
  borderRadius: "3rem",
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  lineHeight: "1.313rem",
  letterSpacing: "normal",
  color: "#FFF",
  width: "15rem",
  height: "2.5rem",
});
const DisabledCheck = styled("div")({
  width: "14px",
  height: "14px",
  background: "#D5D2CA",
  borderRadius: "2px",
  cursor: "pointer",
});
const Header = styled(Grid)({
  color: "#252525",
  fontSize: 30,
  letterSpacing: "0.15px",
  marginTop: "1rem",
  width: "100%",
  display: "flex",
  alignItems: "center"
});
const CloseIcon = styled(Close)(({ theme }) => ({
  borderRadius: 20,
  outline: "none",
  backgroundColor: theme.palette.grey[200],
  color: "#fff",
  cursor: "pointer",
  float: "right",
  position: "relative",
  bottom: "10px",
  left: "20px",
  fontSize: "25px",
}));
export default ReferenceTrialListModal;