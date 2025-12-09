

const authorization = (rule) => (req, res, next) => {
    const user = req.principal; // username, roles

    console.log('authorization call ', user, rule);

    if (rule === 'PERMIT_ALL') {
        return next();
    }

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isOwnerByLogin = () => user.username === req.params.user;
    const isOwnerByAuthor = () => user.username === req.params.author;
    const hasRole = (role) => user.roles?.includes(role);
    console.log(user.roles);

    let ok = false;

    console.log(rule);
    console.log('user: ', user);
    console.log('user.username: ', user.username);
    console.log('req.params: ', JSON.stringify(req.params));
    console.log('req.params.user: ', req.params.user);

    switch (rule) {
        case 'AUTHENTICATED':
            ok = true;
            break;
        case 'OWNER':
            ok = isOwnerByLogin();
            break;
        case 'OWNER_OR_ADMIN':
            ok = isOwnerByLogin() || hasRole('ADMINISTRATOR');
            break;
        case 'ADMINISTRATOR':
            console.log(`ADMIN: ${rule}` );
            ok = hasRole('ADMINISTRATOR');
            break;
        case 'MOD_OR_OWNER':
            ok = hasRole('MODERATOR') || isOwnerByLogin();
            break;
        case 'LOGIN_EQ_AUTHOR':
            ok = isOwnerByAuthor();
            break;
        default:
            ok = false;
    }
    console.log(user.roles, 'hasRole: ', hasRole('ADMINISTRATOR'))
    if (!ok) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
};

export default authorization;
