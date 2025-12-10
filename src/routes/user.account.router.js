
import {Router} from "express";
import userAccountController from "../controllers/user.account.controller.js";
import validate from "../middlewares/validation.middleware.js";
import authorization from '../middlewares/authorization.middleware.js';

const router = Router();

router.post('/register', validate('register'), userAccountController.register);
router.post('/login', userAccountController.login);
router.delete('/user/:user',
    authorization('OWNER_OR_ADMIN'), userAccountController.deleteUser);
router.patch('/user/:user',
    authorization('OWNER'), validate('updateUser'), userAccountController.updateUser);
router.patch('/user/:user/role/:role',
    authorization('ADMINISTRATOR'), validate('changeRoles', 'params'), userAccountController.addRole);
router.delete('/user/:user/role/:role',
    authorization('ADMINISTRATOR'), validate('changeRoles', 'params'), userAccountController.deleteRole);
router.patch('/password', validate('changePassword'), userAccountController.changePassword);
router.get('/user/:user',
    authorization('AUTHENTICATED'), userAccountController.getUser);

export default router;
