import { QueryByStringWithClient } from "./apollo";
export const graphqlStringMap = {
  fetchUsers: `
    query users {
      users {
          id
          username
          name
          createdAt
          updatedAt
          deletedAt
          profile {
              id
              recentTrials
              createdAt
              updatedAt
              deletedAt
              userId
          }
      }
    }
  `,
  fetchTrailWorkspace: `
    query trialWorkspace ($id: String!) {
      trialWorkspace (id: $id) {
          id
          createdAt
          updatedAt
          deletedAt
          userTrialId
          ownerId
          dataVersionId
          dataVersion {
            id
            name
          }
          users {
            id
            username
            name
            createdAt
            updatedAt
            deletedAt
          }
          trialUpdatedById
          trialUpdatedBy {
            id
            username
            name
          }
          endpoints {
            id
            name
            endpointCategoryId
          }
          scenarios {
            id
            name
          }
          userTrial {
              id
              trialTitle
              trialDescription
              trialAlias
              duration
              pediatricStudy
              unsupported
              createdAt
              updatedAt
              deletedAt
              indicationId
              moleculeId
              phaseId
              studyTypeId
              therapeuticAreaId
              indication {
                  id
                  name
                  userDefined
                  createdAt
                  updatedAt
                  deletedAt
              }
              molecule {
                id
                name
                createdAt
                updatedAt
                deletedAt
              }
              phase {
                id
                name
                createdAt
                updatedAt
                deletedAt
              }
              therapeuticArea {
                id
                name
                createdAt
                updatedAt
                deletedAt
              }
              studyType {
                id
                name
                createdAt
                updatedAt
                deletedAt
              }
          }
      }
    }
  `,
  fetchTrailWorkspaceList: `
    query trialWorkspaces ($input: TrialWorkspaceInput) {
      trialWorkspaces (input: $input) {
        id
        userTrialId
        ownerId
        userTrial {
          id
          trialTitle
          trialDescription
          lyNumber
          trialAlias
          pediatricStudy
          unsupported
          indicationId
          moleculeId
          phaseId
          studyTypeId
          therapeuticAreaId
          indication {
            id
            name
            userDefined
          }
          molecule {
            id
            name
          }
          phase {
            id
            name
          }
          therapeuticArea {
            id
            name
          }
          studyType {
            id
            name
          }
        }
        scenarios {
          id
          name
          description
          createdAt
          updatedAt
          deletedAt
          trialWorkspaceId
        }
        owner {
          id
          username
          name
          createdAt
          updatedAt
          deletedAt
        }
        users {
          id
          username
          name
          createdAt
          updatedAt
          deletedAt
        }
      }
    }
  `,
  fetchMyTrialWorkspaceList: `
    query myTrialWorkspaces {
      myTrialWorkspaces {
        id
        createdAt
        updatedAt
        deletedAt
        userTrialId
        ownerId
        userTrial {
          id
          trialTitle
          trialDescription
          lyNumber
          trialAlias
          pediatricStudy
          unsupported
          createdAt
          updatedAt
          deletedAt
          indicationId
          moleculeId
          phaseId
          studyTypeId
          therapeuticAreaId
          indication {
            id
            name
            userDefined
          }
          molecule {
            id
            name
          }
          phase {
            id
            name
          }
          therapeuticArea {
              id
              name
          }
          studyType {
            id
            name
          }
        }
        scenarios {
          id
          name
          description
          trialWorkspaceId
        }
        owner {
          id
          username
          name
        }
        users {
          id
          username
          name
        }
        dataVersion {
          id
          name
        }
      }
    }
  `,
  fetchAllTrialWorkspaceList: `
    query allTrialWorkspaces ($input: TrialWorkspaceInput) {
      allTrialWorkspaces (input: $input) {
        id
        createdAt
        updatedAt
        deletedAt
        userTrialId
        ownerId
        trialUpdatedAt
        trialUpdatedById
        trialUpdatedBy {
          id
          username
          name
          createdAt
        }
        userTrial {
          id
          trialTitle
          trialDescription
          lyNumber
          trialAlias
          pediatricStudy
          createdAt
          updatedAt
          deletedAt
          indicationId
          moleculeId
          phaseId
          studyTypeId
          therapeuticAreaId
          unsupported
        }
        scenarios {
            id
            name
        }
        owner {
            id
            username
            name
        }
        users {
            id
            username
            name
        }
        dataVersion {
          id
          name
        }
      }
    }
  `,
  fetchScenario: `
    query scenario ($id: String!) {
      scenario (id: $id) {
        id
        final
        name
        description
        scenarioUpdatedAt
        scenarioUpdatedById
        dctCapabilities
        scenarioUpdatedBy {
          id
          username
          name
        }
        soaUpdatedAt
        soaUpdatedById
        soaUpdatedBy {
          id
          username
          name
        }
        trialWorkspaceId
        trialWorkspace {
          id
          createdAt
          updatedAt
          deletedAt
          userTrialId
          ownerId
          dataVersionId
          dataVersion {
            id
            name
          }
          users {
            id
            username
            name
          }
          endpoints {
            id
            name
            trialWorkspaceId
            endpointCategoryId
          }
          trialUpdatedBy {
            id
            username
            name
          }
          userTrial {
            id
            trialTitle
            trialDescription
            lyNumber
            trialAlias
            pediatricStudy
            createdAt
            updatedAt
            deletedAt
            indicationId
            moleculeId
            phaseId
            studyTypeId
            duration
            therapeuticAreaId
            unsupported
            indication {
              id
              name
              userDefined
            }
            molecule {
              id
              name
            }
            phase {
              id
              name
            }
            therapeuticArea {
              id
              name
            }
            studyType {
              id
              name
            }
          }
        }
        soaActivities {
          id
          rationale
          createdAt
          updatedAt
          deletedAt
          endpointId
          scenarioId
          activityId
          soaTaxonomyId
          soaTaxonomy {
            id
            code
            mapping
            name
            isParent
            showChildren
            standardComment
            category
            activityCost
            activityCategoryId
            activityCategory {
              id
              name
            }
          }
          activity {
            id
            name
            userDefined
            cost
            activityCategoryId
            activityCategory {
              id
              name
            }
          }
          soaVisits {
            id
            visitNumber
            weekNum
            scenarioId
            soaPeriodId
            intervalTolerance
            alias
            detail
          }
        }
        soaVisits {
          id
          visitNumber
          weekNum
          scenarioId
          soaPeriodId
          intervalTolerance
          alias
          detail
        }
        endpoints {
          id
          name
          createdAt
          updatedAt
          deletedAt
          endpointCategoryId
          endpointCategory {
            id
            name
            createdAt
            updatedAt
            deletedAt
          }
        }
        scenarioCriteria {
          id
          type
          min
          max
          equal
          tempModifier
          unit
          createdAt
          updatedAt
          deletedAt
          criterionId
          scenarioId
          order
          criterion {
            id
            name
            min
            max
            equal
            tempModifier
            unit
            userDefined
            createdAt
            updatedAt
            deletedAt
            criteriaCategoryId
            criteriaCategory {
              id
              name
              createdAt
              updatedAt
              deletedAt
            }
          }
        }
      }
    }
  `,
  fetchScenarioCapabilities: `
    query scenario ($id: String!) {
      scenario (id: $id) {
        dctCapabilities 
      }
    }
  `,
  fetchScenarios: `
    query scenarios ($trialWorkspaceId: String!) {
      scenarios (trialWorkspaceId: $trialWorkspaceId) {
        id
        final
        name
        description
        createdAt
        updatedAt
        deletedAt
        scenarioUpdatedById
        scenarioUpdatedBy {
          id
          username
          name
        }
        soaUpdatedById
        soaUpdatedBy {
          id
          username
          name
        }
        trialWorkspaceId
        trialWorkspace {
          id
          createdAt
          updatedAt
          deletedAt
          userTrialId
          ownerId
          userTrial {
            id
            trialTitle
            trialDescription
            lyNumber
            trialAlias
            pediatricStudy
            createdAt
            updatedAt
            deletedAt
            indicationId
            moleculeId
            phaseId
            studyTypeId
            therapeuticAreaId
            unsupported
          }
        }
      } 
    }
  `,
  fetchScenarioAndSummaryInfo: `
  query scenarioAndSummary ($id: String!) {
    soaSummary (id: $id) {
      totalCost
      historicalTotalCost
      mappedActivities
      tertiles
      totalActivities
      activities {
        id
        rationale
        endpointId
        scenarioId
        activityId
        activity {
          id
          name
        }
        soaVisits {
          id
          visitNumber
        }
      }
    }
    ieSummary (id: $id) {
      complexityScore {
          scenario
          historical
          tertiles
      }
      screenFailure {
          scenario
          historical
          tertiles
          criteria {
              name
              rate
          }
      }
      protocolAmendment {
        scenario
        historical
        tertiles
        criteria {
            name
            rate
            amendments {
              beforeText
              afterText
              beforeIndex
              afterIndex
            }
        }
      }
    }
    scenario (id: $id) {
      id
      notes
      final
      name
      description
      createdAt
      updatedAt
      deletedAt
      scenarioUpdatedAt
      scenarioUpdatedById
      scenarioUpdatedBy {
        id
        username
        name
      }
      soaUpdatedAt
      soaUpdatedById
      soaUpdatedBy {
        id
        username
        name
      }
      trialWorkspaceId
      trialWorkspace {
        id
        createdAt
        updatedAt
        deletedAt
        userTrialId
        ownerId
        users {
          id
          username
          name
          createdAt
          updatedAt
          deletedAt
        }
        endpoints {
          id
          name
          createdAt
          updatedAt
          deletedAt
          trialWorkspaceId
          endpointCategoryId
        }
        trialUpdatedBy {
          id
          username
          name
        }
        userTrial {
          id
          trialTitle
          trialDescription
          lyNumber
          trialAlias
          pediatricStudy
          createdAt
          updatedAt
          deletedAt
          indicationId
          moleculeId
          phaseId
          studyTypeId
          duration
          therapeuticAreaId
          unsupported
          indication {
            id
            name
            userDefined
            createdAt
            updatedAt
            deletedAt
          }
          molecule {
            id
            name
            createdAt
            updatedAt
            deletedAt
          }
          phase {
            id
            name
          }
          therapeuticArea {
            id
            name
          }
          studyType {
            id
            name
          }
        }
      }
      soaActivities {
        id
        rationale
        createdAt
        updatedAt
        deletedAt
        endpointId
        scenarioId
        activityId
        soaTaxonomyId
        soaTaxonomy {
          id
          code
          mapping
          name
          isParent
          showChildren
          standardComment
          category
          activityCost
          activityCategoryId
          activityCategory {
            id
            name
          }
        }
        activity {
          id
          name
          userDefined
          cost
          activityCategoryId
          activityCategory {
            id
            name
          }
        }
        soaVisits {
          id
          visitNumber
          weekNum
          scenarioId
          soaPeriodId
          intervalTolerance
          alias
          detail
        }
      }
      soaVisits {
        id
        visitNumber
        scenarioId
        soaPeriodId
        weekNum
        intervalTolerance
        alias
        detail
      }
      endpoints {
        id
        name
        createdAt
        updatedAt
        deletedAt
        endpointCategoryId
        endpointCategory {
          id
          name
          createdAt
          updatedAt
          deletedAt
        }
      }
      scenarioCriteria {
        id
        type
        min
        max
        equal
        tempModifier
        unit
        createdAt
        updatedAt
        deletedAt
        criterionId
        scenarioId
        criterion {
          id
          name
          min
          max
          equal
          tempModifier
          unit
          userDefined
          createdAt
          updatedAt
          deletedAt
          criteriaCategoryId
          criteriaCategory {
            id
            name
            createdAt
            updatedAt
            deletedAt
          }
        }
      }
    }
  }`,
  fetchScenarioCriteria: `
    query scenarioCriteria ($id: String!) {
      scenario (id: $id) {
        scenarioUpdatedAt
        scenarioUpdatedBy {
          id
          username
          name
        }
        scenarioCriteria {
          id
          type
          min
          max
          equal
          tempModifier
          unit
          createdAt
          updatedAt
          deletedAt
          criterionId
          scenarioId
          criterion {
            name
            min
            max
            equal
            tempModifier
            unit
            userDefined
            createdAt
            updatedAt
            deletedAt
            criteriaCategoryId
            criteriaCategory {
              id
              name
              createdAt
              updatedAt
              deletedAt
              criteria {
                name
                min
                max
                equal
                tempModifier
                unit
                userDefined
                criteriaCategoryId
              }
              scenarioCriteria {
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
          }
        }
      }
    }
  `,
  fetchTopTenActivitiesOfScenario: `
    query topActivities($id: String!) {
      topActivities(id: $id) {
        activities {
          name,
          overallCost
          visitCount
        }
      }
    }
  `,
  fetchEndpointCategories: `
    query endpointCategories {
        endpointCategories {
            id
            name
        }
    }
  `,
  fetchExternalEndpoints: `
    query externalEndpoints {
      externalEndpoints {
          minPrimary
          maxPrimary
          minSecondary
          maxSecondary
          terms {
              term
              endpoints {
                  nctId
                  type
                  rawText
                  term
                  internal
                  sponsor
                  studyTitle
              }
              primaryFrequency
              secondaryFrequency
              totalFrequency
          }
      }
    }
  `,
  fetchSoaTexonomy: `
    query soaTaxonomy {
      soaTaxonomy {
          id
          code
          mapping
          name
          category
          activityCost
      }
    }
  `,
  fetchAllDictionaries: `
    query fetchAllDictionaries {
      phases  { id name }
      indications { id name userDefined }
      endpointCategories { id name }
      studyTypes { id name }
      therapeuticAreas { id name }
      molecules { id name }
    }
  `,
  searchTrial: `
    query trialSearch ($input: TrialSearchInput) {
      trialSearch (input: $input) {
        id
        trialTitle
        trialDescription
        lyNumber
        trialAlias
        pediatricStudy
        createdAt
        updatedAt
        deletedAt
        indicationId
        moleculeId
        phaseId
        studyTypeId
        therapeuticAreaId
        trialWorkspace {
          id
          trialUpdatedAt
          scenarios {
            id
            name
          }
          users {
            id
            username
            name
          }
        }
      }
    }
`,
  fetchCurrentUserInfo: `
    query whoami {
      whoami {
        id
        username
        name
        createdAt
        updatedAt
        deletedAt
        profile {
          id
          userId
        }
        favoriteTrialWorkspaces {
          id
          createdAt
          updatedAt
          deletedAt
          userTrialId
          ownerId
          userTrial {
            id
            trialTitle
            trialDescription
            lyNumber
            trialAlias
            pediatricStudy
            createdAt
            updatedAt
            deletedAt
            indicationId
            moleculeId
            phaseId
            studyTypeId
            therapeuticAreaId
            unsupported
          }
        }
      }
    }
  `,
  fetchAllCriterias: `
    query criteria ($dataVersionId: String!) {
      criteria (dataVersionId: $dataVersionId) {
        id
        name
        min
        max
        equal
        tempModifier
        unit
        userDefined
        createdAt
        updatedAt
        deletedAt
        criteriaCategoryId
        criteriaCategory {
          id
          name
          createdAt
          updatedAt
          deletedAt
        }
      }
    }
  `,
  fetchCriteriaCategories: `
    query criteriaCategories {
      criteriaCategories {
        id
        name
      }
    }
  `,
  fetchHistoricalCriteria: `
    query historicalCriteria ($id: String!) {
      historicalCriteria (id: $id) {
        min
        max
        inclusion {
          id
          name
          criteria {
            id
            type
            name
            category
            tempModifier
            min
            max
            equal
            unit
            appears
            freq
          }
        }
        exclusion {
          id
          name
          criteria {
            id
            type
            name
            category
            tempModifier
            min
            max
            equal
            unit
            appears
            freq
          }
        }
      }
    }
  `,
  fetchHistoricalAggregateCriteria: `
    query historicalCriteria ($id: String!) {
      historicalCriteria (id: $id) {
        min
        max
        inclusion {
          id
          name
          aggregatedCriteria{
            id
            name
            type
            category
            criteria {
              id
              type
              name
              category
              tempModifier
              min
              max
              equal
              unit
              appears
              freq
              internal
            }
          }
        }
        exclusion {
          id
          name
          aggregatedCriteria{
            id
            name
            type
            category
            criteria {
              id
              type
              name
              category
              tempModifier
              min
              max
              equal
              unit
              appears
              freq
              internal
            }
          }
        }
      }
    }
  `,
  fetchActivityAndCategoriesAndPeriods: `
    query activitiesAndCategories ($dataVersionId: String!) {
      activities {
        id
        name
        userDefined
        cost
        activityCategoryId
        activityCategory {
          name
          id
        }
        dataVersion {
          id
          name
        }
      },
      soaTaxonomy {
        id
        code
        mapping
        archived
        name
        category
        activityCost
        activityCategoryId
        isParent
      }
      activityCategories (dataVersionId: $dataVersionId) {
        id
        name
        dataVersionId
        dataVersion {
            id
            name
        }
      }
      soaPeriods {
        id
        name
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  fetchHistoricalActivities: `
    query historicalActivities ($id: String!) {
      historicalActivities (id: $id) {
        avgActivities {
          min
          max
        }
        avgVisits {
          min
          max
        }
        activities {
          id
          code
          name
          category
          activityCost
          activityCategoryId
          appears
          frequency
          visitFrequency
        }
      }
    }`,
  fetchSoASummary: `
    query soaSummary ($id: String!) {
      soaSummary (id: $id) {
        totalCost
        historicalTotalCost
        mappedActivities
        tertiles
        totalActivities
        activities {
          id
          rationale
          createdAt
          updatedAt
          deletedAt
          endpointId
          scenarioId
          activityId
          activity {
            id
            name
            userDefined
            cost
            createdAt
            updatedAt
            deletedAt
            activityCategoryId
            activityCategory {
              id
              name
            }
          }
          soaTaxonomyId
          soaTaxonomy {
            code
            mapping
            name
            category
            activityCost
            isParent
            activityCategoryId
            activityCategory {
              id
              name
            }
          }
          soaVisits {
            id
            visitNumber
            scenarioId
            soaPeriodId
            weekNum
            intervalTolerance
            alias
            detail
          }
        }
      }
    }
  `,
  fetchIESummary: `
    query ieSummary ($id: String!) {
      ieSummary (id: $id) {
        complexityScore {
          scenario
          historical
          tertiles
        }
        screenFailure {
          scenario
          historical
          tertiles
          criteria {
            name
            rate
          }
        }
        protocolAmendment {
          scenario
          historical
          tertiles
          criteria {
              name
              rate
              amendments {
                beforeText
                afterText
                beforeIndex
                afterIndex
              }
          }
        }
      }
    }
  `,
  fetchScenarioSummary: `
    query scenarioSummary ($id: String!) {
      ieSummary (id: $id) {
        complexityScore {
          scenario
          historical
          tertiles
        }
        screenFailure {
          scenario
          historical
          tertiles
        }
        protocolAmendment {
          scenario
          historical
          tertiles
        }
      }
      soaSummary (id: $id) {
        totalCost
        historicalTotalCost
        mappedActivities
        totalActivities
        tertiles
      }
    }
  `,
  fetchSoaSummaryInternalTrialsCount: `
    query scenarioSummary ($id: String!) {
      soaSummary (id: $id) {
        internalRelatedTrialsCount
      }
    }
  `,
  fetchExportSoA: `
    query exportSoa ($id: String!) {
      exportSoa (id: $id) {
          base64data
          contentType
          filename
      }
    }
  `,
  fetchReferenceTrialSearch: `
    query referenceTrialSearch ($input: ReferenceTrialSearchInput) {
      referenceTrialSearch (input: $input) {
          data {
              id
              trialAlias
              nctId
              therapeuticArea
              phase
              indications
              pediatric
              sponsor
              approvalDate
              status
              studyTitle
              moa
              roa
              internalTrial
              createdAt
              updatedAt
              deletedAt
          }
          totalCount
          statistics {
              sponsor {
                  name
                  count
                  percentage
              }
              approvalDate {
                  name
                  count
                  percentage
              }
          }
      }
    }
  `,
  fetchTrialReferenceTrials: `
    query trialWorkspace ($id: String!) {
      trialWorkspace (id: $id) {
        id
        trialUpdatedAt
        hasReferenceTrials
        referenceTrials {
          id
          trialAlias
          nctId
          therapeuticArea
          phase
          indications
          pediatric
          sponsor
          approvalDate
          status
          studyTitle
          moa
          roa
          internalTrial
        }
      }
    }
  `,
  // return: dictionary of dctCapabilities.
  fetchDctCapabilities: `
    query dctCapabilities ($limit: Int, $order: String, $where: SequelizeJSON, $offset: Int) {
      dctCapabilities (limit: $limit, order: $order, where: $where, offset: $offset) {
          id
          name
          color
      }
    }
  `,
  // return: dictionary of dctCapability and soaTaxonomy relation.
  fetchSoaTaxonomyDctCapabilities: `
    query soaTaxonomyDctCapabilities {
      soaTaxonomyDctCapabilities {
          status
          soaTaxonomyId
          dctCapabilityId
      }
    }
  `,
  // return combile result of dctCapability and relation.
  fetchCapabilityAndRelations: `
    query fetchCapabilityAndRelations ($limit: Int, $order: String, $where: SequelizeJSON, $offset: Int) {
      dctCapabilities (limit: $limit, order: $order, where: $where, offset: $offset) {
          id
          name
          color
      }
      soaTaxonomyDctCapabilities {
        status
        soaTaxonomyId
        dctCapabilityId
      }
    }
  `,
  // arg: scenario id.
  // return relationship array for activity, visits and dctCapabilities.
  fetchSoAActivityVisitsCapabilitiesAndScenario: `
    query soaActivityVisits ($id: String!) {
      soaActivityVisits (id: $id) {
          dctCapabilities
          soaActivityId
          soaVisitId
      }
      scenario (id: $id) {
        id
        final
        name
        description
        dctCapabilities
        soaUpdatedAt
        soaUpdatedById
        soaUpdatedBy {
          id
          username
          name
        }
        trialWorkspaceId
        trialWorkspace {
          id
          createdAt
          updatedAt
          deletedAt
          userTrialId
          ownerId
          dataVersionId
          dataVersion {
            id
            name
          }
          users {
            id
            username
            name
          }
          endpoints {
            id
            name
            trialWorkspaceId
            endpointCategoryId
          }
          trialUpdatedBy {
            id
            username
            name
          }
          userTrial {
            id
            trialTitle
            trialDescription
            lyNumber
            trialAlias
            pediatricStudy
            createdAt
            updatedAt
            deletedAt
            indicationId
            moleculeId
            phaseId
            studyTypeId
            duration
            therapeuticAreaId
            unsupported
            indication {
              id
              name
              userDefined
            }
            molecule {
              id
              name
            }
            phase {
              id
              name
            }
            therapeuticArea {
              id
              name
            }
            studyType {
              id
              name
            }
          }
        }
        soaActivities {
          id
          rationale
          createdAt
          updatedAt
          deletedAt
          endpointId
          scenarioId
          activityId
          soaTaxonomyId
          soaTaxonomy {
            id
            code
            mapping
            name
            isParent
            showChildren
            standardComment
            category
            activityCost
            activityCategoryId
            activityCategory {
              id
              name
            }
          }
          activity {
            id
            name
            userDefined
            cost
            activityCategoryId
            activityCategory {
              id
              name
            }
          }
          soaVisits {
            id
            visitNumber
            weekNum
            scenarioId
            soaPeriodId
            intervalTolerance
            alias
            detail
          }
        }
        soaVisits {
          id
          visitNumber
          weekNum
          scenarioId
          soaPeriodId
          intervalTolerance
          alias
          detail
        }
      }
    }
  `,
  fetchSoAActivityVisitsCapabilities: `
    query soaActivityVisits ($id: String!) {
      soaActivityVisits (id: $id) {
          dctCapabilities
          soaActivityId
          soaVisitId
      }
    }
  `,
  fetchDctCapabilitySummary: `
    query dctCapabilitySummary ($id: String!) {
      dctCapabilitySummary (id: $id) {
          soaVisits {
              soaVisitId
              soaVisit {
                  id
                  alias
                  visitNumber
              }
              dctCapabilitiesSummary {
                  dctCapabilityId
                  statusArray
              }
              hasClinic
          }
      }
    }
  `,
  
};

export const fetchByGraphqlString = (graphqlString: string) => {
  return QueryByStringWithClient(graphqlString, undefined);
};

export interface ReferenceTrialSearchInputType {
  input: {
    trialWorkspaceId: string;
    sponsorList: string[];
    statusList: string[];
    pediatric?: boolean;
    approvalDateList: string[];
    moaList: string[];
    roaList: string[];
  }
};