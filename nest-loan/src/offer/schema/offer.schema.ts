import * as mongoose from 'mongoose';
import {Document} from 'mongoose';

export const offerSchema = new mongoose.Schema({
    offerName : {type: String , required: true , unique: true},
    offerType : {type: String , required: true , enum: [ "Platinum" , "Gold" , "Silver"]},
    loanType : {type: String , required: true , enum: [ "Home" , "Car" , "Personal"]},
    lastUpdateDate : {type: Date , required: true , default :Date.now},
    offerPercentage : {type: Number}
});

offerSchema.method('transform',function(){
    const obj = this.toObject();
    obj.offerId = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
});

export class Offer extends Document{
    offerName : string;
    offerType : string;
    loanType : string;
    lastUpdateDate : string;
    offerPercentage : number;
}
