export class LoanDto {
    loanNumber : string;
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
}