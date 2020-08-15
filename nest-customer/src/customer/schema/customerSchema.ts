import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import * as Joi from '@hapi/joi';

export const customerSchema = new mongoose.Schema({
    name : {type : String , minlength : 4 , maxlength : 150 , required : true},
    email:{type : String , unique: true , required : true},
    password : { type:String , minlength: 8 , required : true},
    userDetails: {
            dob : {type:String},
            martial_status: {type:String ,enum:["unmarried","married","separated"]},
            pan_card : {type:String},
            nationality : {type:String},
            phone_number : {type:String}
    },
    mailingaddress: {
            address1 : {type:String, maxlength:150},
            address2 : {type:String, maxlength:150},
            city : {type:String, maxlength:150},
            state : {type:String, maxlength:150},
            country : {type:String, maxlength:50},
            zip_code : {type:String, maxlength:50},
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
            martial_status: string;
            pan_card : string;
            nationality : string;
            phone_number : string;
    };
    mailingaddress: {
            address1 : string;
            address2 : string;
            city : string;
            state : string;
            country : string;
            zip_code : string;
    };
    isActive : boolean;
};

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