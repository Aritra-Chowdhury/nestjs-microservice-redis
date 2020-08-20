import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import * as Joi from '@hapi/joi';

export const customerSchema = new mongoose.Schema({
    name : {type : String , minlength : 4 , maxlength : 150 , required : true},
    email:{type : String , unique: true , required : true},
    password : { type:String , minlength: 8 , required : true},
    userDetails: {
            dob : {type:String},
            martialStatus: {type:String ,enum:["unmarried","married","separated"]},
            panCard : {type:String},
            nationality : {type:String},
            phoneNumber : {type:String}
    },
    mailingAddress: {
            address1 : {type:String, maxlength:150},
            address2 : {type:String, maxlength:150},
            city : {type:String, maxlength:150},
            state : {type:String, maxlength:150},
            country : {type:String, maxlength:50},
            zipCode : {type:String, maxlength:50},
    },
    isActive : { type :Boolean, default :true}
});

customerSchema.method('transform',function(){
        const obj = this.toObject();
     
        //Rename fields
        obj.customerId = obj._id;
        delete obj._id;
        delete obj.__v;
        return obj;
});

export class Customer extends Document{
    name : string;
    email:string;
    password : string;
    userDetails: {
            dob : string;
            martialStatus: string;
            panCard : string;
            nationality : string;
            phoneNumber : string;
    };
    mailingAddress: {
            address1 : string;
            address2 : string;
            city : string;
            state : string;
            country : string;
            zipCode : string;
    };
    isActive : boolean;
};

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