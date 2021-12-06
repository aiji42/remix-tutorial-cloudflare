import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from '@apollo/client'

export const client = new ApolloClient({
  uri: 'https://workers-graphql-server.aiji422990.workers.dev',
  cache: new InMemoryCache()
})
