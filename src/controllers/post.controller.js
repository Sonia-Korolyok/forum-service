// import postService from '../services/post.service.js';
//
// class PostController {
//     async createPost(req, res, next) {
//         try {
//             const postData = { ...req.body, author: req.params.author };
//             console.log(postData)
//             const post = await postService.createPost(postData);
//             res.status(201).json(post);
//         } catch (err) {
//             next(err);
//         }
//     }
//
//     async getPostById(req, res, next) {
//         try {
//             const post = await postService.getPostById(req.params.id);
//             return res.json(post);
//         } catch (error) {
//             return next(error);
//         }
//     }
// }
//
// export default new PostController();


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
}

export default new PostController()
