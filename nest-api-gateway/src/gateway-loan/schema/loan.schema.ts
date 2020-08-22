import * as Joi from '@hapi/joi';

export const joiLoanCreateSchema = Joi.object({
    customerId : Joi.string().max(150).required(),
    accountNumber : Joi.string().max(150).required(),
    loanType :Joi.string().valid( "Home" , "Car" , "Personal").required(), 
    loanAmount :  Joi.number().min(0).required(),
    loanDuration :  Joi.number().valid( 10 , 15 , 30).required(),
    offer: {
        offerName : Joi.string().max(150).required(),
        offerType : Joi.string().valid( "Platinum" , "Gold" , "Silver")
    },
}).unknown();

export const joiLoanUpdateSchema = Joi.object({
    loanNumber : Joi.string().max(150).required(),
    loanType : Joi.string().valid( "Home" , "Car" , "Personal"),
    loanAmount :  Joi.number().min(0).required(),
    loanDuration :  Joi.number().valid( 10 , 15 , 30).required(),
    offer: {
        offerName : Joi.string().max(150).required(),
        offerType : Joi.string().valid( "Platinum" , "Gold" , "Silver")
    },
}).unknown();

export const joiLoanValidateSchema = Joi.object({
    loanNumber : Joi.string().max(150).required(),
    status : Joi.string().valid("Pending","Approved","Rejected").required()
}).unknown();
