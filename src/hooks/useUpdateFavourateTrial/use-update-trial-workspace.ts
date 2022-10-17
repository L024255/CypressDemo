import { MutationByString } from "../../api/apollo";
export const useUpdateFavourateTrialWorkspace = () => {
  const ADD_FAVOURATE_TRIAL = `
    mutation addFavoriteTrialWorkspace ($id: String!) {
        addFavoriteTrialWorkspace (id: $id)
    }
  `;
  const REMOVE_FAVOURATE_TRIAL = `
    mutation removeFavoriteTrialWorkspace ($id: String!) {
      removeFavoriteTrialWorkspace (id: $id)
    }
  `;
  const [addFavoriteTrialWorkspace] = MutationByString(ADD_FAVOURATE_TRIAL);
  const [removeFavoriteTrialWorkspace] = MutationByString(
    REMOVE_FAVOURATE_TRIAL
  );
  const addFavourateTrial = (variables: { id: string }) => {
    return addFavoriteTrialWorkspace({ variables });
  };
  const removeFavourateTrial = (variables: { id: string }) => {
    return removeFavoriteTrialWorkspace({ variables });
  };
  return { addFavourateTrial, removeFavourateTrial };
};
