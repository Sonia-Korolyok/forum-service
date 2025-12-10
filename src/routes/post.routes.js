
import {Router} from "express";
import postController from "../controllers/post.controller.js";
import validate from "../middlewares/validation.middleware.js";
import authorization from '../middlewares/authorization.middleware.js';

const router = Router();

router.post('/post/:author',
    authorization('LOGIN_EQ_AUTHOR'), validate('createPost'), postController.createPost)
router.get('/post/:id',
    authorization('AUTHENTICATED'), postController.getPostById)
router.delete('/post/:id',
    authorization('MOD_OR_OWNER'), postController.deletePost)
router.patch('/post/:id/like',
    authorization('AUTHENTICATED'), postController.addLike);
router.get('/posts/author/:author', postController.getPostsByAuthor);
router.patch('/post/:id/comment/:commenter',
    authorization('LOGIN_EQ_COMMENTER'), validate('addComment'), postController.addComment);
router.get('/posts/tags', postController.getPostsByTags);
router.get('/posts/period', validate('dateFormat', 'query'), postController.getPostsByPeriod);
router.patch('/post/:id', validate('updatePost'), postController.updatePost);


export default router;
