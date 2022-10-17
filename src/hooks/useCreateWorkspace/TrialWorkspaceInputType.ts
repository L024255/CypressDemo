export interface TrialWorkspaceInputType {
  input: {
    id?: string;
    userTrial?: {
      trialTitle?: string;
      trialDescription?: string;
      trialAlias?: string;
      therapeuticAreaId?: string;
      studyTypeId?: string;
      indicationId?: string;
      otherIndication?: string;
      phaseId?: string;
      pediatricStudy?: any;
      moleculeId?: string;
      moleculeName?: string;
      duration?: number;
      unsupported?: boolean;
    };
    users?: string[];
  };
}
