const db = require("../db/dbConnect");
module.exports = {
    async getAuthorById(id) {
        const AUTHOR = db.author;
        const author = await AUTHOR.findOne({
            where: {
                id
            }
        });
        return author;
    },
    async getAllAuthor(params) {
        const AUTHOR = db.author;
        const {offset = 0, limit = 2} = params;
        const result = await AUTHOR.findAndCountAll({
            offset,
            limit,
        });
        return result;
    },
    async addAuthor(params) {
        const AUTHOR = db.author;
        const POST = db.post;
        return db.sequelize.transaction(async (t) => {
            const newAuthor = await AUTHOR.create(params, {transaction: t});
            const postParams = {
                user_id: newAuthor.id,
                title: params.title,
                content: params.content
            };
            console.log(newAuthor)
            const newPost = await POST.create(postParams, { transaction: t });
            if (newAuthor && newPost) {
                return {status: 'success'};
            } else {
                return {status: 'failed', result: '添加失败'}
            }
        }).catch((error) => {
            return {status: 'failed', err: error.toString() };
        });
    },
    async deleteAuthor(id) {
        const AUTHOR = db.author;
        await AUTHOR.destroy({
            where:{
                id
            }
        });
        return {status: 'success'};
    },
    async getPostsByAuthorId(id){
        console.log(id);
        const POST = db.post;
        const posts = await POST.findAll({
            where: {
                user_id: id
            }
        });
        return posts;
    }
};