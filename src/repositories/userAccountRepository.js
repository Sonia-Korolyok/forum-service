import UserAccount from '../models/UserAccount.model.js';

class UserAccountRepository {
    async addrUser(user) {
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
    async changePassword(login, password) {
        return UserAccount.findByIdAndUpdate(login, password, {new: true})
    }
}

export default new UserAccountRepository();