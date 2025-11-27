import Post from "../models/post.model.js";


class PostRepository {
    async createPost (postData) {
        const post = new Post(postData);
        return post.save();
    }
    async findPostById (id) {
        return Post.findById(id);
    };
    async deletePost (id) {
        return Post.findByIdAndDelete(id);
    }
}

export default new PostRepository();
