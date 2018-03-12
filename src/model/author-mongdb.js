import { Schema } from 'mongoose';

const authorSchema = new Schema({
    id: Schema.Types.ObjectId,
    username: String,
    email: String,
    phone: String
});

export default authorSchema;