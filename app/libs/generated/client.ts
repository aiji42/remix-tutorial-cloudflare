import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Pokemon = {
  __typename?: 'Pokemon';
  height: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  sprites: PokemonSprites;
  weight: Scalars['Int'];
};

export type PokemonSprites = {
  __typename?: 'PokemonSprites';
  back_default: Scalars['String'];
  back_female: Scalars['String'];
  back_shiny: Scalars['String'];
  back_shiny_female: Scalars['String'];
  front_default: Scalars['String'];
  front_female: Scalars['String'];
  front_shiny: Scalars['String'];
  front_shiny_female: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  pokemon?: Maybe<Pokemon>;
};


export type QueryPokemonArgs = {
  id: Scalars['ID'];
};

export type GetPokemonQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPokemonQuery = { __typename?: 'Query', pokemon?: { __typename?: 'Pokemon', id: string, name: string, height: number, weight: number, sprites: { __typename?: 'PokemonSprites', front_default: string, back_default: string } } | null | undefined };


export const GetPokemonDocument = gql`
    query getPokemon($id: ID!) {
  pokemon(id: $id) {
    id
    name
    height
    weight
    sprites {
      front_default
      back_default
    }
  }
}
    `;

/**
 * __useGetPokemonQuery__
 *
 * To run a query within a React component, call `useGetPokemonQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPokemonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPokemonQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPokemonQuery(baseOptions: Apollo.QueryHookOptions<GetPokemonQuery, GetPokemonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPokemonQuery, GetPokemonQueryVariables>(GetPokemonDocument, options);
      }
export function useGetPokemonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPokemonQuery, GetPokemonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPokemonQuery, GetPokemonQueryVariables>(GetPokemonDocument, options);
        }
export type GetPokemonQueryHookResult = ReturnType<typeof useGetPokemonQuery>;
export type GetPokemonLazyQueryHookResult = ReturnType<typeof useGetPokemonLazyQuery>;
export type GetPokemonQueryResult = Apollo.QueryResult<GetPokemonQuery, GetPokemonQueryVariables>;