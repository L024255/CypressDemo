/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { Check } from "@material-ui/icons";
import * as _ from 'lodash';
import {
  Grid,
  styled,
  Typography,
  // Select,
  Link,
  // IconButton
} from "@material-ui/core";
import SummaryCard from "../IE/components/SummaryCard";
import SeperateTable from "../../components/CustomSeperateTable";
import BottomStepBar from "../../components/BottomStepBar";
import { ActivityModel } from "./type/Activity";
import { useHistory } from "react-router-dom";

interface SoAHistoricalSummaryProps {
  scenarioVisits: any[]
  historicalActivities: ActivityModel[];
  selectedActivities: any[];
  savedInfo: string;
  workspaceId: string;
  scenarioId: string;
  selectedVisitsNum: any;
  soaPeriods?: any[]
  summaryInfo?: {
    avgActivities: any;
    avgVisits: any;
  }
  internalTrialsCount: number;
}

const SoAHistoricalSummary: React.FC<SoAHistoricalSummaryProps> = ({
  historicalActivities,
  savedInfo,
  workspaceId,
  scenarioId,
  summaryInfo,
  selectedVisitsNum,
  selectedActivities,
  scenarioVisits,
  soaPeriods,
  internalTrialsCount
}) => {

  scenarioVisits = _.sortBy(scenarioVisits, ['soaPeriodId', 'visitNumber']);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const leftColumns = [
    {
      width: "13rem",
      label: "my selection",
    },
    {
      width: "",
      label: "appears in similar trials?",
    },
  ];
  const rightColumns = [
    {
      width: "11rem",
      label: "How often does activity occur in similar trials",
    },
    {
      width: "",
      label: "My Selected Visits",
    },
    {
      width: "",
      label: "My Visit Frequency",
    },
    {
      width: "",
      label: "Visit frequency in similar trials",
    },
  ];

  const { push } = useHistory();

  const ModifyEntries = () => {
    push(`/SoA/criteriaBuilder/${workspaceId}/${scenarioId}`);
  };

  const getVisitColumnByVisitNumber = useCallback((visitNumber: number, soaPeriodId: string) => {

    const columnGroups = scenarioVisits;
    const groupIndex = columnGroups.findIndex((group: any) => group.soaPeriodId === soaPeriodId && group.visitNumber === visitNumber);
    return groupIndex + 1;
  }, [soaPeriods, scenarioVisits]);

  const getVisitsDisplay = (selectedVisits: number[]) => {
    if (selectedVisits.length > 1) {
      if (selectedVisits.length === 2) {
        if (selectedVisits[1] - selectedVisits[0] === 1) {
          return `Visits ${selectedVisits[0]}-${selectedVisits[1]}`
        }
        return selectedVisits.map((visit) => `Visit ${visit}`).toString();
      }

      const totalContinueArr: any[] = [];
      let continuesArr: any[] = [];
      for (let i = 0; i < selectedVisits.length - 1; i++) {
        const isContinue = (selectedVisits[i + 1] - selectedVisits[i] === 1);
        if (isContinue) {
          if (continuesArr.findIndex((number) => number === selectedVisits[i]) < 0) {
            continuesArr.push(selectedVisits[i]);
          }
          continuesArr.push(selectedVisits[i + 1]);
        } else {
          if (continuesArr.length > 0) {
            totalContinueArr.push(continuesArr);
            continuesArr = [];
          } else {
            totalContinueArr.push(selectedVisits[i]);
          }
          if (i === selectedVisits.length - 2) {
            totalContinueArr.push(selectedVisits[i + 1]);
          }
        }
      }
      if (continuesArr.length > 0) {
        totalContinueArr.push(continuesArr);
        continuesArr = [];
      }

      return totalContinueArr.map((ele: any) => {
        if (typeof ele === "number") {
          return `Visit ${ele}`;
        } else {
          return `Visit ${ele[0]}-${ele[ele.length - 1]}`
        }
      }).toString();
    }
    return selectedVisits.map((visit) => `Visit ${visit}`).toString();
  }

  const trimChildName = (activity: any) => {
    return activity.name?.split(".").length > 1 ? activity.name.split(".")[1] : activity.name;
  };

  useEffect(() => {
    if (selectedActivities.length > 0) {
      const categories: any[] = [];
      selectedActivities.forEach((soaActivity) => {
        const index = categories.findIndex(
          (category) => category?.id === soaActivity.soaTaxonomy?.activityCategoryId || 
            category?.id === soaActivity.activity.activityCategoryId
        );
        if (index < 0) {
          if (soaActivity.soaTaxonomy) {
            categories.push({
              id: soaActivity.soaTaxonomy.activityCategoryId,
              name: soaActivity.soaTaxonomy.category
            });
          } else if (soaActivity.activity) {
            categories.push({
              id: soaActivity.activity.activityCategoryId,
              name: soaActivity.activity.activityCategory.name,
            });
          }
        }
      });
      setCategories(categories);
    }
  }, [selectedActivities]);
  return (
    <Container>
      <BasicInfoContainer>
        <Title>Your Selections Against Historical Data</Title>
        <Description>
          Compare the activities you've selected in the SoA Builder tab to
          relevant historical data from similar trials. Trial similarity is
          determined by therapeutic area, indication, and trial phase.
        </Description>
        <SavedInfoContainer>
          <Check fontSize="small" />
          <SavedInfo>{savedInfo}</SavedInfo>
        </SavedInfoContainer>
      </BasicInfoContainer>
      <SummaryCardContainer container spacing={3}>
        <Grid item xs={3}>
          <SummaryCard
            style={SummaryCardStyle}
            value={selectedVisitsNum}
            // description="NUMBER OF SELECTED visits"
            description={
              <>
              <div>NUMBER OF</div>
              <div>SELECTED VISITS</div>
              </>
            }
          />
        </Grid>
        <Grid item xs={3}>
          <SummaryCard
            style={SummaryCardStyle}
            value={`${summaryInfo?.avgVisits.min || ""}-${summaryInfo?.avgVisits.max || ""}`}
            // description="Min - Max # Visits in Similar Trials"
            description={
              <>
              <div>Min - Max # Visits</div>
              <div>in Similar Trials</div>
              </>
            }
          />
        </Grid>
        <Grid item xs={3}>
          <SummaryCard
            style={SummaryCardStyle}
            value={internalTrialsCount}
            description="# of historical Lilly trials with similar data"
          />
        </Grid>
      </SummaryCardContainer>
      <SummaryCardContainer container spacing={3} style={{ marginTop: 0 }}>
        <Grid item xs={3}>
        <SummaryCard
          style={SummaryCardStyle}
          value={`${selectedActivities.length}`}
          description={
            <>
            <div>NUMBER OF</div>
            <div>SELECTED ACTIVITES</div>
            </>
          }
        />
        </Grid>
        <Grid item xs={3}>
        <SummaryCard
          style={SummaryCardStyle}
          value={`${summaryInfo?.avgActivities.min || ""}-${summaryInfo?.avgActivities.max || ""}`}
          description={
            <>
            <div>Min - Max # Activites</div>
            <div>in Similar Trials</div>
            </>
          }
        />
        </Grid>
      </SummaryCardContainer>
      <SeperateTableContainer>
        {categories.map((category, categoryIndex) => {
          const currentActivities = selectedActivities.filter(
            (soaActivity) =>  soaActivity.soaTaxonomy?.category === category?.name
              || soaActivity.activity?.activityCategory?.name === category?.name
          ).map((soaActivity: any) => {
            const index = historicalActivities.findIndex((histActivity: any) => 
              histActivity.id === soaActivity.activityId || histActivity.id === soaActivity.soaTaxonomyId
            );
            if (index > -1) {
              const historicalActivity = historicalActivities[index];
              historicalActivity.name = trimChildName(historicalActivity);
              return historicalActivity;
            }

            return {
              id: soaActivity.activityId || soaActivity.soaTaxonomyId,
              name: trimChildName(soaActivity.activity),
              userDefined: soaActivity.activity.userDefined,
              cost: soaActivity.activity.cost,
              appears: "false",
              frequency: undefined,
              soaVisits: soaActivity.soaVisits,
              visitFrequency: undefined,
              activityCategoryId: soaActivity.activity.activityCategoryId,
              activityCategory: soaActivity.activity.activityCategory,
            };
          }).sort((a, b) => a.name?.localeCompare(b.name));
          const leftData: any[] = [];
          const rightData: any[] = [];
          currentActivities.forEach((soaActivity: any) => {
            leftData.push([soaActivity.name, soaActivity.appears]);
            const selectedActivity = selectedActivities.find(
              (act) => act.activityId === soaActivity.id || act.soaTaxonomyId === soaActivity.id
            );
            let selectedVisits = [];
            if (selectedActivity && selectedActivity.soaVisits?.length > 0) {
              selectedVisits = selectedActivity.soaVisits.map((visit: any) => {
                const columnIndex = getVisitColumnByVisitNumber(visit.visitNumber, visit.soaPeriodId);
                return columnIndex;
              }).sort((a: any, b: any) => (a - b)).map((index: any) => index);
            }
            rightData.push([
              {
                val: soaActivity.frequency !== undefined
                  ? `${(soaActivity.frequency * 100).toFixed(0)}%`
                  : "N/A",
                explain: "",
              },
              { val: selectedVisits.length ? getVisitsDisplay(selectedVisits) : "N/A", explain: "" },

              { val: selectedVisits.length ? `${Math.round((selectedVisits.length / selectedVisitsNum) * 100)}% of visits` : "N/A", explain: "" },
              {
                val: soaActivity.visitFrequency
                  ? `${(soaActivity.visitFrequency * 100).toFixed(0)}% of visits`
                  : "N/A",
                explain: "",
              },

            ]);
          });
          return (
            <SeperateTable
              key={`table-${categoryIndex}`}
              tableId={`table-${categoryIndex}`}
              title={category.name}
              action={
                <Action
                  type="button"
                  variant="body2"
                  onClick={() => {
                    ModifyEntries();
                  }}>
                  Update My Selection
                </Action>
              }
              rightColumns={rightColumns}
              leftColumns={leftColumns}
              leftData={leftData}
              rightData={rightData}
              style={{ marginTop: "0.875rem" }}
              leftStyle={{ width: "20rem" }}
              rightStyle={{ width: "40rem" }}
              hasLastColorRow
            />
          );
        })}
      </SeperateTableContainer>
      <BottomContainer>
        <BottomStepBar
          title="Step 1 of 3 - SoA Builder"
          isBlackTheme
          nextStep={`/endpoints/enter/${workspaceId}/${scenarioId}`}
        />
      </BottomContainer>
    </Container>
  );
};

const Action = styled(Link)({
  fontSize: "0.75rem",
  color: "#D52B1E",
  lineHeight: "0.875rem",
  textDecoration: "underline",

});

const SummaryCardStyle = {
  height: "113px",
};
const Container = styled(Grid)({
  paddingTop: "2.75rem",
  margin: "auto",
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
  maxWidth: "60rem",
  margin: "auto",
});
const SummaryCardContainer = styled(Grid)({
  marginTop: "1.813rem",
  display: "flex",
  justifyContent: "flex-start",
  maxWidth: "60rem",
  margin: "auto",

  "& .MuiGrid-item": {
    paddingLeft: 0
  },
});
const SeperateTableContainer = styled(Grid)({
  maxWidth: "60rem",
  margin: "auto",
  paddingBottom: "7rem",
});
const BottomContainer = styled(Grid)({
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 999,
});

export default SoAHistoricalSummary;
