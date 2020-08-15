export class AccountDto {
    account_number : string;
    account_type : string;
    opening_date : string;
    closing_date : string;
    customerId : string;
    customer : any;
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
    isJoint : boolean;
}