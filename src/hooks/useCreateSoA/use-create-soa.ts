import { MutationByString } from "../../api/apollo";
export interface CreateSoAInput {
  id: String;
}
export interface AddCustomSoAInput {
  input: {
    scenarioId: string,
    activityCategoryId: string,
    cost: number,
    userDefinedActivityName: string,
  }
}
export const useCreateSoA = () => {
  const CREATE_SCENARIO_SOA = `
    mutation Mutation($id: String!) {
      createSoa(id: $id) {
        id
      }
    }
  `;
  const CREATE_CUSTOM_SCENARIO_SOA = `
    mutation createUserDefinedActivities ($input: [UserDefinedActivityInput]) {
      createUserDefinedActivities (input: $input) {
        id
      }
    }
  `
  const [createSoa] = MutationByString(CREATE_SCENARIO_SOA);
  const [createUserDefinedActivities] = MutationByString(CREATE_CUSTOM_SCENARIO_SOA);
  const initialScenarioSoA = (variables: CreateSoAInput) => {
    return createSoa({ variables });
  };
  const addCustomScenarioSoA = (variables: AddCustomSoAInput) => {
    return createUserDefinedActivities({ variables });
  }
  return { initialScenarioSoA, addCustomScenarioSoA };
};
