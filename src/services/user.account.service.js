import userRepository from '../repositories/userAccountRepository.js';
import userAccountRepository from "../repositories/userAccountRepository.js";

class UserAccountService {
    async register(user) {
        try{
            return await userAccountRepository.addrUser(user)
        }catch (e){
            console.log(e);
            throw new Error("User account already exists");
        }

    }

    async getUser(login) {
        const userAccount = await userAccountRepository.findUser(login);
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
        return userAccount;
    }

    async updateUser(login, data) {
        const userAccount= await userRepository.updateUser(login, data);
        if (!userAccount) {
           throw new Error(`User with login ${login} not found`);
        }
        return userAccount;
    }

    async removeUser(login) {
        const userAccount = await userRepository.removeUser(login);
        if (!userAccount) {
            throw new Error(`User with login ${login} not found`);
        }
        return userAccount;
    }
    async changeRoles(login, role, isAddRole){
        role = role.toUpperCase();
        let userAccount;
        if(isAddRole){
            userAccount = await userAccountRepository.addRole(login, role);
        }else {
            userAccount = await userAccountRepository.removeRole(login, role);
        }
        if(!userAccount){
            throw new Error(`User with login ${login} not found`);
        }
        userAccount.firstName = userAccount.lastName = undefined;
        return userAccount;
    }

    async changePassword(login, newPasswords) {
        // TODO:
        throw new Error('Not implemented');
    }
}


export default new UserAccountService();
