import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import * as Joi from '@hapi/joi';

export const accountSchema = new mongoose.Schema({
    accountType : {type:String , required:true , enum :[ "Current", "Saving","Credit"]},
    openingDate : {type:Date , required:true , default:Date.now},
    closingDate : {type:Date},
    customerId : {type:String , required:true},
    isJoint : {type:Boolean , required:true ,default:false}
});

accountSchema.method('transform',function(){
    const obj = this.toObject();
    obj.accountNumber = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
});

export class Account extends Document{
    accountType : string;
    openingDate : string;
    closingDate : string;
    customerId : string;
    isJoint : boolean;
}

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

export const joiAccountSchema = Joi.object({
    accountType : Joi.string().valid('Current', 'Saving','Credit').required(),
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