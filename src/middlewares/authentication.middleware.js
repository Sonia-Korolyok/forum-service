import UserAccount from "../models/userAccount.model.js";

const authentication = async (req, res, next) => {
    if (req.path !== '/account/register' && !req.path.startsWith('/forum/posts/')) {
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Basic ')) {
            return res.status(401).json({message: 'Authorization is required'});
        }

        const token = authorization.split(' ')[1];
        const decodedToken = Buffer.from(token, 'base64').toString('ascii');
        const [login, password] = decodedToken.split(':');
        const userAccount = await UserAccount.findById(login);
        if (!userAccount || !(await userAccount.comparePassword(password))) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        req.headers.authorization = '';
        req.principal = {username: login, roles: userAccount.roles};
    }
    return next();
}
export default authentication;