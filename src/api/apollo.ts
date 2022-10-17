import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useMutation,
  DefaultOptions,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from '@apollo/client';
import Cookies from "js-cookie";
import Environment from "../config/environment";

const { apiUrl } = new Environment();

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const link = new HttpLink({
  uri: apiUrl + "/graphql",
  // Additional options
});


// get token each time dyncamically 
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get("accessToken") || localStorage.getItem("accessToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
});

export const client = new ApolloClient({
  // uri: apiUrl + "/graphql",
  // headers: {
  //   authorization: `Bearer ${Cookies.get("accessToken")}`,
  // },
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export const QueryByString: any = (queryString: string, variables?: []) => {
  const query = gql`
    ${queryString}
  `;
  return useQuery(query, { variables: variables });
};

export const MutationByString: any = (mutationString: string) => {
  const query = gql`
    ${mutationString}
  `;
  return useMutation(query);
};

export const QueryByStringWithClient: any = (
  queryString: string,
  variables: any[]
) => {
  const query = gql`
    ${queryString}
  `;
  return client.query({ query, variables }).then((res: any) => {
    if (res.errors) {
      console.log("response errors:");
      console.error(res.errors);
    }
    return res;
  }).catch((error: any) => {
    console.error(error);
  });
};
