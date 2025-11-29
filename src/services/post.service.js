import postRepository from '../repositories/post.repository.js';
//import {NotFoundError} from '../utils/errors.js';

class PostService {
    async createPost (author, data) {
        return await postRepository.createPost( { ...data, author });
    };



    async getPostById (id){
        const post = await postRepository.findPostById(id);
        if (!post) {
            throw new Error(`Post with id ${id} not found`);
        }
        return post;
    };


    async addLike(postId) {
        const post = await postRepository.addLike(postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        return post;
    }


    async getPostsByAuthor(author) {
        const posts = await postRepository.getPostsByAuthor(author);
        if (!posts.length) {
            throw new Error(`No posts found for author ${author}`);
        }
        return posts;
    }


    async addComment(postId, commenter, message) {
        const post = await postRepository.addComment(postId, commenter, message);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        return post;
    }

    async deletePost(postId) {
        const post = await postRepository.deletePost(postId);
        if (!post) {
            throw new Error(`Post with id ${postId} not found`);
        }
        return post;
    }

    async getPostByTag(tagsString) {
        const posts = await postRepository.getPostByTag(tagsString);
        if (!posts || posts.length === 0) {
            throw new Error(`No posts found with tags: ${tagsString}`);
        }
        return posts;
    }


    async getPostsByPeriod(dateFrom, dateTo) {
        const posts = await postRepository.getPostsByPeriod(dateFrom, dateTo);
        if (!posts || posts.length === 0) {
            throw new Error(`No posts found between ${dateFrom} and ${dateTo}`);
        }
        return posts;
    }


    async updatePost(id, data) {
        const updatedPost = await postRepository.updatePost(id, data);
        if (!updatedPost) {
            throw new Error(`Post with id ${id} not found`);
        }
        return updatedPost;
    }

}

export default new PostService();