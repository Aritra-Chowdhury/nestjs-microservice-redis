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
    martial_status: Joi.string().valid('unmarried','married','separated').required(),
    panCard : Joi.string().required(),
    nationality : Joi.string().required(),
    phoneNumber : Joi.string().required()
 });

export const joiAccountSchema = Joi.object({
    account_type : Joi.string().valid('Current', 'Saving','Credit').required(),
    customerId :Joi.string().required(),
    isJoint : Joi.boolean(),
    userDetails : joiUserDetailsSchema,
    mailingAddress : joiMailingAddressSchema
}).unknown();

export const joiAccountUpdateSchema = Joi.object({
    accountNumber : Joi.string().required(),
    accountType : Joi.string().valid('Current', 'Saving','Credit').required(),
    //customerId :Joi.string().required(),
    isJoint : Joi.boolean(),
}).unknown();