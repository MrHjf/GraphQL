import React, {Component} from 'react';
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
                <button onClick={this.onClick.bind(this)}>update(1)</button>
                <button onClick={this.onDelete.bind(this)}>delete(2)</button>
                {allAuthor.map((author, index) => <ul key={index}>
                    <li>{author.id}</li>
                    <li>{author.firstName}</li>
                    <li>{author.lastName}</li>
                </ul>)}
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
    query add($id: Int!){
        author(id: $id){
            ...AuthorInfo
        },
        allAuthor {
            ...AuthorInfo
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
    graphql(mutationDef2, {name: 'delete'})
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
