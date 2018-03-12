const db = require("../db/dbConnect");
module.exports = {
    async getAuthorById(id) {
        const AUTHOR = db.author;
        const author = await AUTHOR.findOne({_id: id});
        return author;
    },
    async getAllAuthor(params) {
        const AUTHOR = db.author;
        console.log(params);
        const {offset = 0, limit = 2} = params;
        const rows = await AUTHOR.find({}).skip(offset).limit(limit);
        const count = await AUTHOR.count({});
        return {rows, count};

    },
    async addAuthor(params) {
        const AUTHOR = new db.author(params);
        return AUTHOR.save(function(err, author) {
            if (author) {
                const postParams = {
                    user_id: author.id,
                    title: params.title,
                    content: params.content
                };
                const POST = new db.post(postParams);
                POST.save(function (err) {
                    console.log(err);
                })
            }
        });
    },
    async deleteAuthor(id) {
        const AUTHOR = db.author;
        await AUTHOR.findOneAndRemove({_id: id});
        return {status: 'success'};
    },
    async getPostsByAuthorId(id){
        const POST = db.post;
        const posts = await POST.find({user_id: id});
        return posts;
    }
};