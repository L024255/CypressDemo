import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, styled, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import CollapseContainer from "../../../../components/CollapseContainer";
import FavoriteTrialCard from "./FavoriteTrialCard";
import TrialListSkeleton from "../HomepageSkeleton/HomePageSkeleton";
import MostRecentCard from "./MostRecentCard";

export interface TrialWorkspacesProps {
  trialTitle: string;
  trialAlias: string;
  trialDescription: string;
  trialOwner: string;
  pediatricStudy?: string;
  therapeuticArea?: string;
  studyPhase?: string;
  studyType?: string;
  indication?: string;
  id?: string;
  isFavourateTrial?: boolean;
  scenariosCount?: number;
  updateTime?: string;
  users?: any[];
  dataVersion?: string;
}
export interface MyTrialProps {
  filterOptions?: string[];
  trialWorkspaces: TrialWorkspacesProps[];
  favourateTrials?: {
    trialTitle: string;
    trialAlias: string;
    id: string;
  }[];
  loading?: boolean;
  searched: boolean;
  handleUpdateFavourateTrial?: (trialId: string, isAdd: boolean) => void;
}
const TrialList: React.FC<MyTrialProps> = ({
  filterOptions,
  trialWorkspaces,
  favourateTrials,
  loading,
  searched,
  handleUpdateFavourateTrial,
}) => {
  const history = useHistory();
  const [wrokspaceCardData, setWorkspaceCardData] = useState<
    TrialWorkspacesProps[]
  >([]);
  const handleCreateNew = () => {
    history.push("create-new");
  };
  const isAllTrial = history.location.pathname.includes("all-trials");
  let title = isAllTrial ? "All Trials" : "My Trials";
  if (searched) {
    title = "Search Result";
  }
  useEffect(() => {
    const newTrials = trialWorkspaces.map((workspace) => {
      const newWorkspace = { ...workspace };
      if (favourateTrials?.find((favorate) => favorate.id === workspace.id)) {
        newWorkspace.isFavourateTrial = true;
      } else {
        newWorkspace.isFavourateTrial = false;
      }
      return newWorkspace;
    });
    setWorkspaceCardData(newTrials);
  }, [trialWorkspaces, favourateTrials]);
  const renderData = () => (
    <>
      <TitleRow>
        <Title variant="h2">{title}</Title>
      </TitleRow>
      {!searched && !isAllTrial && (
        <MyFavoriteTrials favourateTrials={favourateTrials || []} />
      )}
      <TrialCardList
        searched={searched}
        isAllTrial={isAllTrial}
        filterOptions={filterOptions}
        trialWorkspaceData={wrokspaceCardData}
        handleUpdateFavourateTrial={handleUpdateFavourateTrial}
      />
      <BottomButton
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
      >
        <Add style={{ marginRight: "10px" }} />
        Create New
      </BottomButton>
    </>
  );
  return (
    <Container container justify="center">
      {loading ? <TrialListSkeleton /> : renderData()}
    </Container>
  );
};

