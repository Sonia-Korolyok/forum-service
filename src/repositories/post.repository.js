
import Post from '../models/post.model.js';

class PostRepository {
    async createPost(postData){
        const post = new Post(postData);
        return post.save();
    }

    async findPostById(id) {
        return Post.findById(id);
    }

    async deletePost(id) {
        return Post.findByIdAndDelete(id);
    }

    async addLike(id) {
        return Post.findByIdAndUpdate(id, {$inc: {likes: 1}}, {new: true});
    }

    async findPostByAuthor(author) {
        return Post.find({author: new RegExp(`^${author}$`, 'i')});
    }

    async addComment(id, comment) {
        return Post.findByIdAndUpdate(id, {$push: {comments: comment}}, {new: true});
    }

    async findPostsByTags(tags) {
        const regexConditions = tags.map(tag => ({
            tags: new RegExp(`^${tag}$`, 'i')
        }));
        return Post.find({$or: regexConditions});
    }

    async findPostsByPeriod(dateFrom, dateTo) {
        return Post.find({dateCreated: {$gte: dateFrom, $lte: dateTo}});
    }

    async updatePost(id, updateData) {
        return Post.findByIdAndUpdate(id, updateData, {new: true});
    }
}

export default new PostRepository();
