export interface DctCapabilityRelation {
  soaTaxonomyId: any;
  dctCapabilityId: any;
  status: any[];
}
export interface SoaActivityVisitCapability {
  dctCapabilities: {
    dctCapabilityId: any;
    status: string;
  }[],
  soaActivityId: string,
  soaVisitId: any,
  soaActivity?: any
}