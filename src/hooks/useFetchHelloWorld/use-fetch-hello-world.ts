import { QueryByString } from "../../api/apollo";

export const useFetchHelloWorld = () => {
  const queryString = `
    query Query {
      hello
    }
  `;
  const { data, loading, error } = QueryByString(queryString);
  return { data, loading, error };
};
