import { MutationByString } from "../../api/apollo";
export interface UpdateScenarioInputType {
  input: {
    id: string;
    trialWorkspaceId: string;
    name?: string;
    final?: boolean;
    notes?: string;
    description?: string;
    dctCapabilities?: string[];
  };
}
export const useUpdateScenario = () => {
  const UPDATE_SCENARIO = `
    mutation updateScenario ($input: ScenarioInput!) {
      updateScenario (input: $input) {
        id
      }
    }
  `;
  const [updateScenario] = MutationByString(UPDATE_SCENARIO);
  const UpdateScenario = (variables: UpdateScenarioInputType) => {
    return updateScenario({ variables });
  };
  return { UpdateScenario };
};
