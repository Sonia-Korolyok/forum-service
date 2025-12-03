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

    async addRole(req, res, next) {
        try {
            const { login, role } = req.params;
            console.log(role);
            const account = await userAccountService.addRole(login, role, true);
            return res.status(200).json(account);
        } catch (error) {
            next(error);
        }
    }

    async removeRole(req, res, next) {
        try {
            const { login, role } = req.params;
            const account = await userAccountService.removeRole(login, role, false);
            return res.status(200).json(account);
        } catch (error) {
            next(error);
        }
    }


}


export default new UserAccountController();
