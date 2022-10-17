import { MutationByString } from "../../api/apollo";
export interface CreateEndpointInputType {
  input: {
    id?: string;
    scenarioId?: string;
    trialWorkspaceId?: string;
    endpointCategoryId: string;
    name: string;
    addToScenarioId?: string;
  }[];
}
export const useCreateEndpoints = () => {
  const CREATE_ENDPOINTS = `
    mutation createEndpoints ($input: [EndpointInput]) {
      createEndpoints (input: $input) {
        id
        name
      }
    }
  `;
  const UPDATE_ENDPOINTS = `
    mutation updateEndpoints ($input: [EndpointInput]) {
      updateEndpoints (input: $input) {
        id
        name
      }
    }
  `;
  const DELETE_ENDPOINTS = `
    mutation deleteEndpoints ($ids: [String]) {
      deleteEndpoints (ids: $ids)
    }
  `
  const [CreateEndpoints] = MutationByString(CREATE_ENDPOINTS);
  const [UpdateEndpoints] = MutationByString(UPDATE_ENDPOINTS);
  const [DeleteEndpoints] = MutationByString(DELETE_ENDPOINTS);
  const createEndpoints = (inputs: CreateEndpointInputType) => {
    return CreateEndpoints({ variables: inputs });
  };
  const updateEndpoints = (inputs: CreateEndpointInputType) => {
    return UpdateEndpoints({ variables: inputs });
  };
  const deleteEndpoints = (ids: String[]) => {
    return DeleteEndpoints({ variables: { ids } });
  }
  return { createEndpoints, updateEndpoints, deleteEndpoints };
};
