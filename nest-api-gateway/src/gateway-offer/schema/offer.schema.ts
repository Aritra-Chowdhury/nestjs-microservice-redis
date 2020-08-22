import * as Joi from '@hapi/joi';

export const joiOfferCreateSchema = Joi.object({
    offerName : Joi.string().max(150).required(),
    offerType: Joi.string().valid( "Platinum" , "Gold" , "Silver").required(),
    loanType: Joi.string().valid("Home" , "Car" , "Personal").required(),
    offerPercentage : Joi.number().min(0).required(),
 }).unknown();

 export const joiOfferUpdateSchema = Joi.object({
    offerId : Joi.string().max(150).required(),
    offerName : Joi.string().max(150).required(),
    offerType: Joi.string().valid( "Platinum" , "Gold" , "Silver").required(),
    loanType: Joi.string().valid("Home" , "Car" , "Personal").required(),
    offerPercentage : Joi.number().min(0).required()
 }).unknown();
