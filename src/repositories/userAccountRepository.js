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

    async changeRole(login, role, isAddRole) {
        if (isAddRole) {
            return UserAccount.findOneAndUpdate(
                { login },
                { $addToSet: { roles: role } },
                { new: true }
            );
        } else {
            return UserAccount.findOneAndUpdate(
                { login },
                { $pull: { roles: role } },
                { new: true }
            );
        }
    }
}

export default new UserAccountRepository();