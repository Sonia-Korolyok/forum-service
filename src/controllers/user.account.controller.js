
import userAccountService from "../services/user.account.service.js";

class UserAccountController {
    async register(req, res, next) {
        try {
            const userAccount = await userAccountService.register(req.body);
            return res.status(201).json(userAccount);
        } catch (err) {
            return next(err);
        }
    }

    async login(req, res, next) {
        // TODO login in controller
    }

    async deleteUser(req, res, next) {
        try {
            const userAccount = await userAccountService.removeUser(req.params.user);
            return res.json(userAccount);
        } catch (err) {
            return next(err);
        }
    }

    async updateUser(req, res, next) {
        try {
            const userAccount = await userAccountService.updateUser(req.params.user, req.body);
            return res.json(userAccount);
        } catch (err) {
            return next(err);
        }
    }

    async addRole(req, res, next) {
        const {user, role} = req.params;
        try {
            const userRoles = await userAccountService.changeRoles(user, role, true);
            return res.json(userRoles);
        } catch (err) {
            return next(err);
        }
    }

    async deleteRole(req, res, next) {
        const {user, role} = req.params;
        try {
            const userRoles = await userAccountService.changeRoles(user, role, false);
            return res.json(userRoles);
        } catch (err) {
            return next(err);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { password } = req.body;
            const login = req.params.login;

            const result = await userAccountService.changePassword(login, password);

            res.status(200).json({
                message: 'Password changed successfully',
                login: result.login
            });
        } catch (error) {
            next(error);
        }
    }


    async getUser(req, res, next) {
        try {
            const userAccount = await userAccountService.getUser(req.params.user);
            return res.json(userAccount);
        } catch (err) {
            return next(err);
        }
    }
}

export default new UserAccountController();
