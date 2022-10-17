import { QueryByString } from "../../api/apollo";

export const useQueryUsers = () => {
  const QUERY_USERS = `
    query users {
      users {
          id
          username
          name
          createdAt
          updatedAt
          deletedAt
          profile {
              id
              recentTrials
              createdAt
              updatedAt
              deletedAt
              userId
          }
      }
    }
  `;
  return QueryByString(QUERY_USERS);
};
