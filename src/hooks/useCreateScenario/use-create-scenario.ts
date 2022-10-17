import { MutationByString } from "../../api/apollo";
export interface CreateScenarioInputType {
  input: {
    trialWorkspaceId: string;
    name: string;
    description: string;
  };
}
export const useCreateScenario = () => {
  const CREATE_SCENARIO = `
    mutation createScenario ($input: ScenarioInput!) {
      createScenario (input: $input) {
          id
      }
    }
  `;
  const CLONE_SCENARIO = `
    mutation cloneScenario ($id: String!, $name: String!) {
      cloneScenario (id: $id, name: $name) {
        id
      }
    }
  `;
  const [createScenario] = MutationByString(CREATE_SCENARIO);
  const [cloneScenario] = MutationByString(CLONE_SCENARIO);
  const createNewScenario = (variables: CreateScenarioInputType) => {
    return createScenario({ variables });
  };
  const cloneNewScenario = (variables: { id: string, name?: any }) => {
    return cloneScenario({ variables });
  }
  return { createNewScenario: createNewScenario, cloneNewScenario };
};
