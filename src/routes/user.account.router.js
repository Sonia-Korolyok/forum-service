
import {Router} from "express";
import userAccountController from "../controllers/user.account.controller.js";
import validate from "../middlewares/validation.middleware.js";
import authentication from '../middlewares/authentication.middleware.js';
import authorization from '../middlewares/authorization.middleware.js';

const router = Router();

router.post('/register', validate('register'), userAccountController.register);
router.post('/login', userAccountController.login);
router.delete('/user/:user', authentication,
    authorization('OWNER_OR_ADMIN'), userAccountController.deleteUser);
router.patch('/user/:user', authentication,
    authorization('OWNER'), validate('updateUser'), userAccountController.updateUser);
router.patch('/user/:user/role/:role', authentication,
    authorization('ADMINISTRATOR'), validate('changeRoles', 'params'), userAccountController.addRole);
router.delete('/user/:user/role/:role', authentication,
    authorization('ADMINISTRATOR'), validate('changeRoles', 'params'), userAccountController.deleteRole);
router.patch('/password', authentication, validate('changePassword'), userAccountController.changePassword);
router.get('/user/:user', authentication,
    authorization('AUTHENTICATED'), userAccountController.getUser);

export default router;
