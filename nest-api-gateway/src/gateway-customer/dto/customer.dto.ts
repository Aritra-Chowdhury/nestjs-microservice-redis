export class CustomerDto{
    customerId: string;
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