import { Schema } from 'mongoose';

const postSchema = new Schema({
    title: String,
    content: String,
    user_id: {type: Schema.Types.ObjectId, ref: "author"}
}, {
    id: true,
    autoIndex: true,
});

export default postSchema;