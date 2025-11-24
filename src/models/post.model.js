import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String},
    dateCreated: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    comments: { type: [String], default: [] },
}, {
    versionKey: false
});

const Post = mongoose.model('Post', postSchema);
export default Post;
