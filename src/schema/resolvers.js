const data = {
    author: [
        {id: 1, firstName: 'Hello', lastName: 'World'},
        {id: 2, firstName: 'Hello1', lastName: 'World1'},
        {id: 3, firstName: 'Hello2', lastName: 'World2'},
    ]
};

function findAuthorById(id = 1) {
    return data.author.find(o => o.id === id);
}

const resolvers = {
    Query: {
        author(root, args) {    // args就是上面schema中author的入参
            return findAuthorById(args.id);
        },
        allAuthor(root, args) {
            console.log('all', data.author);
            return data.author;
        }
    },
    Mutation: {
        updateAuthor(root, args) {
            const find = findAuthorById(args.id);
            return Object.assign(find, args);
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
};

export default resolvers;