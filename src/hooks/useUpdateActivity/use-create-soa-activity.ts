import { MutationByString } from "../../api/apollo";
export interface CreateSoaActivitiesInput {
  input: {
    id?: string;
    scenarioId: string;
    endpointId?: string;
    soaTaxonomyId?: string;
    activityId?: string;
  }[];
}
export const useCreateSoAActivity = () => {
  const CREATE_SOA_ACTIVITIES = `
    mutation createSoaActivities ($input: [SoaActivityInput]) {
      createSoaActivities (input: $input) {
        id
        scenarioId
        activityId
        soaTaxonomyId
      }
    }
  `;
  const [createSoaActivities] = MutationByString(CREATE_SOA_ACTIVITIES);
  const createSoaActivity = (inputs: CreateSoaActivitiesInput) => {
    return createSoaActivities({ variables: inputs });
  };
  return { createSoaActivity };
};
