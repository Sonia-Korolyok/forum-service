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
    async addLike(id) {
        return Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    }
    async getPostsByAuthor(author) {
        return Post.find({ author });
    }
    async addComment(id, commenter, message) {
        const comment = {
            user: commenter,
            message,
            dateCreated: new Date(),
            likes: 0
        };

        const post = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: comment } },
            { new: true }
        );

        return post;
    }
    async getPostByTag(tagsString) {
        const tagsArray = tagsString.split(',').map(tag => tag.trim());
        return Post.find({
            tags: {
                $in: tagsArray.map(tag => new RegExp('^' + tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
            }
        });
    }
    async getPostsByPeriod(dateFrom, dateTo) {
        return Post.find({
            dateCreated: {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo)
            }
        });
    }
    async updatePost(id, data) {
        return Post.findByIdAndUpdate(id, data, { new: true });
    }


}

export default new PostRepository();
