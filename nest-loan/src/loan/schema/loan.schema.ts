import * as mongoose from 'mongoose';
import {Document} from 'mongoose';

export const loanSchema = new mongoose.Schema({
    customerId : {type: String , required: true },
    accountNumber : {type: String , required: true },
    loanType : { type: String , required: true , enum: [ "Home" , "Car" , "Personal"]},
    loanAmount : {type: Number , min : 0 , required: true},
    loanDuration : { type: Number , required: true , enum: [ 10 , 15 , 30]},
    offer : {
        offerName : {type: String , required: true },
        offerType : {type: String , required: true , enum: [ "Platinum" , "Gold" , "Silver"]},
        offerPercentage : {type: Number ,required: true}
    },
    status : {type: String , required: true , enum: [ "Pending" , "Approved" , "Rejected"] , default : "Pending"},
    monthlyEMI : {type: Number ,required: true},
    loanCreationDate : {type: Date , required: true , default :Date.now},
    lastUpdatedDate : {type: Date , required: true},
});

loanSchema.method('transform',function(){
    const obj = this.toObject();
    obj.loanNumber = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
});

export class Loan extends Document{
    customerId : string;
    accountNumber : string;
    loanType : string;
    loanAmount : string;
    loanDuration : string;
    offer : {
        offerName : string;
        offerType : string;
        offerPercentage : number;
    };
    status : string;
    monthlyEMI : number;
    loanCreationDate : string;
    lastUpdatedDate : string;
}