export interface AggregateCriteriaModel {
  id?: string;
  name?: string;
  category?: string;
  criteria: {
    id: string;
    type: string;
    name: string;
    category: string;
    tempModifier: string;
    min: any;
    max: any;
    equal: any;
    unit: any;
    appears: string;
    freq: any;
    internal: boolean;
  }[];
}
