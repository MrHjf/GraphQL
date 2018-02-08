import express from 'express'
import Schema from './src/schema'
import graphqlHTTP from 'express-graphql'

const app = express();
const port = 3005;

app.use('*', function(res, req, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.use('/', test, graphqlHTTP({
    schema: Schema,
    graphiql: true
}));


function test(res, req, next) {
    next();
}

let server = app.listen(port, function () {
    let addr = server.address();
    let bind = typeof addr === 'string'? 'pipe ' + addr : 'port' + addr.port;
    console.log('listening on ' + bind);
});

