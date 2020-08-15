import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import * as Joi from '@hapi/joi';

export const accountSchema = new mongoose.Schema({
    account_type : {type:String , required:true , enum :[ "Current", "Saving","Credit"]},
    opening_date : {type:Date , required:true , default:Date.now},
    closing_date : {type:Date},
    customerId : {type:String , required:true},
    isJoint : {type:Boolean , required:true ,default:false}
});

accountSchema.method('transform',function(){
    const obj = this.toObject();
    obj.account_number = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
});

export class Account extends Document{
    account_type : string;
    opening_date : string;
    closing_date : string;
    customerId : string;
    isJoint : boolean;
}

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

export const joiAccountSchema = Joi.object({
    account_type : Joi.string().valid('Current', 'Saving','Credit').required(),
    customerId :Joi.string().required(),
    isJoint : Joi.boolean(),
    userDetails : joiUserDetailsSchema,
    mailingaddress : joiMailingAddressSchema
}).unknown();

export const joiAccountUpdateSchema = Joi.object({
    account_number : Joi.string().required(),
    account_type : Joi.string().valid('Current', 'Saving','Credit').required(),
    //customerId :Joi.string().required(),
    isJoint : Joi.boolean(),
}).unknown();