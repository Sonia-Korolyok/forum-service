
import Joi from 'joi';

const schemas = {
    createPost: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string())
    }),
    addComment: Joi.object({
        message: Joi.string().required(),
    }),
    updatePost: Joi.object({
        title: Joi.string(),
        content: Joi.string(),
        tags: Joi.array().items(Joi.string())
    }),
    dateFormat: Joi.object({
        dateFrom: Joi.date().iso().required(),
        dateTo: Joi.date().iso().required()
    }),
    registerUser: Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    }),

    updateUser: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string()
    }),

    roleManage: Joi.object({
        login: Joi.string().required(),
        role: Joi.string()
            .valid('ADMIN', 'MODERATOR', 'USER')
            .case('upper')
            .required()
    }),

    changePassword: Joi.object({
        password: Joi.string().min(4).required()
    })
}

const validate = (schemaName, target = 'body') => (req, res, next) => {
    const schema = schemas[schemaName];

    if(!schema) {
        return next(new Error(`Schema ${schemaName} not found`))
    }
    console.log(req[target]);

    const { error } = schema.validate(req[target]);
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
