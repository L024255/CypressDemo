import { ActivityCategoryModel } from "./ActivityCategory";

export interface ActivityModel {
  id: string;
  name: string;
  userDefined: any;
  cost: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  appears?: string;
  frequency?: number;
  soaVisits?: any[];
  visitFrequency?: number;
  activityCategoryId: string;
  activityCategory?: ActivityCategoryModel;
  dataVersion?: any;
  parentId?: any;
  isParent?: boolean;
  isChild?: boolean;
  standardComment?: any;
}
