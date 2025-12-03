import { Router } from 'express';
import userAccountController from '../controllers/user.account.controller.js';
import  validate  from '../middlewares/validateUserAccount.js';
const router = Router();

router.post('/register', validate('register'), userAccountController.registerUser);
router.get('/user/:login', validate('getUser', 'params') ,userAccountController.getUser)
router.delete('/user/:login', validate('deleteUser', 'params'), userAccountController.deleteUser)
router.patch('/user/:login/role/:role', validate ('changeRole'), userAccountController.changeRole);
router.patch('/:login', validate('updateUser'), userAccountController.updateUser);


export default router;




