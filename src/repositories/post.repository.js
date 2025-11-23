import Post from "../models/post.model.js";


export const createPost = async (postData) => {
    const post = new Post(postData);
    return post.save();
}
export const getPostById = async (id) => {
    return Post.findById(id);
};
