import { CriteriaCategoryModel } from "./CriteriaCategory";
export interface CriteriaModel {
  id: string;
  name: string;
  min: string;
  max: string;
  equal: string;
  tempModifier: string;
  unit: string;
  userDefined: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  category: string;
  criteriaCategoryId: string;
  criteriaCategory: CriteriaCategoryModel;
}
