import {Schema, model} from 'mongoose';

const userAccountSchema = new Schema({
    _id: {type: String, required: true, alias: 'login'},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    roles: {type: [String], default: ["USER"]}
}, {
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            ret.login = ret._id;
            delete ret._id;
            delete ret.password;
        }
    }
})

export default model('User', userAccountSchema, 'users');
