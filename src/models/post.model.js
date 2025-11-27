import {model, Schema, Types} from 'mongoose';
import commentSchema from '../models/comment.model.js';

const postSchema = new Schema({
    _id: {type: String, default: () => new Types.ObjectId().toHexString()},
    title:   { type: String, required: true },
    content: { type: String, required: true },
    author:  { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    tags:   { type: [String], default: [] },
    likes:  { type: Number, default: 0 },
    comments: { type: [commentSchema], default: [] },
}, { versionKey: false,
toJSON: { transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    }}
});


export default model('Post', postSchema, 'posts');
