export interface GroupedSoAActivityType {
  categoryId: string;
  categoryName: string;
  activities: {
    id: any;
    activityId: any;
    activityName: string;
    endpointId: string;
    rationale: string;
    cost: string;
    frequency: string;
    soaVisitsCount: any;
  }[];
}
