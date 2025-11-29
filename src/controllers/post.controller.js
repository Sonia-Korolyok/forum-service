import postService from "../services/post.service.js";

class PostController {
    async createPost(req, res, next) {
        try {
            const post = await postService.createPost(req.params.author, req.body);
            return res.status(201).json(post);
        } catch (error) {
            return next(error);
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await postService.getPostById(req.params.id);
            return res.json(post);
        } catch (error) {
            return next(error);
        }
    }
    async deletePost(req, res, next) {
        try {
            const post = await postService.deletePost(req.params.id);
            return res.json(post);
        }catch (error) {
            return next(error);
        }
    }
    async addLike(req, res, next) {
        try {
            const post = await postService.addLike(req.params.id);
            return res.json(post);
        } catch (error) {
            return next(error);
        }
    }
    async getPostsByAuthor(req, res, next) {
        try {
            const posts = await postService.getPostsByAuthor(req.params.author);
            return res.json(posts);
        } catch (error) {
            return next(error);
        }
    }
    async addComment(req, res, next) {
        try {
            const post = await postService.addComment(req.params.id, req.params.commenter, req.body.message);
            return res.json(post);
        }catch (error) {
            return next(error);
        }
    }
    async getPostByTag(req, res, next) {
        try {
            const tagsString = req.query.values; // например: 'python,java,j2ee'
            const posts = await postService.getPostByTag(tagsString);
            return res.json(posts);
        } catch (error) {
            return next(error);
        }
    }
    async getPostsByPeriod(req, res, next) {
        try {
            const { dateFrom, dateTo } = req.query;
            const posts = await postService.getPostsByPeriod(dateFrom, dateTo);
            return res.json(posts);
        } catch (error) {
            return next(error);
        }
    }
    async updatePost(req, res, next) {
        try {
            const updatedPost = await postService.updatePost(req.params.id, req.body);
            return res.json(updatedPost);
        } catch (error) {
            return next(error);
        }
    }



}

export default new PostController()
