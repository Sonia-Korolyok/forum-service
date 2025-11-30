
import postRepository from '../repositories/post.repository.js';

class PostService {
    async createPost(author, data) {
        return await postRepository.createPost({...data, author});
    }

    async getPostById(id) {
        const post = await postRepository.findPostById(id);
        if(!post) {
            throw new Error(`Post with id ${id} not found`)
        }
        return post;
    }

    async addLike(postId) {
        const post = await postRepository.addLike(postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        return post;
    }

    async getPostsByAuthor(author) {
        return await postRepository.findPostByAuthor(author);
    }

    async addComment(postId, commenter, message) {
        const comment = {user: commenter, message};
        const post = await postRepository.addComment(postId, comment);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        return post;
    }

    async deletePost(postId) {
        const post = await postRepository.deletePost(postId);
        if(!post) {
            throw new Error(`Post with id ${postId} not found`)
        }
        return post;
    }

    async getPostsByTags(tagsString) {
        const tags = tagsString.split(',').map(tag => tag.trim().toLowerCase());
        return await postRepository.findPostsByTags(tags);
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        return await postRepository.findPostsByPeriod(new Date(dateFrom), new Date(dateTo));
    }

    async updatePost(postId, data) {
        const post = await postRepository.findPostById(postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        if (data.tags) {
            data.tags.push(...post.tags);
        }
        return await postRepository.updatePost(postId, data);
    }
}

export default new PostService()
