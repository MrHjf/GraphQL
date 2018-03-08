import React, {Component} from 'react';
import './App.css';
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo';
import {withApollo} from 'react-apollo';
import {Table, Form, Input, Button, Popconfirm, message} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const queryDef = gql`
    fragment AuthorInfo on Author {
        id,
        username
        email
        phone
        posts{
            title
            content
            id
            user_id
        }
    }
    query getAuthor($limit: Int, $offset: Int){
        allAuthor(limit: $limit, offset: $offset) {
            rows{
                ...AuthorInfo
            }
            count
        }
    }
`;
// Todo 还没写
const mutationDef = gql`
    mutation action($id : Int!, $firstName: String!){
        updateAuthor(id: $id, firstName: $firstName) {
            id,
        }
    }
`;
const mutationDef2 = gql`
    mutation delete($id: String!) {
        deleteAuthor(id: $id) {
            status
        }
    }
`;
const mutationDef3 = gql`
    mutation add($input: addAuthorInput!) {
        addAuthor(input: $input) {
            status
            err
            result
        }
    }
`;

class AddAuthorForm extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.add({
                    variables: {input: {...values}},
                    refetchQueries: [{query: queryDef, variables: {limit: 10}}]
                })
            }
        });
    };

    render() {

        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 1},
                sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 5},
                sm: {span: 3},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 0,
                    offset: 0,
                },
                sm: {
                    span: 4,
                    offset: 1,
                },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="userName">
                    {getFieldDecorator('username', {
                        rules: [{
                            required: true, message: 'Please input your userName!',
                        }]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="E-mail">
                    {getFieldDecorator('email', {
                        rules: [{
                            required: true, message: 'Please input your E-mail!',
                        }]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Phone">
                    {getFieldDecorator('phone', {
                        rules: [{
                            required: true, message: 'Please input your phone!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Title">
                    {getFieldDecorator('title', {
                        rules: [{
                            message: 'Please input your post title'
                        }]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Content">
                    {getFieldDecorator('content', {
                        rules: [{
                            message: 'Please input your post content'
                        }]
                    })(
                        <TextArea/>
                    )}

                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Add</Button>
                </FormItem>
            </Form>
        );
    }
}

class AuthorList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            limit: 10,
            firstName: '',
            lastName: '',
            index: 1,
        };
    }

    onClick() {
        this.props.update({
            variables: {id: 1, firstName: 'author'}
        }).then(({data}) => console.log(data))
            .catch(error => console.log(error))
    }

    _handlePage(pageInfo) {
        const {current} = pageInfo;
        let {offset, limit} = this.state;
        offset = (current - 1) * limit;
        this.setState({offset}, this.fetchMore);
    }

    fetchMore() {
        this.props.data.fetchMore({
            variables: {
                offset: this.state.offset
            },
            updateQuery: (previousResult, {fetchMoreResult, queryVariables}) => {
                return {
                    ...fetchMoreResult
                }
            },
        })
    }

    confirm(id) {
        this.props.delete({
            variables: {id}
        }).then(() => {
            message.success('Click on Yes');
            this.props.data.refetch()
        }).catch(error => console.log(error));
    }

    cancel(e) {
        message.error('Click on No');
    }

    formatPostsTitle(posts) {
        const titleArr = [];
        posts.map(post => {
            titleArr.push(post.title);
        });
        return titleArr.join('、');
    }

    getColumns() {
        const columns = [{
            title: 'userName',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: 'Phone',
            key: 'phone',
            dataIndex: 'phone'
        }, {
            title: 'Title',
            key: 'title',
            render: (text, record) => (
                <span>
                    {text.posts && this.formatPostsTitle(text.posts)}
                </span>
            )
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Popconfirm title="Are you sure delete?" onConfirm={() => this.confirm(text.id)}
                                onCancel={this.cancel} okText="Yes" cancelText="No">
                        <Button type="danger">删除</Button>
                    </Popconfirm>
                </span>
            )
        }];
        return columns;
    }

    render() {
        const {data: {loading, allAuthor}} = this.props;
        const {limit} = this.state;
        const columns = this.getColumns();
        if (loading) {
            return <p>Loading...</p>
        }
        return (
            <div>
                <div>
                    <Table columns={columns}
                           dataSource={allAuthor && allAuthor.rows}
                           pagination={{defaultPageSize: limit, total: allAuthor.count}}
                           rowKey={record => record.id}
                           onChange={this._handlePage.bind(this)}/>

                    <WrappedAddAuthorForm/>
                </div>
            </div>
        );
    }
}

const QueryWithData = compose(
    graphql(queryDef, {options: {variables: {limit: 10}}}),
    graphql(mutationDef, {name: 'update'}),
    graphql(mutationDef2, {name: 'delete'})
)(AuthorList);

const WrappedAddAuthorForm = compose(
    graphql(mutationDef3, {name: 'add'})
)(Form.create()(AddAuthorForm));

class App extends Component {
    render() {
        return (
            <div className="App">
                <QueryWithData test='345'/>
            </div>
        );
    }
}

export default withApollo(App);
