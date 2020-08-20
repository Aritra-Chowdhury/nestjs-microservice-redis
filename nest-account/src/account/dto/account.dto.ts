export class AccountDto {
    accountNumber : string;
    accountType : string;
    openingDate : string;
    closingDate : string;
    customerId : string;
    customer : any;
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
    isJoint : boolean;
}