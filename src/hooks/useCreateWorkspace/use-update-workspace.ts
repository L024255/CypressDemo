import { MutationByString } from "../../api/apollo";
import { TrialWorkspaceInputType } from "./TrialWorkspaceInputType";
export const useUpdateWorkspace = () => {
  const UPDATE_WORKSPACE = `
    mutation updateTrialWorkspace ($input: TrialWorkspaceInput!) {
        updateTrialWorkspace (input: $input) {
            id
        }
    }
  `;
  const [updateTrialWorkspace] = MutationByString(UPDATE_WORKSPACE);
  const updateTrial = (variables: TrialWorkspaceInputType) => {
    return updateTrialWorkspace({ variables });
  };
  return { updateTrial };
};
