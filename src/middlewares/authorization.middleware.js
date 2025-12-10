
import PostService from "../services/post.service.js";


class Authorization {
    hasRole(role) {
        return (req, res, next) => req.principal.roles.includes(role.toUpperCase().trim()) ? next() : res.status(403).send('Access denied')
    }

    isOwner(paramName) {
        return (req, res, next) => req.params[paramName] === req.principal.username ? next() : res.status(403).send('Access denied')
    }

    isOwnerOrHasRole(paramName) {
        return (req, res, next) => {
            const isOwner = req.params[paramName] === req.principal.username
            const hasRole = req.principal.roles.includes(role.toUpperCase().trim());
            return isOwner || hasRole ? next() : res.status(403).send('Access denied')
        }

    }

    isPostAuthor(postIdParam) {
        return async (req, res, next) => {
            const postId = req.params[postIdParam];
            const post = await PostService.getPostById(postId);
            return post.author === req.principal.username ? next() : res.status(403).send('Access denied')
        }
    }

    isPostAuthorOrHasRole(postIdParam, role) {
        return async (req, res, next) => {
            const postId = req.params[postIdParam];
            const post = await PostService.getPostById(postId);
            const isOwner = post.author === req.principal.username;
            const hasRole = req.principal.roles.includes(role.toUpperCase().trim());
            return isOwner || hasRole ? next() : res.status(403).send('Access denied')
        }
    }

}

export default new Authorization();

// const authorization = (rule) => (req, res, next) => {
//     const user = req.principal; // username, roles
//
//     console.log('authorization call ', user, rule);
//
//     if (rule === 'PERMIT_ALL') {
//         return next();
//     }
//
//     if (!user) {
//         return res.status(401).json({message: 'Unauthorized'});
//     }
//
//     const isOwnerByLogin = () => user.username === req.params.user;
//     const isOwnerByAuthor = () => user.username === req.params.author;
//     const isOwnerByComment = () => user.username === req.params.commenter;
//
//     const hasRole = (role) => user.roles?.includes(role);
//     console.log(user.roles);
//
//     let ok = false;
//
//     console.log(rule);
//     console.log('user: ', user);
//     console.log('user.username: ', user.username);
//     console.log('req.params: ', JSON.stringify(req.params));
//     console.log('req.params.user: ', req.params.user);
//
//     switch (rule) {
//         case 'AUTHENTICATED':
//             ok = true;
//             break;
//         case 'OWNER':
//             ok = isOwnerByLogin();
//             break;
//         case 'OWNER_OR_ADMIN':
//             ok = isOwnerByLogin() || hasRole('ADMINISTRATOR');
//             break;
//         case 'ADMINISTRATOR':
//             console.log(`ADMIN: ${rule}`);
//             ok = hasRole('ADMINISTRATOR');
//             break;
//         case 'MOD_OR_OWNER':
//             ok = hasRole('MODERATOR') || isOwnerByLogin();
//             break;
//         case 'LOGIN_EQ_AUTHOR':
//             ok = isOwnerByAuthor();
//             break;
//         case 'LOGIN_EQ_COMMENTER':
//             ok = isOwnerByComment();
//             break;
//         default:
//             ok = false;
//     }
//     console.log(user.roles, 'hasRole: ', hasRole('ADMINISTRATOR'))
//     if (!ok) {
//         return res.status(403).json({message: 'Forbidden'});
//     }
//
//     next();
// };
//
// export default authorization;

// hasAnyRole(...roles) {
//     return (req, res, next) => roles.some(role => req.principal.roles.includes(role.toUpperCase().trim())) ? next() : res.status(403).send('Access denied')
// }