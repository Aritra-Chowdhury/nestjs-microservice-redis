import * as Joi from '@hapi/joi';
//import JoiObjectId from "joi-objectid";
//const myJoiObjectId = JoiObjectId(Joi);

export const joiRegisterSchema = Joi.object({
    name : Joi.string().min(4).max(150).required(),
    email :Joi.string().required().email(),
    password :Joi.string().min(8).required()
}).unknown();

export const joiLoginSchema = Joi.object({
    customerId :Joi.string(),
    email :Joi.string().email(),
    password :Joi.string().min(8).required()
}).or('customerId','email');