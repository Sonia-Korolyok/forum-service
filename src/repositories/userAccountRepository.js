import UserAccount from '../models/UserAccount.js';

class UserAccountRepository {
    async registerUser(data) {
        const user = new UserAccount(data);
        return user.save();
    }

    async updateUser(id, data) {
        return UserAccount.findByIdAndUpdate(id, data, {new: true});
    }

    async deleteUser(id) {
        return UserAccount.findByIdAndDelete(id);
    }

    async getUser(login) {
        return UserAccount.findById(login);
    }

    addRole(login, role) {
        console.log(role);
        return UserAccount.findByIdAndUpdate(login, {$addToSet: {roles: role}}, {new: true})
    }

    removeRole(login, role) {
        return UserAccount.findByIdAndUpdate(login, {$pull: {roles: role}}, {new: true})
    }
}

export default new UserAccountRepository();