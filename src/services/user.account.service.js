import userRepository from '../repositories/userAccountRepository.js';
import userAccountRepository from "../repositories/userAccountRepository.js";

class UserAccountService {
    async registerUser(user) {
        const doc = {
            _id: user.login,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName
        };
        const created = await userRepository.registerUser(doc);
        if (!created) {
            const err = new Error(`Failed to register user ${user.login}`);
            err.statusCode = 400;
            throw err;
        }
        return created;
    }

    async getUser(login) {
        const found = await userRepository.getUser(login);
        if (!found) {
            const err = new Error(`User with login ${login} not found`);
            err.statusCode = 404;
            throw err;
        }
        return found;
    }

    async updateUser(login, data) {
        const updated = await userRepository.updateUser(login, data);
        if (!updated) {
            const err = new Error(`User with login ${login} not found`);
            err.statusCode = 404;
            throw err;
        }
        return updated;
    }

    async deleteUser(login) {
        const deleted = await userRepository.deleteUser(login);
        if (!deleted) {
            const err = new Error(`User with login ${login} not found`);
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    }

    async addRole(login, role) {
        const roleUpperCase = role.toUpperCase();
        console.log(roleUpperCase);
        const userUpdated = await userAccountRepository.addRole(login, roleUpperCase)
        if(!userUpdated)  {
            const err = new Error(`User with login ${login} not found`);

            err.statusCode = 404;
            throw err;
        }
        return userUpdated
    }

    async removeRole(login, role) {
        const roleUpperCase = role.toUpperCase()
        const userUpdated = await userAccountRepository.removeRole(login, roleUpperCase)
        if(!userUpdated) {
            const err = new Error(`User with login ${login} not found`);

            err.statusCode = 404;
            throw err;
        }
        return userUpdated
    }

    async changePassword(login, newPasswords) {
        // TODO:
        throw new Error('Not implemented');
    }
}


export default new UserAccountService();
