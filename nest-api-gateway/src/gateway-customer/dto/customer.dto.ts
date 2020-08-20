export class CustomerDto{
    customerId: string;
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