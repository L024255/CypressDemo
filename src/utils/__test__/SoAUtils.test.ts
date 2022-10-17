import { filterSoaTaxonomyByShowChildren, getVisitCountFromActivityVisitCapabilities } from "../SoAUtils";
import { SoaActivityModel } from "../../pages/SoA/type/SoaActivity";
import { SoaActivityVisitCapability } from "../../pages/SoA/type/DctCapabilityRelation";


describe("test function filterSoaTaxonomyByShowChildren", () => {
  // const array = [];
  describe("when input an empty array", () => {
    it("returns an emptry array", () => {
      const result = filterSoaTaxonomyByShowChildren([]);
      expect(result).toStrictEqual([]);
    });
  });
  describe("when input an array with 2 children activities", () => {
    const notShowChildrenParent: SoaActivityModel = {
      activityId: "activity1-activityId1",
      id: "activity1-id1",
      name: "activity1",
      soaVisits: [],
      scenarioId: "test",
      endpointId: "test",
      activity: {
        id: "activity1-activity-Id1",
        name: "activity1-activity",
        userDefined: false,
        cost: "10",
        activityCategoryId: "test",
      },
      soaTaxonomyId: "test",
      soaTaxonomy: {
        code: "test-taxonomy-code",
        name: "activity1-activity",
        showChildren: false,
        activityCost: "10",
        category: "test category name",
      },
    };
    const showChildrenParent: SoaActivityModel = {
      activityId: "activity1-activityId1",
      id: "activity1-id1",
      name: "activity1",
      soaVisits: [],
      scenarioId: "test",
      endpointId: "test",
      activity: {
        id: "activity1-activity-Id1",
        name: "activity1-activity",
        userDefined: false,
        cost: "10",
        activityCategoryId: "test",
      },
      soaTaxonomyId: "test",
      soaTaxonomy: {
        code: "test-taxonomy-code",
        name: "activity1-activity",
        showChildren: true,
        activityCost: "10",
        category: "test category name",
      },
    };
    const children: SoaActivityModel[] = [
      {
        activityId: "activity1-activityId2",
        id: "activity2-id",
        name: "activity2",
        soaVisits: [],
        scenarioId: "test",
        endpointId: "test",
        activity: {
          id: "activity2-activity-Id",
          parentId: "activity1-activity-Id1",
          name: "activity2-activity",
          userDefined: false,
          cost: "10",
          activityCategoryId: "test",
          isChild: true,
        },
        soaTaxonomyId: "test",
        soaTaxonomy: {
          code: "test-taxonomy-code",
          name: "activity2-activity",
          showChildren: false,
          activityCost: "10",
          category: "test category name",
        },
      },
      {
        activityId: "activity1-activityId3",
        id: "activity3-id",
        name: "activity3",
        soaVisits: [],
        scenarioId: "test",
        endpointId: "test",
        activity: {
          id: "activity3-activity-Id",
          parentId: "activity1-activity-Id1",
          name: "activity3-activity",
          userDefined: false,
          cost: "10",
          activityCategoryId: "test",
          isChild: true,
        },
        soaTaxonomyId: "test",
        soaTaxonomy: {
          code: "test-taxonomy-code",
          name: "activity3-activity",
          showChildren: false,
          activityCost: "10",
          category: "test category name",
        },
      },
    ]
    it("when showChildren is false, result is not show children parent array", () => {
      const notShowChildrenArray: SoaActivityModel[] = [
        notShowChildrenParent
      ].concat(children);
      const result = filterSoaTaxonomyByShowChildren(notShowChildrenArray);
      expect(result).toStrictEqual([notShowChildrenParent]);
    });
    it("when showChildren is true, result is children", () => {
      const showChildrenArray: SoaActivityModel[] = [
        showChildrenParent
      ].concat(children);
      const result = filterSoaTaxonomyByShowChildren(showChildrenArray);
      expect(result).toStrictEqual(children);
    });
    it("when input with a not show children parent, cost should be summary of children", () => {
      const notShowChildrenArray: SoaActivityModel[] = [
        notShowChildrenParent
      ].concat(children);
      const result = filterSoaTaxonomyByShowChildren(notShowChildrenArray);
      let summaryOfChildrenCost = 0;
      children.forEach((child: SoaActivityModel) => {
        summaryOfChildrenCost += parseFloat(child.activity.cost);
      })
      expect(result[0].activity.cost).toBe(summaryOfChildrenCost.toFixed());
    });
  });
});
describe("test getVisitCountFromActivityVisitCapabilities", () => {
  it("when there are 3 of 5 object has dct capabilities, and 2 of them has same visit id, return 2", () => {

    const soaActivityVisitCapabilities: SoaActivityVisitCapability[] = [
      {
        dctCapabilities: [{
          dctCapabilityId: 1,
          status: "Ready Now",
        }],
        soaActivityId: "1",
        soaVisitId: "1",
      },
      {
        dctCapabilities: [{
          dctCapabilityId: 1,
          status: "Ready Now",
        }],
        soaActivityId: "2",
        soaVisitId: "1",
      },
      {
        dctCapabilities: [{
          dctCapabilityId: 1,
          status: "Ready Now",
        }],
        soaActivityId: "3",
        soaVisitId: "2",
      },
      {
        dctCapabilities: [],
        soaActivityId: "1",
        soaVisitId: "3",
      },
      {
        dctCapabilities: [],
        soaActivityId: "5",
        soaVisitId: "1",
      },
    ];
    const activityCount = getVisitCountFromActivityVisitCapabilities(soaActivityVisitCapabilities);
    expect(activityCount).toBe(2);
  });
});