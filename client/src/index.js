import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from "apollo-link-error";

const errorHandle = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({ uri: 'http://localhost:3002/graphql'});

const client = new ApolloClient({
    link: errorHandle.concat(httpLink),
    cache: new InMemoryCache({
        dataIdFromObject: o => o.id
    })
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App test='123'/>
    </ApolloProvider>,
    document.getElementById('root')
);

registerServiceWorker();
