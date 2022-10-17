import { MutationByString } from "../../api/apollo";
export interface CreateTrialWorkspaceReferenceTrialInput {
  input: {
    trialWorkspaceId: string;
    referenceTrialIds: string[];
  }
};
export const useUpdateTrialWorkspaceReferenceTrial = () => {
  const CREATE_TRIAL_WORKSPACE_REFERENCE_TRIAL = `
    mutation createTrialWorkspaceReferenceTrials ($input: TrialWorkspaceReferenceTrialInput) {
      createTrialWorkspaceReferenceTrials (input: $input)
    }
  `;

  const [CreateTrialWorkspaceReferenceTrials] = MutationByString(CREATE_TRIAL_WORKSPACE_REFERENCE_TRIAL);

  const createTrialWorkspaceReferenceTrials = (variables: CreateTrialWorkspaceReferenceTrialInput) => {
    return CreateTrialWorkspaceReferenceTrials({ variables });
  }

  return { createTrialWorkspaceReferenceTrials };
}