import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChatProvider } from "./containers/hooks/useChat";
import App from "./containers/App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css";

import {
  ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split
 } from '@apollo/client';
 import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
 import { getMainDefinition } from '@apollo/client/utilities';
 import { createClient } from 'graphql-ws';






 const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Create a WebSocket link:
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  options: { reconnect: true },
}));

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);





 const client = new ApolloClient({
  link,
  cache: new InMemoryCache(
  ),

 });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ChatProvider><App /></ChatProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
