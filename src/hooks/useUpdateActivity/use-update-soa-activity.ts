import { MutationByString } from "../../api/apollo";
export interface UpdateSoaActivitiesInput {
  input: {
    id?: string;
    scenarioId: string;
    endpointId: string;
    activityId: string;
    rationale: string;
  };
}
export interface UpdateUserDefinedActivityInput {
  input: {
    id: string;
    activityCategoryId: string
  }
}
export interface UpdateUserDefinedActivityCostInput {
  input: {
    id: string;
    cost: number;
  }
};
export interface UpdateSoaTaxonomiesInput {
  input: {
    id: any;
    standardComment: string;
  }[];
}
export const useUpdateSoAActivity = () => {
  const UPDATE_SOA_ACTIVITIES = `
    mutation updateSoaActivities ($input: [SoaActivityInput]) {
      updateSoaActivities (input: $input) {
          id
          rationale
          updatedAt
          endpointId
          scenarioId
          activityId
      }
    }
  `;
  const UPDATE_USER_DEFINED_ACTIVITY = `
    mutation updateUserDefinedActivity ($input: ActivityInput!) {
      updateUserDefinedActivity (input: $input) {
          id
          activityCategoryId
      }
    }
  `;

  const UPDATE_USER_DEFINED_ACTIVITY_COST = `
    mutation updateUserDefinedActivityCost ($input: ActivityCostInput!) {
      updateUserDefinedActivityCost (input: $input) {
          id
          cost
      }
    }
  `;
  const UPDATE_SOA_TAXONIMIES = `
    mutation updateSoaTaxonomies ($input: [SoaTaxonomyInput]) {
      updateSoaTaxonomies (input: $input) {
          id
          standardComment
      }
    }
  `;

  const [updateSoaActivities] = MutationByString(UPDATE_SOA_ACTIVITIES);
  const [UpdateUserDefinedActivity] = MutationByString(UPDATE_USER_DEFINED_ACTIVITY);
  const [UpdateUserDefinedActivityCost] = MutationByString(UPDATE_USER_DEFINED_ACTIVITY_COST);
  const [UpdateSoATaxonomies] = MutationByString(UPDATE_SOA_TAXONIMIES);
  const updateSoaActivity = (inputs: UpdateSoaActivitiesInput) => {
    return updateSoaActivities({ variables: inputs });
  };
  const updateUserDefinedActivity = (input: UpdateUserDefinedActivityInput) => {
    return UpdateUserDefinedActivity({ variables: input });
  }
  const updateUserDefinedActivityCost = (input: UpdateUserDefinedActivityCostInput) => {
    return UpdateUserDefinedActivityCost({ variables: input });
  }
  const updateSoaTaxonomies = (input: UpdateSoaTaxonomiesInput) => {
    return UpdateSoATaxonomies({ variables: input });
  }
  return { updateSoaActivity, updateUserDefinedActivity, updateUserDefinedActivityCost, updateSoaTaxonomies };
};
