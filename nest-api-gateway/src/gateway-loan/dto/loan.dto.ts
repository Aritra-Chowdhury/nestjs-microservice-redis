export class LoanDto {
    loanNumber : string;
    customerId : string;
    accountNumber : string;
    loanType : string;
    loanAmount : number;
    loanDuration : string;
    offer : {
        offerName : string;
        offerType : string;
        offerPercentage : number;
    };
    status : string;
    customer : any;
    monthlyEMI : number;
    loanCreationDate : string;
    lastUpdatedDate : string;
}