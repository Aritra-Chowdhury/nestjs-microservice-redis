import * as Joi from '@hapi/joi';

const joiMailingAddressSchema = Joi.object({
    address1 : Joi.string().max(150).required(),
    address2 : Joi.string().max(150),
    city: Joi.string().max(150).required(),
    state : Joi.string().max(150).required(),
    country : Joi.string().max(50).required(),
    zipCode : Joi.string().max(50).required()
 });

 const joiUserDetailsSchema = Joi.object({
    dob : Joi.string().required(),
    martialStatus: Joi.string().valid('unmarried','married','separated').required(),
    panCard : Joi.string().required(),
    nationality : Joi.string().required(),
    phoneNumber : Joi.string().required()
 });
 export const joiCustomerSchema = Joi.object({
    name : Joi.string().min(4).max(150),
    email :Joi.string().email(),
    password :Joi.string().min(8),
    userDetails : joiUserDetailsSchema,
    mailingAddress : joiMailingAddressSchema
}).unknown();