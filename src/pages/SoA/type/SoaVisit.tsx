export interface SoaVisitCapabilitySummary {
  dctCapabilityId: string;
  statusArray: string[];
}
export interface SoaVisitModal {
  soaVisitId: string;
  soaVisit: {
    id: string;
    alias: string;
    visitNumber: any;
  },
  hasClinic: boolean;
  dctCapabilitiesSummary: SoaVisitCapabilitySummary[];
};