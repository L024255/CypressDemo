export interface ScenarioDetail {
  trialWorkspaceId: string;
  final?: boolean;
  notes?: string;
  id: string;
  name: string;
  description: string;
  inclusion?: any;
  exclusion?: any;
  SOA?: any;
  soaActivities?: any[];
  scenarioCriteria?: any[];
  soaVisits?: any[];
  endpoints?: any[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  soaUpdatedAt?: string;
  scenarioUpdatedById?: string;
  dctCapabilities?:string[];
  scenarioUpdatedBy?: {
    id: string;
    username: string;
    name: string;
  }
  soaUpdatedById?: string;
  soaUpdatedBy?: {
    id: string;
    username: string;
    name: string;
  }
}
