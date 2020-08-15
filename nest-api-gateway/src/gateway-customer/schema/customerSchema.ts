import * as Joi from '@hapi/joi';

const joiMailingAddressSchema = Joi.object({
    address1 : Joi.string().max(150).required(),
    address2 : Joi.string().max(150),
    city: Joi.string().max(150).required(),
    state : Joi.string().max(150).required(),
    country : Joi.string().max(50).required(),
    zip_code : Joi.string().max(50).required()
 });

 const joiUserDetailsSchema = Joi.object({
    dob : Joi.string().required(),
    martial_status: Joi.string().valid('unmarried','married','separated').required(),
    pan_card : Joi.string().required(),
    nationality : Joi.string().required(),
    phone_number : Joi.string().required()
 });
 export const joiCustomerSchema = Joi.object({
    name : Joi.string().min(4).max(150),
    email :Joi.string().email(),
    password :Joi.string().min(8),
    userDetails : joiUserDetailsSchema,
    mailingaddress : joiMailingAddressSchema
}).unknown();