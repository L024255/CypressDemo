import { ActivityModel } from "./Activity";

export interface SoaActivityModel {
  activityId: string;
  id: string;
  name?: string;
  soaVisits: any[];
  scenarioId: string;
  endpointId: string;
  activity: ActivityModel;
  parentId?: string;
  soaTaxonomyId?: any;
  soaTaxonomy: {
    code: string;
    name: string;
    isParent?: boolean;
    showChildren?: any;
    standardComment?: string;
    activityCost: any;
    category: any;
    activityCategoryId?: string;
  };
  rationale?: string;
}

export interface SoaTaxonomyModel {
  id: number;
  code: string;
  mapping: string;
  name: string;
  category: string;
  activityCost: any;
  activityCategoryId?: any;
};
