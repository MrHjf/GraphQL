import {
    makeExecutableSchema,
} from 'graphql-tools';
import resolvers from './resolvers';

// 定义schema
const typeDefs = `
interface AuthorInterface{
  firstName: String
}
type AuthorDetail{
  age: Int
}
type Author implements AuthorInterface{
  id: String
  _id: String
  firstName: String
  username: String
  email: String
  phone: String
  posts: [Post],
  authorDetail: AuthorDetail,
}
type Post {
  id: String
  _id: String
  title: String
  content: String
  user_id: String
}
type AuthorList{
    rows: [Author]
    count: Int
}
type Response{
    status: String
    result: String
    err: String
}
type Query { 
  author(id: Int!): Author 
  allAuthor(limit: Int, offset: Int): AuthorList
}
type Mutation{
  updateAuthor(id: Int!, firstName: String!): Author
  addAuthor(input: addAuthorInput!): Response
  deleteAuthor(id: String!): Response
}

input addAuthorInput {
  username: String!
  email: String!
  phone: String!
  title: String
  content: String
}

`;

const schema = makeExecutableSchema({typeDefs, resolvers});

export default schema;