export interface HistoricalActivityType {
  avgActivities: {
    min: any;
    max: any;
  }[];
  avgVisits: {
    min: any;
    max: any;
  }[];
  activities: {
    id: any;
    name: any;
    userDefined: any;
    cost: any;
    activityCategoryId: any;
    activityCategory: {
      id: any;
      name: any;
    };
    appears: any;
    frequency: any;
    visitFrequency: any;
  }[];
}