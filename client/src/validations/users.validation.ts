import Joi from "joi";

export const Login = {
//   email: Joi.string()
//     .email({ tlds: { allow: false } })
//     .required().trim(),
    username: Joi.string().trim().min(4).regex(/^[a-zA-Z0-9_.-]+$/).required(),
    password: Joi.string().min(8).required().regex(/^[^\s\p{L}]*$/),
};