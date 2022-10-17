import { SoaActivityModel } from "../../type/SoaActivity";

export interface TableColumnType {
  id: string;
  scenarioId: string;
  soaPeriodId: any;
  visitNumber: any;
  visitId: string;
  columnNumber: number;
  weekNum: number;
  intervalTolerance: number;
  detail: string;
  alias: string;
}
export interface TableRecordType {
  key: any;
  activityId?: any;
  groupName?: string;
  itemName?: string;
  visitData?: {
    id: any;
    visitNumber: any;
    weekNumber: any;
    scenarioId: any;
    soaPeriod: any;
    intervalTolerance: any;
    alias: any;
    detail: any;
  }[]; // soavisits
  soaActivityId?: any;
  isChild?: boolean;
  parentId?: any;
  standardComment?: any;
  taxonomyId?: any;
  isAction?: boolean;
  scenarioId?: any;
  categoryId?: any;
}
export interface VisitGroupType {
  cateoryId: any;
  categoryName: any;
  activities: SoaActivityModel[]
}
export interface ColumnGroupType { 
  key: any;
  groupName: any;
  periodId: any;
  scenarioId: any;
  visitsCount: any;
  columns: TableColumnType[];
}