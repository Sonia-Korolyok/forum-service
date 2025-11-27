import {Schema} from "mongoose";


const commentSchema = new Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },

}, { _id: false });

export default commentSchema;