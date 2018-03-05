import React, { Component } from 'react';
import logo from '../../static/logo.svg';
import './App.css';
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo';
import {withApollo} from 'react-apollo';

// const channelList = ({data: {loading, error, author}}) => {
//     if (loading) {
//         return <p>Loading。。。</p>
//     }
//     if (error) {
//         return <p>{error.message}</p>
//     }
//     return (
//         <ul>
//             {/*{author.friends.map((channel, index) => <li key={index}>{channel.id}</li>)}*/}
//             <li>{author.id}</li>
//         </ul>
//     )
// };

class channelList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            limit: 2,
            firstName: '',
            lastName: ''
        };
    }
    onClick() {
        this.props.update({
            variables: {id: 1, firstName: 'author'}
        }).then(({data}) => console.log(data))
            .catch(error => console.log(error))
    }

    onDelete() {
        this.props.delete({
            variables: {id: 4}
        }).then(this.props.data.refetch())
            .catch(error => console.log(error))
    }

    addAuthor() {
        console.log(this.state);
        this.props.add({
            variables: {input: {firstName: this.state.firstName, lastName: this.state.lastName}},
        })
    }

    _handlePage(type) {
        let {offset, limit} = this.state;
        offset = type === 'next' ? offset + limit : offset - limit;
        this.setState({offset}, this.fetchMore);
    }

    fetchMore() {
        this.props.data.fetchMore({
            variables: {
                offset: this.state.offset
            },
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
                console.log(previousResult, fetchMoreResult, queryVariables);
                return {
                    ...fetchMoreResult
                }
            },
        })
    }

    getFirstName(e) {
        this.setState({
            firstName: e.target.value
        })
    }
    getLastName(e) {
        this.setState({
            lastName: e.target.value
        })
    }

    render() {
        console.log(this.props);
        const {data: {loading, author, allAuthor}} = this.props;
        // const {loading, author} = this.props;
        if (loading || !author) {
            return <p>Loading...</p>
        }
        return (
            <ul>
                {/*{author.friends.map((channel, index) => <li key={index}>{channel.id}</li>)}*/}
                <li>current author</li>
                <li>{author.id}</li>
                <li>{author.firstName}</li>
                <li>{author.lastName}</li>
                <li><input type="text" name="firstName" onChange={this.getFirstName.bind(this)} value={this.state.firstName}/></li>
                <li><input type="text" name="lastName" onChange={this.getLastName.bind(this)} value={this.state.lastName}/></li>
                <li><button onClick={this.addAuthor.bind(this)}>add</button></li>
                <button onClick={this.onClick.bind(this)}>update(1)</button>
                <button onClick={this.onDelete.bind(this)}>delete(2)</button>
                {allAuthor.map((author, index) => <ul key={index}>
                    <li>{author.id}</li>
                    <li>{author.firstName}</li>
                    <li>{author.lastName}</li>
                </ul>)}
                <button onClick={() => this._handlePage("prev")}>prev</button>
                <button onClick={() => this._handlePage("next")}>next</button>
            </ul>
        )
    }
}

const queryDef = gql`
    fragment AuthorInfo on Author {
        id,
        firstName,
        lastName
    }
    query getAuthor($id: Int!, $limit: Int, $offset: Int){
        author(id: $id){
            ...AuthorInfo
            authorDetail{
             age
            }
        },
        allAuthor(limit: $limit, offset: $offset) {
            ... on Author{
                id,
                firstName
            }
        }
    }
`;

const mutationDef = gql`
    mutation action($id : Int!, $firstName: String!){
        updateAuthor(id: $id, firstName: $firstName) {
            id,
            firstName,
            lastName
        }
    }
`;
const mutationDef2 = gql`
    mutation delete($id: Int!) {
        deleteAuthor(id: $id) {
            id,
            firstName,  
            lastName
        }
    }
`;
const mutationDef3 = gql`
    mutation add($input: addAuthorInput!) {
        addAuthor(input: $input) {
            id
        }
    }
`

// const QueryWithData = graphql(queryDef,{
//     options: {variables: {firstName: 'hello'}},
//     props: ({test, data: {loading, author, refetch}}) => ({
//         loading: loading,
//         author: author,
//         refetch: refetch,
//         test
//     }),
// })(channelList);

// const QueryWithData = graphql(mutationDef)(channelList);
const QueryWithData = compose(
    graphql(queryDef, {options: {variables: {id: 1}}}),
    graphql(mutationDef, {name: 'update'}),
    graphql(mutationDef2, {name: 'delete'}),
    graphql(mutationDef3, {name: 'add'})
)(channelList);

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <QueryWithData test='345'/>
            </div>
        );
    }
}

export default withApollo(App);
