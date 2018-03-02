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
  id: Int
  firstName: String
  lastName: String
  posts: [Post],
  authorDetail: AuthorDetail,
}
type Post {
  id: Int
  title: String
  text: String
  views: Int
  author: Author
}
type Query { 
  author(id: Int!): Author 
  allAuthor(limit: Int, offset: Int): [Author]
}
type Mutation{
  updateAuthor(id: Int!, firstName: String!): Author
  addAuthor(input: addAuthorInput!): Author
  deleteAuthor(id: Int!): [Author]
}

input addAuthorInput {
  firstName: String!
  lastName: String!
}

`;

const schema = makeExecutableSchema({typeDefs, resolvers});

export default schema;