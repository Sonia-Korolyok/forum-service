
import userAccountRepository from '../repositories/userAccount.repository.js';

class UserAccountService {
    async register(user) {
        try {
            return await userAccountRepository.addUser(user);
        } catch (e) {
            console.log(e);
            throw new Error('User with this login already exists');
        }
    }

    async getUser(login) {
        const userAccount =
            await userAccountRepository.findUser(login);
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
        return userAccount;
    }

    async removeUser(login) {
        const userAccount =
            await userAccountRepository.removeUser(login);
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
        return userAccount;
    }

    async updateUser(login, user) {
        const userAccount =
            await userAccountRepository.updateUser(login, user);
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
        return userAccount;
    }

    async changeRoles(login, role, isAddRole) {
        role = role.toUpperCase();
        let userAccount;
        if (isAddRole) {
            userAccount = await userAccountRepository.addRole(login, role);
        } else {
            userAccount = await userAccountRepository.removeRole(login, role);
        }
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
        const {roles, userName = login} = userAccount;
        return {roles, login: userName};
    }

    async changePassword(login, newPassword) {
        const userAccount = await userAccountRepository.changePassword(login, newPassword);
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
    }
}

export default new UserAccountService();
