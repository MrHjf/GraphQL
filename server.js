import express from 'express';
import {
    graphqlExpress,
    graphiqlExpress,
} from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from './src/schema/schema';    // 定义GraphQL查询格式
import mongoose from 'mongoose';
const GRAPHQL_PORT = 3002;

const graphQLServer = express();

graphQLServer.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method === 'OPTIONS') res.send(200);
    else next();
});

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress(req => ({ schema, context: req })));
   // 实现GraphQL接口功能
graphQLServer.use('/graphiql',graphiqlExpress({ endpointURL: '/graphql' }));
// 实现GraphQL浏览器调试界面

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
));