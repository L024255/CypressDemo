import { MutationByString } from "../../api/apollo";
import { ScenarioCriteriaModle } from "../../pages/IE/Criteria/type/ScenarioCriteriaModel";
export interface CreateScenarioCriterionInput {
  input: ScenarioCriteriaModle[];
}
export interface CreateCustomScenarioCriterionInput {
  input: ScenarioCriteriaModle;
}
export interface DeleteScenarioCriterionInput {
  ids: string[];
}
export const useUpdateScenarioCriteria = () => {
  const CREATE_CUSTOM_SCENARIO_CRITERIA = `
    mutation createUserDefinedCriteria ($input: [UserDefinedCriteriaInput]) {
      createUserDefinedCriteria (input: $input) {
          id
          type
          min
          max
          equal
          tempModifier
          unit
          criterionId
          scenarioId
      }
    }
  `;
  const CREATE_SCENARIO_CRITERIA = `
    mutation createScenarioCriteria ($input: [ScenarioCriterionInput]!) {
      createScenarioCriteria (input: $input) {
          id
          type
          min
          max
          equal
          tempModifier
          unit
          criterionId
          scenarioId
      }
    }
  `;
  const UPDATE_SCENARIO_CRITERIA = `
    mutation updateScenarioCriteria ($input: [ScenarioCriterionInput]) {
      updateScenarioCriteria (input: $input) {
          id
          type
          min
          max
          equal
          tempModifier
          unit
          criterionId
          scenarioId
      }
    }
  `;
  const DELETE_SCENARIO_CRITERIA = `
    mutation deleteScenarioCriteria ($ids: [String]) {
      deleteScenarioCriteria (ids: $ids)
    }
  `;
  const CREATE_SCENARIO_CRITEIRA_BY_HISTORYCAL_FREQUENCY = `
    mutation createScenarioCriteriaByHistoricalFrequency ($id: String!) {
      createScenarioCriteriaByHistoricalFrequency (id: $id) {
          id
      }
    }
  `;
  const [CreateScenarioCriteria] = MutationByString(CREATE_SCENARIO_CRITERIA);
  const [UpdateScenarioCriteria] = MutationByString(UPDATE_SCENARIO_CRITERIA);
  const [DeleteScenarioCriteria] = MutationByString(DELETE_SCENARIO_CRITERIA);
  const [CreateUserDefinedCriteria] = MutationByString(CREATE_CUSTOM_SCENARIO_CRITERIA);
  const [CreateScenarioCriteriaByHistoricalFrequency] = MutationByString(CREATE_SCENARIO_CRITEIRA_BY_HISTORYCAL_FREQUENCY);
  const addScenarioCriteria = (variables: CreateScenarioCriterionInput) => {
    return CreateScenarioCriteria({ variables });
  };
  const addCustomScenarioCriteria = (variables: CreateCustomScenarioCriterionInput ) => {
    return CreateUserDefinedCriteria({ variables });
  };
  const updateScenarioCriteria = (variables: CreateScenarioCriterionInput) => {
    return UpdateScenarioCriteria({ variables });
  };
  const deleteSenarioCriteria = (variables: DeleteScenarioCriterionInput) => {
    return DeleteScenarioCriteria({ variables });
  };
  const addScenarioCriteriaByHistoryFrequency = ( variables: { id: string }) => {
    return CreateScenarioCriteriaByHistoricalFrequency({ variables });
  }
  return { addScenarioCriteria, updateScenarioCriteria, deleteSenarioCriteria, addScenarioCriteriaByHistoryFrequency, addCustomScenarioCriteria };
};
