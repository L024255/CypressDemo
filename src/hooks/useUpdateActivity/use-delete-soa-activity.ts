import { MutationByString } from "../../api/apollo";
export interface DeleteSoaActivitiesInput {
  ids: string[];
}
export const useDeleteSoAActivity = () => {
  const DELETE_SOA_ACTIVITIES = `
    mutation deleteSoaActivities ($ids: [String]) {
      deleteSoaActivities (ids: $ids)
    }
  `;
  const [deleteSoaActivities] = MutationByString(DELETE_SOA_ACTIVITIES);
  const deleteSoaActivity = (inputs: DeleteSoaActivitiesInput) => {
    return deleteSoaActivities({ variables: inputs });
  };
  return { deleteSoaActivity };
};
