import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, styled } from "@material-ui/core";

import Hero from "./components/Hero";
import TrialList from "./components/MyTrials";
import { TrialWorkspacesProps } from "./components/MyTrials/TrialList";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import { QueryByStringWithClient } from "../../api/apollo";
import CustomErrorBar from "../../components/CustomErrorBar";
import { formatUserName } from "../../utils/getDataUtil";
import { useUpdateFavourateTrialWorkspace } from "../../hooks/useUpdateFavourateTrial";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { formatTime } from "../../utils/formatUtil";

export interface HomePageProps {}
const HomePage: React.FC<HomePageProps> = () => {
  const {
    addFavourateTrial,
    removeFavourateTrial,
  } = useUpdateFavourateTrialWorkspace();
  const { pathname } = useLocation();
  const [searchOptions, setSearchOptions] = useState<any[]>([]);
  const [trialWorkspaces, setTrialWorkspaces] = useState<
    TrialWorkspacesProps[]
  >([]);
  const [favourateTrials, setFavourateTrials] = useState<
    {
      trialTitle: string;
      trialAlias: string;
      id: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sysError, setSysError] = useState("");
  const [userName, setUserName] = useState("");

  const getTrialWorkspaces = (isAllTrial: boolean) => {
    setLoading(true);
    const graphqlString = isAllTrial
      ? graphqlStringMap.fetchAllTrialWorkspaceList
      : graphqlStringMap.fetchMyTrialWorkspaceList;
    fetchByGraphqlString(graphqlString)
      .then((res: any) => {

        if (res) {

          const myTrialWorkspaces = isAllTrial
            ? res.data.allTrialWorkspaces
            : res.data.myTrialWorkspaces;
          const result = myTrialWorkspaces.map((workspace: any) => {
            const owner = formatUserName(workspace.owner.name);
            const updateTime = formatTime(workspace?.updatedAt);
            return {
              id: workspace.id,
              trialTitle: workspace.userTrial.trialTitle,
              trialAlias: workspace.userTrial.trialAlias,
              trialDescription: workspace.userTrial.trialDescription,
              trialOwner: owner,
              pediatricStudy: workspace.userTrial.pediatricStudy,
              therapeuticArea: workspace.userTrial.therapeuticArea?.name,
              studyPhase: workspace.userTrial.phase?.name,
              studyType: workspace.userTrial.studyType?.name,
              indication: workspace.userTrial.indication?.name,
              scenariosCount: workspace.scenarios?.length || 0,
              users: workspace.users || [],
              dataVersion: workspace.dataVersion?.name,
              updateTime,
            };
          });

          setTrialWorkspaces(result);
        }
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getUserInfo = () => {
    fetchByGraphqlString(graphqlStringMap.fetchCurrentUserInfo)
      .then((res: any) => {
        if (res) {
          const favorateTrailWrokspaces =
            res.data?.whoami?.favoriteTrialWorkspaces.map((workspace: any) => {
              return {
                trialTitle: workspace.userTrial.trialTitle,
                trialAlias: workspace.userTrial.trialAlias,
                id: workspace.id,
              };
            }) || [];
          setFavourateTrials(favorateTrailWrokspaces);
          const userName = res.data?.whoami.name.replace(/ - Network/g, "");
          setUserName(userName);
        }
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      });
  };
  const handleSearch = useCallback((searchOption: any) => {
    const isAllTrial = pathname.includes("all-trials");
    setLoading(true);
    QueryByStringWithClient(graphqlStringMap.searchTrial, {
      input: {
        text: searchOption.toString(),
        myTrialWorkspaceFlag: !isAllTrial
      }
    })
      .then((res: any) => {
        const workspaceArr: TrialWorkspacesProps[] = [];
        res.data?.trialSearch?.forEach((resultObj: any) => {
          const workspace: TrialWorkspacesProps = {
            id: resultObj.trialWorkspace?.id,
            trialTitle: resultObj.trialTitle,
            trialAlias: resultObj.trialAlias,
            trialDescription: resultObj.trialDescription,
            trialOwner: "",
            scenariosCount: resultObj?.trialWorkspace?.scenarios?.length || 0,
            updateTime: formatTime(resultObj?.trialWorkspace?.trialUpdatedAt),
            pediatricStudy: resultObj.pediatricStudy,
            therapeuticArea: resultObj.therapeuticArea?.name,
            studyPhase: resultObj.phase?.name,
            studyType: resultObj.studyType?.name,
            indication: resultObj.indication?.name,
            users: resultObj?.trialWorkspace?.users || [],
          };
          workspaceArr.push(workspace);
        });
        setTrialWorkspaces(workspaceArr);
      })
      .catch((error: any) => {
        setSysError(error.message || "Search Trial workspace failed.");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        setSearched(true);
      });
    setSearchOptions([searchOption]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const handleAddFavourateWorkspace = (trialId: string) => {
    setSubmitLoading(true);
    addFavourateTrial({ id: trialId })
      .then((res: any) => {
        if (res.data?.addFavoriteTrialWorkspace) {
          getUserInfo();
        }
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again");
        console.log(error);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  const handleRemoveFavourateWorkspace = (trialId: string) => {
    setSubmitLoading(true);
    removeFavourateTrial({ id: trialId })
      .then((res: any) => {
        if (res.data?.removeFavoriteTrialWorkspace) {
          getUserInfo();
        }
      })
      .catch((error: any) => {
        setSysError(error.message || "There was an error, please try again.");
        console.log(error);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  useEffect(() => {
    const isAllTrial = pathname.includes("all-trials");
    getUserInfo();
    getTrialWorkspaces(isAllTrial);
    setSearched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <Container>
      <CustomErrorBar
        open={Boolean(sysError)}
        onClose={() => setSysError("")}
        content={sysError}
      />
      <CustomLoading open={submitLoading} />
      <Hero onSearch={handleSearch} userName={userName}/>
      <TrialList
        loading={loading}
        searched={searched}
        filterOptions={searchOptions}
        trialWorkspaces={trialWorkspaces}
        favourateTrials={favourateTrials}
        handleUpdateFavourateTrial={(trialId, isAdd) => {
          if (!submitLoading) {
            if (isAdd) {
              handleAddFavourateWorkspace(trialId);
            } else {
              handleRemoveFavourateWorkspace(trialId);
            }
          }
        }}
      />
    </Container>
  );
};

const Container = styled(Grid)({
  minHeight: "100vh",
  margin: "auto",
});

export default HomePage;