const Container = styled(Grid)({
  maxWidth: "80rem",
  minHeight: "40rem",
  padding: "3rem 5rem 5rem 5rem",
  margin: "auto",
  position: "relative",
});
const TitleRow = styled("div")({
  display: "flex",
  justifyContent: "center",
});
const Title = styled(Typography)({
  margin: "auto",
  fontWeight: 500,
});
const MyFavoriteTrials: React.FC<{
  favourateTrials: {
    trialTitle: string;
    trialAlias: string;
  }[];
}> = ({ favourateTrials }) => {
  return (
    <CollapseContainer title="My Favorite Trials">
      {favourateTrials.map((trial, index) => (
        <FavoriteTrialCard
          key={index}
          title={trial.trialTitle}
          subTitle={trial.trialAlias}
        />
      ))}
    </CollapseContainer>
  );
};
const TrialCardList: React.FC<{
  isAllTrial: boolean;
  searched: boolean;
  filterOptions?: string[];
  trialWorkspaceData: TrialWorkspacesProps[];
  handleUpdateFavourateTrial?: (trialId: string, isAdd: boolean) => void;
}> = ({
  isAllTrial,
  searched,
  filterOptions,
  trialWorkspaceData,
  handleUpdateFavourateTrial,
}) => {
  const getAuthors = (users: any[]) => {
    const authors = users.map((user) => {
      const name = user?.name.split(" -")[0] || "";
      return " " + name;
    });
    return authors.toString();
  };

  return isAllTrial || searched ? (
    <ListContainer>
      {trialWorkspaceData?.map((trialWorkspace: TrialWorkspacesProps, index) => (
        <MostRecentCard
          key={index}
          title={trialWorkspace.trialTitle}
          trialId={trialWorkspace.id || ""}
          subTitle={trialWorkspace.trialAlias}
          isFavourate={trialWorkspace.isFavourateTrial}
          author={`by ${getAuthors(trialWorkspace.users || [])}`}
          description={trialWorkspace.trialDescription}
          scenarioInProgress={`${trialWorkspace.scenariosCount}`}
          time={`as of ${trialWorkspace.updateTime}`}
          attributes={[]}
          dataVersion={trialWorkspace.dataVersion || ""}
          handleUpdateFavourateTrial={() => {
            handleUpdateFavourateTrial &&
              trialWorkspace.id &&
              handleUpdateFavourateTrial(
                trialWorkspace?.id || "",
                !trialWorkspace.isFavourateTrial
              );
          }}
        />
      ))}
    </ListContainer>
  ) : (
    <CollapseContainer title="Most Recent">
      {trialWorkspaceData.map((trialWorkspace, index) => {
        const atributes = [
          {
            title: "THERAPEUTIC AREA",
            value: trialWorkspace.therapeuticArea || "-",
            matched: filterOptions?.find(
              (option) => option === trialWorkspace.therapeuticArea
            ),
          },
          {
            title: "INDICATION",
            value: trialWorkspace.indication || "-",
            matched: filterOptions?.find(
              (option) => option === trialWorkspace.indication
            ),
          },
          {
            title: "STUDY PHASE",
            value: trialWorkspace.studyPhase || "-",
            matched: filterOptions?.find(
              (option) => option === trialWorkspace.studyPhase
            ),
          },
          {
            title: "STUDY TYPE",
            value: trialWorkspace.studyType || "-",
            matched: filterOptions?.find(
              (option) => option === trialWorkspace.studyType
            ),
          },
          {
            title: "TRIAL TITLE",
            value: trialWorkspace.trialTitle || "-",
            matched: filterOptions?.find(
              (option) => option === trialWorkspace.trialTitle
            ),
          },
          {
            title: "PEDIATRIC STUDY",
            value: trialWorkspace.pediatricStudy ? "Yes" : "No",
          },
        ];
        return (
          <MostRecentCard
            key={index}
            trialId={trialWorkspace.id || ""}
            title={trialWorkspace.trialTitle}
            subTitle={trialWorkspace.trialAlias}
            author={`by ${getAuthors(trialWorkspace.users || [])}`}
            description={trialWorkspace.trialDescription}
            scenarioInProgress={`${trialWorkspace.scenariosCount}`}
            time={`as of ${trialWorkspace.updateTime}`}
            isFavourate={trialWorkspace.isFavourateTrial}
            attributes={atributes}
            dataVersion={trialWorkspace.dataVersion || ""}
            handleUpdateFavourateTrial={() => {
              handleUpdateFavourateTrial &&
                trialWorkspace.id &&
                handleUpdateFavourateTrial(
                  trialWorkspace?.id || "",
                  !trialWorkspace.isFavourateTrial
                );
            }}
          />
        );
      })}
    </CollapseContainer>
  );
};
const ListContainer = styled(Grid)({
  marginTop: "20px",
  width: "100%",
});
const BottomButton = styled(Button)(({ theme }) => ({
  width: "20.5rem",
  height: "3.938rem",
  position: "fixed",
  bottom: 10,
  borderRadius: "3rem",
  padding: "0.75rem 1.75rem",
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: "1.5rem",
  letterSpacing: 0,
}));

export default TrialList;
