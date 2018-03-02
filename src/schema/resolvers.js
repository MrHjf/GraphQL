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
        author(root, args) {    // args就是上面schema中author的入参
            return findAuthorById(args.id);
        },
        allAuthor(root, args) {
            console.log('3');
            const {limit = 2, offset = 0} = args;
            const result = data.author.slice(offset, offset+limit);
            result.forEach((v, i) => {
                const detail = findAuthorDetailById(v.id);
                v.authorDetail = detail;
            });
            return result;
        }
    },
    Mutation: {
        updateAuthor(root, args) {
            const find = findAuthorById(args.id);
            return Object.assign(find, args);
        },
        addAuthor(root, args) {
            const id = data.author[data.author.length - 1].id + 1;
            const newData = Object.assign({id}, args.input);
            data.author.push(newData);
            return newData;
        },
        deleteAuthor(root, args) {
            const index = data.author.findIndex(o => o.id === args.id);
            const result = data.author.splice(index, 1);
            return result;
        }
    },
    Author: {
        // 定义author中的posts
        posts(author) {
            return [
                {id: 1, title: 'A post', text: 'Some text', views: 2},
                {id: 2, title: 'Another post', text: 'Some other text', views: 200}
            ];
        },
    },
    Post: {
        // 定义Post里面的author
        author(post) {
            return {id: 1, firstName: 'Hello', lastName: 'World'};
        },
    },
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