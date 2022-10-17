import { MutationByString } from "../../api/apollo";
export interface CreateSoaActivityVisitsInput {
  input: {
    soaActivityId: string;
    soaVisitId: string;
  }[];
};
export interface SoaVisitInput {
  id: string,
  scenarioId: any,
  soaPeriodId: any,
  visitNumber: any,
  weekNum?: any,
  intervalTolerance?: any,
  alias?: any,
  detail?: any,
};
export interface DeleteSoaActivityVisitsInput {
  input: {
    soaActivityId: string;
    soaVisitId: string;
  }[];
}
export interface UpdateSoaActivityVisitsDctCapabilityInputObjectType {
  soaActivityId: string;
  dctCapabilities: {
    dctCapabilityId: any,
    status: string,
  }[];
  soaVisitId: string;
}
// dctCapabilities is an array combine with capability.id
interface UpdateSoaActivityVisitsDctCapabilityInput {
  input: UpdateSoaActivityVisitsDctCapabilityInputObjectType[]
}
export const useSoaActivityVisits = () => {
  const CREATE_SOA_ACTIVITY_VISITS = `
    mutation createSoaActivityVisits ($input: [SoaActivityVisitInput]) {
      createSoaActivityVisits (input: $input) {
        id
        createdAt
        updatedAt
        deletedAt
        endpointId
        scenarioId
        activityId
      }
    }
  `;
  const UPDATE_SOA_VISITS = `
    mutation UpdateSoaVisits ($input: SoaVisitInput!) {
      updateSoaVisit (input: $input) {
        id
        weekNum
        intervalTolerance
        alias
        detail
      }
    }
  `;
  const DELETE_SOA_ACTIVITY_VISITS = `
    mutation deleteSoaActivityVisits ($input: [SoaActivityVisitInput]) {
      deleteSoaActivityVisits (input: $input) {
        id
      }
    }
  `;
  const UPDATE_SOA_ACTIVITY_VISITS_DCTCAPABILITY = `
    mutation UpdateSoaActivityVisits ($input: [SoaActivityVisitInput]) {
      updateSoaActivityVisits (input: $input) {
          id
      }
    }
  `;
  const [createSoaActivityVisits] = MutationByString(
    CREATE_SOA_ACTIVITY_VISITS
  );
  const [UpdateSoaVisits] = MutationByString(
    UPDATE_SOA_VISITS
  );
  const [deleteSoaActivityVisits] = MutationByString(
    DELETE_SOA_ACTIVITY_VISITS
  );
  const [UpdateSoaActivityVisits] = MutationByString(
    UPDATE_SOA_ACTIVITY_VISITS_DCTCAPABILITY
  );
  const createSoaActivityVisit = (inputs: CreateSoaActivityVisitsInput) => {
    return createSoaActivityVisits({ variables: inputs });
  };
  const updateSoaVisit = (input: SoaVisitInput) => {
    return UpdateSoaVisits({ variables: input });
  }
  const deleteSoaActivityVisit = (inputs: DeleteSoaActivityVisitsInput) => {
    return deleteSoaActivityVisits({ variables: inputs });
  };
  const updateSoaActivityVisitsDctCapability = (input: UpdateSoaActivityVisitsDctCapabilityInput) => {
    return UpdateSoaActivityVisits({ variables: input });
  }
  return { createSoaActivityVisit, updateSoaVisit, deleteSoaActivityVisit, updateSoaActivityVisitsDctCapability };
};
