export interface ScenarioCriteriaModle {
  id?: string;
  name?: string;
  scenarioId: string;
  criterionId?: string;
  type: string;
  min?: any;
  max?: any;
  equal?: any;
  tempModifier?: string;
  unit?: string;
  order?: number;
  categoryId?: string;
  criteriaCategoryId?: string;
  userDefinedCriteriaName?: string;
}

export interface ScenarioCriteriaModlePredicted {
  id?: string;
  name?: string;
  scenarioId: string;
  criterionId?: string;
  type: string;
  min?: any;
  max?: any;
  equal?: any;
  tempModifier?: string;
  unit?: string;
  categoryId?: string;
  criteriaCategoryId?: string;
  criterion: any;
  userDefinedCriteriaName?: string;
}
