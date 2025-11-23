import Joi from 'joi';
import router from "../routes/post.routes.js";
import { ValidationError } from '../utils/errors.js';

const schemas = {
    createPost: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string()),
    })
}

const validate = schemaName => (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
        return next(new Error(`Schema ${schemaName} not found`));
    }
    const { error } = schema.validate(req.body);
    if (error) {
        throw new ValidationError(error.details[0].message);
    }
    return next();
}

export default validate;