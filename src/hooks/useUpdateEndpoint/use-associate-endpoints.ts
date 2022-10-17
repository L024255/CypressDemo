import { MutationByString } from "../../api/apollo";
export interface AssociateEndpointsInputType {
  id: string;
}
export const useAssociateEndpoints = () => {
  const ASSOCIATE_ENDPOINTS = `
    mutation associateEndpoints ($id: String) {
      associateEndpoints (id: $id) {
        id
        rationale
        createdAt
        updatedAt
        deletedAt
        endpointId
        scenarioId
        activityId
      }
    }
  `;
  const [associateEndpoints] = MutationByString(ASSOCIATE_ENDPOINTS);
  const autoAssociateEndpoins = (input: AssociateEndpointsInputType) => {
    return associateEndpoints({ variables: input });
  };
  return { autoAssociateEndpoins };
};
