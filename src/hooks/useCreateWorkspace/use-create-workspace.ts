import { MutationByString } from "../../api/apollo";
import { TrialWorkspaceInputType } from "./TrialWorkspaceInputType";
export const useCreateWorkspace = () => {
  const CREATE_WORKSPACE = `
    mutation Mutation ($input: TrialWorkspaceInput!) {
      createTrialWorkspace (input: $input) {
        id
      }
    }
  `;
  const [createTrialWorkspace] = MutationByString(CREATE_WORKSPACE);
  const createNewTrial = (variables: TrialWorkspaceInputType) => {
    return createTrialWorkspace({ variables });
  };
  return { createNewTrial };
};
