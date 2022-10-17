import { MutationByString } from "../../api/apollo";
export interface DeleteSoaVisitsnput {
  ids: string[];
}
export const useDeleteVisits = () => {
  const DELETE_SOA_VISITS = `
    mutation deleteSoaVisits ($ids: [String]) {
      deleteSoaVisits (ids: $ids)
    }
  `;
  const [deleteSoaVisits] = MutationByString(DELETE_SOA_VISITS);
  const deleteSoaVisit = (inputs: DeleteSoaVisitsnput) => {
    return deleteSoaVisits({ variables: inputs });
  };
  return { deleteSoaVisit };
};
