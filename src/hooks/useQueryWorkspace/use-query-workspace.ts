import { QueryByString } from "../../api/apollo";
import { graphqlStringMap } from "../../api/fetchByTypes";

export const useQueryWorkspace = () => {
  const QUERY_WORKSPACE = graphqlStringMap.fetchTrailWorkspace;
  return (id: any) => {
    const { data, loading, error } = QueryByString(QUERY_WORKSPACE, { id });
    return { data, loading, error };
  };
};
