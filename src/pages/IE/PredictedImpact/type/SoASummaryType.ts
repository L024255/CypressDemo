export interface SoASummaryType {
  totalCost?: any;
  historicalTotalCost?: any;
  mappedActivities?: any;
  tertiles?: any[];
  totalActivities: any;
  activities: {
    id: any;
    rationale: any;
    endpointId: any;
    scenarioId: any;
    activityId: any;
    activity: {
      id: string;
      name: any;
      userDefined: any;
      cost: any;
      activityCategoryId: any;
      activityCategory: {
        id: any;
        name: any;
      };
    };
    soaTaxonomyId: any;
    soaTaxonomy: {
      code: any;
      mapping: any;
      name: any;
      category: any;
      activityCost: any;
      isParent: any;
      activityCategoryId: any;
      dataVersionId: any;
      activityCategory: {
        id: any;
        name: any;
      };
      dataVersion: {
        id: any;
        name: any;
      };
    };
    soaVisits: {
      id: any;
      visitNumber: any;
      scenarioId: any;
      soaPeriodId: any;
      soaPeriod?: {
        id: string;
        name: string;
      }
    }[];
  }[];
}