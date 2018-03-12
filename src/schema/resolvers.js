const service = require('../service/service');
const data = {
    author: [
        {id: 1, firstName: 'Hello', lastName: 'World'},
        {id: 2, firstName: 'Hello1', lastName: 'World1'},
        {id: 3, firstName: 'Hello2', lastName: 'World2'},
    ],
    authorDetail: [
        {id: 1, age: 12},
        {id: 2, age: 13},
        {id: 3, age: 14},
    ]
};

function findAuthorById(id = 1) {
    return data.author.find(o => o.id === id);
}

function findAuthorDetailById(id) {
    return data.authorDetail.find(o => o.id === id);
}

const resolvers = {
    Query: {
        author(root, args, context, info) {    // args就是上面schema中author的入参
            return service.getAuthorById(args.id);
        },
        allAuthor(root, args) {
            return service.getAllAuthor(args);
        }
    },
    Mutation: {
        updateAuthor(root, args) {
            const find = findAuthorById(args.id);
            return Object.assign(find, args);
        },
        addAuthor(root, args) {
            return service.addAuthor(args.input);
        },
        deleteAuthor(root, args) {
            return service.deleteAuthor(args.id);
        }
    },
    Author: {
        // 定义author中的posts
        posts(author) {
            return service.getPostsByAuthorId(author.id || author._id);
        },
    },
    // Post: {
    //     // 定义Post里面的author
    //     author(post) {
    //         return {id: 1, firstName: 'Hello', lastName: 'World'};
    //     },
    // },
    // AuthorDetail: {
    //     author(parent, args) {
    //         console.log('1');
    //         const {limit = 2, offset = 0} = args;
    //         const result = data.author.slice(offset, offset+limit);
    //         result.forEach((v, i) => {
    //             const detail = findAuthorDetailById(v.id);
    //             v.authorDetail = detail;
    //         });
    //         return result;
    //     },
    //     // age(parent, args) {
    //     //     console.log('2');
    //     //     return {age: 14};
    //     // }
    // }
};

export default resolvers;