import authorSchema from '../model/author-mongdb';
import postSchema from '../model/post-mongodb';
const config = require("../../config");
const mongoose = require("mongoose");

const __AUTHOR__ = "author";
const __POST__ = "post";

const db = (() => {
    console.log('init db');
    const dbs = [];

    mongoose.connect(`mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}?authSource=admin`, {poolSize: 4})
        .then(
            () => console.log('mongodb connect success!'),
            err => console.log('mongodb connect failed!', err));

    dbs[__AUTHOR__] = mongoose.model(__AUTHOR__, authorSchema);
    dbs[__POST__] = mongoose.model(__POST__, postSchema);

    dbs["mongoose"] = mongoose;

    return dbs;

})();

module.exports = db;