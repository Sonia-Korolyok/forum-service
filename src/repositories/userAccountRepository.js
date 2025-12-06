import UserAccount from '../models/UserAccount.model.js';

class UserAccountRepository {
    async addUser(user) {
        const userAccount = new UserAccount(user);
        return userAccount.save();
    }

    async updateUser(login, user) {
        return UserAccount.findByIdAndUpdate(login, user, {new: true});
    }

    async removeUser(login) {
        return UserAccount.findByIdAndDelete(login);
    }

    async findUser(login) {
        return UserAccount.findById(login);
    }

    async addRole(login, role) {
        return UserAccount.findByIdAndUpdate(login, {$addToSet: {roles: role}}, {new: true})
    }

    async removeRole(login, role) {
        return UserAccount.findByIdAndUpdate(login, {$pull: {roles: role}}, {new: true})
    }

    async changePassword(login, newPassword) {
        const userAccount = await UserAccount.findById(login);
        userAccount.password = newPassword;
        return userAccount.save();
    }
}

export default new UserAccountRepository();