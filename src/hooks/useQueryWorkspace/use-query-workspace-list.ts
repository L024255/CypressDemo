import { QueryByString } from "../../api/apollo";

export const useQueryWorkspaceList = () => {
  const QUERY_WORKSPACE_LIST = `
  query trialWorkspaces {
    trialWorkspaces {
        id
        createdAt
        updatedAt
        deletedAt
        ownerId
        teamId
        userTrialId
        userTrial {
            id
            trialId
            trialTitle
            trialDescription
            therapeuticArea
            studyPhase
            studyType
            lyNumber
            trialAlias
            pediatricStudy
            studyCountry
            molecule
            createdAt
            updatedAt
            deletedAt
        }
        scenarios {
            id
            inclusion
            exclusion
            SOA
            name
            description
            createdAt
            updatedAt
            deletedAt
            trialWorkspaceId
            trialWorkspace {
                id
                createdAt
                updatedAt
                deletedAt
                ownerId
                teamId
                userTrialId
                userTrial {
                    id
                    trialId
                    trialTitle
                    trialDescription
                    therapeuticArea
                    studyPhase
                    studyType
                    lyNumber
                    trialAlias
                    pediatricStudy
                    studyCountry
                    molecule
                    createdAt
                    updatedAt
                    deletedAt
                }
                scenarios {
                    id
                    inclusion
                    exclusion
                    SOA
                    name
                    description
                    createdAt
                    updatedAt
                    deletedAt
                    trialWorkspaceId
                }
            }
        }
    }
}
  `;
  return () => QueryByString(QUERY_WORKSPACE_LIST);
};
