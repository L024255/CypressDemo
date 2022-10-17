import { SelectedCapability } from "../pages/SoA/components/CapabilityBadges";
import { ActivityModel } from "../pages/SoA/type/Activity";
import { DctCapability } from "../pages/SoA/type/DctCapability";
import { DctCapabilityRelation, SoaActivityVisitCapability } from "../pages/SoA/type/DctCapabilityRelation";
import { SoaActivityModel } from "../pages/SoA/type/SoaActivity";
import { unique } from "./formatUtil";
import { groupBy } from 'lodash';

export const filterSoaTaxonomyByShowChildren = (soaActivities: SoaActivityModel[]) => {
  const children = soaActivities.filter((soaAcvitiy: SoaActivityModel) => soaAcvitiy.activity?.isChild);
  let result: SoaActivityModel[] = [];
  soaActivities.filter((soaActivity: SoaActivityModel) => !soaActivity.activity?.isChild)
    .forEach((soaActivity: SoaActivityModel) => {
      const childActivities: SoaActivityModel[] = children.filter((child: SoaActivityModel) => child.activity.parentId === soaActivity.activity.id);
      if (soaActivity.soaTaxonomy?.showChildren === false) {
        let totalCost = 0;
        childActivities.forEach((activity: SoaActivityModel) => {
          if (activity.activity.cost) {
            totalCost += parseFloat(activity.activity.cost);
          } else if (activity.soaTaxonomy.activityCost) {
            totalCost += parseFloat(activity.soaTaxonomy.activityCost);
          }
        });
        soaActivity.activity.cost = totalCost.toFixed();
        result.push(soaActivity);
      } else if (soaActivity.soaTaxonomy?.showChildren === true) {
        result = result.concat(childActivities);
      } else {
        result.push(soaActivity);
      }
    })
  return result;
};

export const transferResponseToSoaActivityModelArray = (scenarioActivities: any[]) => {
  const soaActivityArray = scenarioActivities?.map((soaActivity: any) => {
    if (soaActivity.activity === null && soaActivity.soaTaxonomy) {
      const activity: ActivityModel = {
        id: soaActivity.soaTaxonomy.id,
        name: soaActivity.soaTaxonomy.name,
        userDefined: "false",
        cost: soaActivity.soaTaxonomy.activityCost,
        activityCategoryId: soaActivity.soaTaxonomy.activityCategoryId,
        isChild: false,
        parentId: null,
        isParent: soaActivity.soaTaxonomy.isParent,
        standardComment: soaActivity.soaTaxonomy.standardComment,
      };
      if (soaActivity.soaTaxonomy.name.split(".").length > 1) {
        activity.isChild = true;
        const parentName = soaActivity.soaTaxonomy.name.split(".")[0];
        const parents = scenarioActivities.filter((soaActivity: any) => soaActivity.soaTaxonomy?.name === parentName);
        if (parents.length > 0) {
          activity.parentId = parents[0].soaTaxonomy.id;
          activity.isChild = true;
          activity.name = soaActivity.soaTaxonomy.name.split(".")[1];
          // soaActivity.activity.isChild = true;
          // soaActivity.activity.parentId = parents[0].id;
        }
      }
      soaActivity.activity = activity;
    };
    return soaActivity;
  }) || [];
  return soaActivityArray;
}

export const getVisitCountFromActivityVisitCapabilities = (activityVisitCapabilities: SoaActivityVisitCapability[]) => {
  const visits: any[] = [];
  activityVisitCapabilities?.forEach((activityVisitCapability: SoaActivityVisitCapability) => {
    if (activityVisitCapability?.dctCapabilities?.length > 0) {
      visits.push(activityVisitCapability.soaVisitId);
    }
  });
  const result = unique(visits);
  return result.length;
};

export const filterActivityByShowChildren = (scenarioActivities: SoaActivityModel[]) => {
  const hideChildrenSoa = scenarioActivities?.filter(
    (activity) => activity?.soaTaxonomy?.isParent === true && activity?.soaTaxonomy?.showChildren === false
  );
  const selectedSoa = scenarioActivities?.filter((activity) => {
    let countChild = true;
    let countParent = activity?.soaTaxonomy?.isParent !== true;

    hideChildrenSoa.forEach((parent) => {
      if (activity?.soaTaxonomy?.isParent === false && activity?.soaTaxonomy?.name.includes(parent.soaTaxonomy.name)) {
        countChild = false;
      }
    });

    if (activity?.soaTaxonomy?.isParent && activity?.soaTaxonomy?.showChildren === false) {
      countParent = true;
    }

    return activity?.soaVisits?.length > 0 && countParent && countChild;
  }) || [];
  return selectedSoa;
}

export const filterActivityVisitCapabilitiesBySelectedSoa = (scenarioActivities: SoaActivityModel[], activityVisitCapabilities: SoaActivityVisitCapability[]) => {
  const selectedSoa = scenarioActivities.filter((item) => item.soaVisits.length);
  const parentSoa = scenarioActivities.filter((item) => item.soaTaxonomy?.isParent);
  const result: any = activityVisitCapabilities.map((activityCapability) => {
    const index = selectedSoa.findIndex((soa) => soa.id === activityCapability.soaActivityId);

    if (index > -1 && activityCapability.dctCapabilities) {
      activityCapability.soaActivity = selectedSoa[index];
      return activityCapability;
    }

    return null;
  }).filter(x => x);
  const groupedResult = groupBy(result, 'soaActivity.parentId');
  const finalResult: any = [];

  Object.entries(groupedResult).forEach(([parentId, children]) => {
    const parent = parentSoa.find((item) => item.id === parentId);

    if (children.length > 1 && parent?.soaTaxonomy?.showChildren === false) {
        finalResult.push(children[0]);
    } else {
      finalResult.push(...children);
    }
  });
  return finalResult;
}

export const getRecordChildrenDisplayCapabilities = (
  childrenRecords: { soaActivityId: string, visitId: any }[],
  activityVisitCapabilities: SoaActivityVisitCapability[],
  dctCapabilityRelations: DctCapabilityRelation[],
  dctCapabilities: DctCapability[],
) => {
  const result: SelectedCapability[] = [];
  childrenRecords.forEach((record) => {
    const displayIndex = activityVisitCapabilities.findIndex((object: SoaActivityVisitCapability) =>
      object.soaActivityId === record.soaActivityId && object.soaVisitId === record.visitId);
    const displayCapabilityIds: {
      dctCapabilityId: any;
      status: string;
    }[] = displayIndex > -1 ? activityVisitCapabilities[displayIndex].dctCapabilities : [];
    displayCapabilityIds?.forEach((displayCapability) => {
      if (result.findIndex((obj) => obj.dctCapabilityId === displayCapability.dctCapabilityId) === -1) {
        const capability = dctCapabilities.find((capability) => capability.id === displayCapability.dctCapabilityId);
        const capabilityRelation = dctCapabilityRelations.find((relation) => relation.dctCapabilityId === displayCapability.dctCapabilityId);
        result.push({
          dctCapabilityId: displayCapability.dctCapabilityId,
          name: capability?.name || "",
          status: displayCapability.status,
          color: capability?.color || "",
          soaTaxonomyId: capabilityRelation?.soaTaxonomyId || "",
        });
      }
    })
  });
  return result;
}
