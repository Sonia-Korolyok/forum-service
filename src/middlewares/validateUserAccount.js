import Joi from 'joi';

const userSchemas = {
    register: Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    }),
    deleteUser: Joi.object({login: Joi.string().required()}),
    updateUser: Joi.object({
        password: Joi.string(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        roles: Joi.array().items(Joi.string())
    }),
    addRole: Joi.object({
        login: Joi.string().required(),
        role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').required()
    }),

    removeRole: Joi.object({
        login: Joi.string().required(),
        role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').required()
    }),
    login: Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required()
    }),
    getUser: Joi.object({login: Joi.string().required()})
}

const validate = (schemaName, target = 'body') => (req, res, next) => {
    const schema = userSchemas[schemaName];
    if (!schema) {
        return next(new Error(`Schema ${schemaName} not found`));
    }

    const {error} = schema.validate(req[target]);
    if(error) {
        return res.status(400).send({
            message: error.details[0].message,
            code: 400,
            status: 'Bad request',
            path: req.path
        });
    }

    return next();
}

export default validate;
