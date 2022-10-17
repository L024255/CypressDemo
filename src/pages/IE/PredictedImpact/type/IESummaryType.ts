export interface IESummaryType {
  complexityScore: {
    scenario: number;
    historical: number;
    tertiles: number[];
  };
  screenFailure: {
    scenario: number;
    historical: number;
    tertiles: number[];
    criteria: {
      name: string;
      rate: number;
    }[];
  };
  protocolAmendment: {
    scenario: number;
    historical: number;
    tertiles: number[];
    criteria: {
      name: string;
      rate: number;
      amendments: {
        id: string;
        referenceTrialId: string;
        beforeText: string;
        afterText: string;
        beforeIndex: any[];
        afterIndex: any[];
      }[];
    }[];
  };
}
