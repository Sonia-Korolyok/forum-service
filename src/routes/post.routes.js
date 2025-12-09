
import {Router} from "express";
import postController from "../controllers/post.controller.js";
import validate from "../middlewares/validation.middleware.js";
import authentication from '../middlewares/authentication.middleware.js';
import authorization from '../middlewares/authorization.middleware.js';

const router = Router();

router.post('/post/:author', authentication,
    authorization('LOGIN_EQ_AUTHOR'), validate('createPost'), postController.createPost)
router.get('/post/:id', authentication,
    authorization('AUTHENTICATED'), postController.getPostById)
router.delete('/post/:id', authentication,
    authorization('MOD_OR_OWNER'), postController.deletePost)
router.patch('/post/:id/like', authentication,
    authorization('AUTHENTICATED'), postController.addLike);
router.get('/posts/author/:author', postController.getPostsByAuthor);
router.patch('/post/:id/comment/:commenter', authentication,
    authorization('LOGIN_EQ_AUTHOR'), validate('addComment'), postController.addComment);
router.get('/posts/tags', postController.getPostsByTags);
router.get('/posts/period', validate('dateFormat', 'query'), postController.getPostsByPeriod);
router.patch('/post/:id', authentication,
    authorization('OWNER'),  validate('updatePost'), postController.updatePost);


export default router;
