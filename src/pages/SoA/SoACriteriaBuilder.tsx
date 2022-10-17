import React, { Profiler, useEffect, useState } from "react";
import { Box, Button, Grid, styled, Typography } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import MultiCheckTable from "./components/MultiCheckTable";
import BottomStepBar from "../../components/BottomStepBar";
import { ActivityCategoryModel } from "./type/ActivityCategory";
import { ActivityModel } from "./type/Activity";
import { SoaActivityModel } from "./type/SoaActivity";
import { SoaVisitInput, UpdateSoaActivityVisitsDctCapabilityInputObjectType } from "../../hooks/useUpdateSoAActiviyVisits/use-soa-activity-visits";
import { DctCapability } from "./type/DctCapability";
import { DctCapabilityRelation, SoaActivityVisitCapability } from "./type/DctCapabilityRelation";
import SoaBuilderSummaryCard from "./components/SoaBuilderSummaryCard";
import {
  filterActivityByShowChildren,
  filterActivityVisitCapabilitiesBySelectedSoa,
  getVisitCountFromActivityVisitCapabilities
} from "../../utils/SoAUtils";
import TrialLevelCapabilitiesCard, { SelectedTrialLevelCapability } from "./components/TrialLevelCapabilitiesCard";

interface SoACriteriaBuilderProps {
  loadingData?: boolean;
  workspaceId: string;
  scenarioId: string;
  activityCategories: ActivityCategoryModel[];
  activities: ActivityModel[];
  historicalActivities: ActivityModel[];
  scenarioVisits: any[];
  scenarioActivities: SoaActivityModel[];
  lastSavedAuthor: string;
  lastSavedTime: string;
  soaPeriods?: any[];
  dctCapabilities: DctCapability[];
  soaDctCapabilityRelations: DctCapabilityRelation[];
  activityVisitCapabilities: SoaActivityVisitCapability[];
  unsupportedTrial: Boolean;
  trialIndication: string;
  scenarioCapabilityIds: string[];
  createVisit: (
    scenarioId: string,
    visitNumber: any,
    soaPeriod: string
    ) => Promise<any>;
    deleteVisit: (visitId: string) => Promise<any>;
  addSoAActivities: (inputArray: { scenarioId: string, activityId: string }[]) => void;
  addCustomSoAActivity: (scenarioId: string, customActivityName: string, categoryId: string, categoryName: string) => void;
  removeSoAActivity: (ids: string[]) => void;
  fetchActivityVisitsCapabilities: () => Promise<any>;
  showError: (errorMessage: string) => void;
  updateUserdefinedActivity: (activityId: string, newCategoryId: string, nextAction: Function) => void;
  updateUserCustomSoACost: (scenarioId: string, activityId: string, activityName: string, cost: any) => void;
  updateSoaVisit: (input: SoaVisitInput) => Promise<any>;
  updateSoaTaxonomies: (taxonomyId: any, standardComment: string) => Promise<any>;
  updateSoaTaxonomyCapability: (inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[]) => Promise<any>;
  updateAllSoaTaxonomyCapability: (inputArray: UpdateSoaActivityVisitsDctCapabilityInputObjectType[]) => Promise<any>;
  downLoadSoaData: (scenarioId: string) => void;
  updateScenarioCapability: (selectedCapabilities: SelectedTrialLevelCapability[]) => Promise<any>;
}
const SoACriteriaBuilder: React.FC<SoACriteriaBuilderProps> = ({
  loadingData,
  scenarioId,
  workspaceId,
  activities,
  historicalActivities,
  activityCategories,
  soaPeriods,
  scenarioVisits,
  scenarioActivities,
  lastSavedAuthor,
  lastSavedTime,
  dctCapabilities,
  soaDctCapabilityRelations,
  activityVisitCapabilities,
  unsupportedTrial,
  trialIndication,
  scenarioCapabilityIds,
  createVisit,
  deleteVisit,
  addSoAActivities,
  addCustomSoAActivity,
  removeSoAActivity,
  fetchActivityVisitsCapabilities,
  showError,
  updateUserdefinedActivity,
  updateUserCustomSoACost,
  updateSoaVisit,
  updateSoaTaxonomies,
  updateSoaTaxonomyCapability,
  updateAllSoaTaxonomyCapability,
  downLoadSoaData,
  updateScenarioCapability,
}) => {
  const savedInfo = `Last Saved ${lastSavedTime} by ${lastSavedAuthor}`;

  const [tableData, setTableData] = useState<{
    columnGroups: any[];
    visitsGroups: any[];
  }>({
    columnGroups: [],
    visitsGroups: [],
  });
  const [selectedVisits, setSelectedVisits] = useState(0);
  const [selectedActivities, setSelectedActivies] = useState(0);
  const [displayCapabilities, setDisplayCapabilities] = useState<SelectedTrialLevelCapability[]>([]);

  useEffect(() => {
    let tempNumber = 1;
    const columnGroups =
      soaPeriods?.map((period) => {
        let columns: any[] = [];
        let visitsCount = 0;
        if (scenarioVisits) {
          scenarioVisits
            .filter((visit) => {
              return visit.soaPeriodId === period.id;
            })
            .sort((a: any, b: any) => a.visitNumber - b.visitNumber)
            .forEach((visit, index) => {
              columns.push({
                id: visit.id,
                scenarioId: visit.scenarioId,
                soaPeriodId: visit.soaPeriodId,
                visitNumber: visit.visitNumber,
                visitId: visit.id,
                columnNumber: tempNumber,
                weekNum: visit.weekNum,
                intervalTolerance: visit.intervalTolerance,
                detail: visit.detail,
                alias: visit.alias,
              });
              tempNumber = tempNumber + 1;
            });
          visitsCount = getVisitsCountByPeriod(scenarioVisits, period.id);
        }
        return {
          key: period.name,
          groupName: period.name,
          periodId: period.id,
          scenarioId: scenarioId,
          visitsCount,
          columns,
        };
      }) || [];
    const visitsGroups =
      activityCategories?.map((category) => {
        return {
          categoryId: category.id,
          categoryName: category.name,
          scenarioId: scenarioId,
          activities:
            scenarioActivities?.filter(
              (soaActivity) => {
                return soaActivity.soaTaxonomy?.category === category.name ||
                  soaActivity.activity?.activityCategory?.name === category.name;
              }).sort((a, b) => {
                if (a.soaTaxonomy && b.soaTaxonomy) {
                  return a.soaTaxonomy.name.localeCompare(b.soaTaxonomy.name)
                } else if (a.activity && b.activity) {
                  return a.activity.name.localeCompare(b.activity.name)
                }
                return 1;
              }) || [],
        };
      }) || [];
    const selectedSoa = filterActivityByShowChildren(scenarioActivities);
    const selectedSoaSum = selectedSoa.reduce((count, item) => count + item.soaVisits.length, 0);
    setSelectedVisits(tempNumber - 1);
    setSelectedActivies(selectedSoaSum);
    setTableData({ columnGroups, visitsGroups });
  }, [
    soaPeriods,
    activityCategories,
    scenarioVisits,
    scenarioId,
    scenarioActivities,
    historicalActivities,
  ]);
  useEffect(() => {
    if (scenarioCapabilityIds && dctCapabilities && dctCapabilities.length > 0) {
      const displayCapabilityArray: SelectedTrialLevelCapability[] = [];
      scenarioCapabilityIds.forEach((dctCapabilityId: string) => {
        const index = dctCapabilities.findIndex((dctCapability: DctCapability) => dctCapability.id === dctCapabilityId);
        if (index > -1) {
          const dctCapability: DctCapability = dctCapabilities[index];
          displayCapabilityArray.push({
            dctCapabilityId,
            name: dctCapability.name,
            color: dctCapability.color,
          });
        }
      });
      setDisplayCapabilities(displayCapabilityArray);
    }
  }, [scenarioCapabilityIds, dctCapabilities]);
  const getVisitsCountByPeriod = (soaVisits: any[], periodId: any) => {
    return soaVisits.filter((visit: any) => visit.soaPeriodId === periodId)
      .length;
  };
  const getActivityOptions = (activitiesDictionary: any[], filterActivities: any[]) => {
    return activitiesDictionary.filter((activityOption: any) => {
      const index = filterActivities.findIndex((filter: any) => filter?.activity?.name === activityOption.name);
      return index === -1;
    });
  };
  const filteredActivityCapabilities = filterActivityVisitCapabilitiesBySelectedSoa(scenarioActivities, activityVisitCapabilities);
  return (
    <Container>
      <Header container>
        <Left item xs={4}>
          <BasicInfoContainer>
            <Title>Add Schedule of Activities</Title>
            <Description>
              Select your activities by considering relevant historical data from
              similar trials. Add, remove, or edit your activities using the table and check
              boxes below.
            </Description>
            <SavedInfoContainer>
              <Check fontSize="small" />
              <SavedInfo>{savedInfo}</SavedInfo>
            </SavedInfoContainer>
          </BasicInfoContainer>
        </Left>
        <Right item xs={8}>
          <TrialLevelCapabilitiesCard
            capabilityList={dctCapabilities}
            displayCapabilities={displayCapabilities}
            handleUpdateScenarioCapability={(selectedCapabilities: SelectedTrialLevelCapability[]) =>
              updateScenarioCapability(selectedCapabilities).then((res: any) => {
                setDisplayCapabilities(selectedCapabilities);
              })
            }
          />
          <SoaBuilderSummaryCard
            leftValue={selectedVisits.toString()}
            leftTitle="Total visits"
            rightValue={getVisitCountFromActivityVisitCapabilities(filteredActivityCapabilities)}
            rightTitle="Total Dct Visits"
          />
          <SoaBuilderSummaryCard
            leftValue={selectedActivities.toString()}
            leftTitle="Total Activities"
            rightValue={filteredActivityCapabilities.length}
            rightTitle="Total Dct Activities"
          />
          <Box
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <ExportButton
              variant="contained"
              color="primary"
              onClick={() => {
                downLoadSoaData(scenarioId);
              }}>Export SoA Data</ExportButton>
            <ExportButton
              variant="contained"
              style={{
                border: "1px solid #D52B1E",
                backgroundColor: "#F9F9F9",
                color: "black",
              }}
              onClick={() => {
                sessionStorage.setItem("PdfScenarioId", scenarioId);
                const url = `${window.location.origin}/dct-capability-summary-pdf`;
                window.open(url);
              }}>Export DCT Summary</ExportButton>
          </Box>
        </Right>
      </Header>

      <TableContainer>
        <Profiler id="muiltichecktable-profiler" onRender={(
          id,
          phase, 
          actualDuration
        ) => {
          console.log(`${id}-${phase}-${actualDuration}`);
        }}>
          <MultiCheckTable
            dctCapabilities={dctCapabilities}
            dctCapabilityRelations={soaDctCapabilityRelations}
            activityVisitCapabilityArray={activityVisitCapabilities}
            tableData={tableData}
            historicalActivities={historicalActivities}
            expandRowKeys={tableData.visitsGroups.map((visitGroup) => visitGroup.categoryId)}
            activitiesArray={getActivityOptions(activities, scenarioActivities)}
            unsupportedTrial={unsupportedTrial}
            createVisit={createVisit}
            deleteVisit={deleteVisit}
            addSoAActivities={addSoAActivities}
            addCustomSoAActivity={addCustomSoAActivity}
            removeSoAActivity={removeSoAActivity}
            fetchActivityVisitsCapabilities={fetchActivityVisitsCapabilities}
            showError={showError}
            updateUserdefinedActivity={updateUserdefinedActivity}
            handleUpdateSoaVisit={updateSoaVisit}
            handleUpdateUserCustomSoACost={updateUserCustomSoACost}
            handleUpdateSoaTaxonomies={updateSoaTaxonomies}
            handleUpdateSoaTaxonomyCapability={updateSoaTaxonomyCapability}
            handleUpdateAllSoaTaxonomyCapability={updateAllSoaTaxonomyCapability}
          />
        </Profiler>
      </TableContainer>
      <BottomContainer>
        <BottomStepBar
          title="Step 1 of 3 - SoA Builder"
          isBlackTheme
          nextStep={`/endpoints/enter/${workspaceId}/${scenarioId}`}
          state={{ unsupportedTrial, trialIndication }}
        />
      </BottomContainer>
    </Container>
  );
};
const Container = styled(Grid)({
  paddingTop: "2.75rem",
  margin: "auto",
});
const Header = styled(Grid)({
  padding: "0 50px",
});
const Left = styled(Grid)({});
const Right = styled(Grid)({
  display: "flex",
  justifyContent: "flex-end",
  paddingTop: "20px",
});
const Title = styled(Typography)({
  fontSize: "1.5rem",
  color: "#2D2D2D",
  lineHeight: "1.813rem",
});
const Description = styled(Typography)({
  fontSize: "1rem",
  color: "#2D2D2D",
  lineHeight: "1.5rem",
  marginTop: "0.438rem",
});
const SavedInfoContainer = styled(Grid)({
  color: "#A59D95",
  display: "flex",
  width: "100%",
  marginTop: "0.5rem",
});
const SavedInfo = styled(Typography)({
  lineHeight: "1.375rem",
  fontSize: "0.75rem",
  marginLeft: "0.125rem",
});
const BasicInfoContainer = styled(Grid)({
  maxWidth: "54.313rem",
  margin: "auto",
});
const TableContainer = styled(Grid)({
  marginTop: "2.25rem",
  padding: "0 1rem 4rem",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  "& .ant-table-wrapper": {
    maxWidth: "100% !important",
  }
});
const BottomContainer = styled(Grid)({
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 999,
});
const ExportButton = styled(Button)(({ theme }) => ({
  borderRadius: "3rem",
  marginLeft: "1rem",
  marginTop: "1rem",
  padding: "4px 10px",
  fontSize: "1rem",
  fontWeight: 500,
  width: "240px",
}));
export default SoACriteriaBuilder;
