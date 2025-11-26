import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
}, { _id: false });

const postSchema = new mongoose.Schema({
    title:   { type: String, required: true },
    content: { type: String, required: true },
    author:  { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    tags:   { type: [String], default: [] },
    likes:  { type: Number, default: 0 },
    comments: { type: [commentSchema], default: [] },
}, { versionKey: false });

const Post = mongoose.model('Post', postSchema);
export default Post;
