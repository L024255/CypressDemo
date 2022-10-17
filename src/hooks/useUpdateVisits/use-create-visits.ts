import { MutationByString } from "../../api/apollo";
export interface CreateSoaVisitsnput {
  input: {
    id?: string;
    scenarioId: string;
    soaPeriodId: string;
    visitNumber: string;
    weekNum: number;
  }[];
}
export const useCreateVisits = () => {
  const CREATE_SOA_VISITS = `
    mutation createSoaVisits ($input: [SoaVisitInput]) {
        createSoaVisits (input: $input) {
            id
            visitNumber
            scenarioId
        }
    }
  `;
  const [createSoaVisits] = MutationByString(CREATE_SOA_VISITS);
  const createSoaVisit = (inputs: CreateSoaVisitsnput) => {
    return createSoaVisits({ variables: inputs });
  };
  return { createSoaVisit };
};
