import userAccountService from "../services/user.account.service.js";

class UserAccountController {
    async registerUser(req, res, next) {
        console.log(req.body.login);
        try {
            const user = await userAccountService.registerUser(req.body);
            return res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            console.log(req.params);
            const user = await userAccountService.getUser(req.params.login);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await userAccountService.updateUser(req.params.login, req.body);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await userAccountService.deleteUser(req.params.login);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }
    async changeRole(req, res, next) {
        try {
            const { login, role } = req.params;
            const { isAddRole } = req.body;
            const account = await userAccountService.changeRoles(login, role, isAddRole);
            return res.status(200).json(account);
        } catch (error) {
            return next(error);
        }
    }

}


export default new UserAccountController();
