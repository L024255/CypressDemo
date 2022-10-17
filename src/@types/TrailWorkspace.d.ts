export interface TrailWorkspaceDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  teamId: string;
  userTrialId: string;
  trialUpdatedById: string;
  dataVersion: {
    id: string;
    name: string;
  }
  users?: {
    id: string;
    name: string;
  }[];
  trialUpdatedBy: {
    id: string;
    username: string;
    name: string;
  }
  userTrial: {
    id: string;
    trialId: string;
    trialTitle: string;
    trialDescription: string;
    unsupported?: boolean;
    indication?: {
      id: string;
      name: string;
      userDefined: boolean;
    };
    indicationId: string;
    duration: number;
    studyTypeId: string;
    therapeuticAreaId: string;
    phaseId: string;
    therapeuticArea: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
    };
    phase: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
    };
    studyType: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
    };
    endpoints: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      trialId: string;
      endpointCategoryId: string;
      scenarioId: string;
      trialWorkspaceId: string;
      endpointCategory?: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
      };
    };
    lyNumber?: string;
    trialAlias: string;
    pediatricStudy?: string;
    studyCountry?: string;
    molecule?: {
      id: string;
      name: string;
    };
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };
  scenarios: {
    id: string;
    inclusion: string;
    exclusion: string;
    SOA: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    trialWorkspaceId: string;
    trialWorkspace: {
      id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      ownerId: string;
      teamId: string;
      userTrialId: string;
    };
  }[];
}
