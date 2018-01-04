import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {WebSocketLink} from "apollo-link-ws";
import {InMemoryCache} from 'apollo-cache-inmemory';
import {getMainDefinition} from "apollo-utilities";
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppRouter from "./AppRouter";

const GRAPHQL_ENDPOINT = '';
const SUBSCRIPTIONS_ENDPOINT = '';

if (!GRAPHQL_ENDPOINT) {
  throw Error('Not provided GraphQL endpoint.')
}

if (!SUBSCRIPTIONS_ENDPOINT) {
  throw Error('Not provided GraphQL subscriptions endpoint.')
}

const httpLink = new HttpLink({uri: GRAPHQL_ENDPOINT});

const wsLink = new WebSocketLink({
  uri: SUBSCRIPTIONS_ENDPOINT,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const withApolloProvider = Comp => (
  <ApolloProvider client={client}>{Comp}</ApolloProvider>
);

ReactDOM.render(
  withApolloProvider(<AppRouter/>),
  document.getElementById('root')
);
registerServiceWorker();
