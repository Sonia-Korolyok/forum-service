import * as postRepository from '../repositories/post.repository.js';
import {NotFoundError} from '../utils/errors.js';

class PostService {
    createPost = async (_author, data) => {
        return postRepository.createPost(data);
    };


    getPostById = async (id) => {
        const post = await postRepository.getPostById(id);
        if (!post) {
            throw new NotFoundError('Post not found');
        }
        return post;
    };


    async addLike(id) {
        //todo add like to post by id
        throw new Error('Not implemented');
    }

    async getPostsByAuthor(author) {
        //todo return post by author
        throw new Error('Not implemented');
    }

    async addComment(postId, commenter, message) {
        //todo add comment by post id
        throw new Error('Not implemented');
    }

    async deletePost(postId) {
        //todo delete post by id
        throw new Error('Not implemented');
    }

    async getPostByTag(tagsString) {
        //todo return post by tags. Tags example: python,java,j2ee
        throw new Error('Not implemented');
    }

    async getPostsByPeriod(dateFrom, dateTo) {
        //todo return posts by period
        throw new Error('Not implemented');
    }

    async updatePost(id, data) {
        //todo update post. Data example: "title": "Jakarta EE",
        //     "tags":["Jakarta EE", "J2EE"]
        throw new Error('Not implemented');
    }
}

export default new PostService();