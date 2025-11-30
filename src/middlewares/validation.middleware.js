// import Joi from 'joi';
// import {ValidationError} from '../utils/errors.js';
//
// const schemas = {
//     createPost: Joi.object({
//         title: Joi.string().required(),
//         content: Joi.string().required(),
//         tags: Joi.array().items(Joi.string()),
//     })
// }
//
// const validate = schemaName => (req, res, next) => {
//     const schema = schemas[schemaName];
//
//     if (!schema) {
//         return next(new Error(`Schema ${schemaName} not found`));
//     }
//     const {error} = schema.validate(req.body);
//     if (error) {
//         return next(new ValidationError(error.details[0].message));
//     }
//     return next();
// }
//
// export default validate;


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
