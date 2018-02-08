import React, { Component } from 'react';
import logo from '../../static/logo.svg';
import './App.css';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

const channelList = ({data: {loading, error, author}}) => {
    console.log(author);
    if (loading) {
        return <p>Loading。。。</p>
    }
    if (error) {
        return <p>{error.message}</p>
    }
    return (
        <ul>
            {/*{author.friends.map((channel, index) => <li key={index}>{channel.id}</li>)}*/}
            <li>{author.id}</li>
        </ul>
    )
};

const queryDef = gql`
    query {
        author{
            id
        }
    }
`;

const QueryWithData = graphql(queryDef)(channelList);

class App extends Component {
  render() {
    return (
      <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <QueryWithData />
      </div>
    );
  }
}

export default App;
