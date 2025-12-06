
import {Router} from "express";
import userAccountController from "../controllers/user.account.controller.js";
import validate from "../middlewares/validation.middleware.js";

const router = Router();

router.post('/register', validate ('registerUser'), userAccountController.register);
router.post('/login', userAccountController.login);
router.delete('/user/:user', userAccountController.deleteUser);
router.patch('/user/:user', validate('updateUser') ,userAccountController.updateUser);
router.patch('/user/:user/role/:role', validate('roleManage'), userAccountController.addRole);
router.delete('/user/:user/role/:role', validate('roleManage'), userAccountController.deleteRole);
router.patch('/password', validate('changePassword'), userAccountController.changePassword);
router.get('/user/:user', userAccountController.getUser);

export default router;
