export interface ExternalEndpointType {
  minPrimary: any;
  maxPrimary: any;
  minSecondary: any;
  maxSecondary: any;
  terms: ExternalEndpointTermType[];
};

export interface ExternalEndpointTermType {
  term: any;
  endpoints: ExternalEndpointTermEndpoint[];
  primaryFrequency: any;
  secondaryFrequency: any;
  totalFrequency: any;
};
export interface ExternalEndpointTermEndpoint {
  nctId: any;
  type: any;
  rawText: any;
  term: any;
  internal: boolean;
  sponsor?: any;
  studyTitle?: any;
};