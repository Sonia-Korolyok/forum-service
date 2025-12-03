
import {Router} from "express";
import userAccountController from "../controllers/user.account.controller.js";

const router = Router();

router.post('/register', userAccountController.register);
router.post('/login', userAccountController.login);
router.delete('/user/:user', userAccountController.deleteUser);
router.patch('/user/:user', userAccountController.updateUser);
router.patch('/user/:user/role/:role', userAccountController.addRole);
router.delete('/user/:user/role/:role', userAccountController.deleteRole);
router.patch('/password', userAccountController.changePassword);
router.get('/user/:user', userAccountController.getUser);

export default router;
