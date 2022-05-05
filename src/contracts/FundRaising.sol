pragma solidity ^0.8.0;

contract FundRaising {
    // unique id for each fund raiser
    uint fundRaiserId;
    // percentage of bank charges
    uint percentage;
    // address to pay the bank charges
    address payable feeBank;
    // fund raiser is an object with values: address(for payment of funds), votes(to sort fund raisers according to priority),
    // purpose of raising the fund, and amount of fund left to be completed 
    struct FundRaiser{
        address payable adress;
        uint votes;
        string purpose;
        uint fundLeft;
    }
    // a mapping of the fund raisers id to the fund raisers object
    mapping(uint=>FundRaiser) fundRaisers;
    // mapping address of the fund raiser to a boolean(exists or not)
    mapping(address=>bool) exists;
    // look up id of a particular address that might have been added to fund raisers platform in the past
    mapping(address=>uint) lookUpId;
    // constructor
    constructor(uint percent,address bank){
        // initializing bank charges and address during deployment
        percentage=percent;
        feeBank=payable(bank);
    }
    // add a fund raiser to the platform (accepts purpose and fund as input)
    function addFundRaiser(uint fund,string memory purpose)public{
        // a particular fund raiser cannot raise multiple funds at a time
        require(!exists[msg.sender],'Fund Raiser already exists');
        uint id;
        // if sender has never raised fund on the platform,
        if (lookUpId[msg.sender]==0){
            // increment and assign global fund raiser id
            fundRaiserId++;
            id=fundRaiserId;
            // update the mapping to include new fund raiser
            lookUpId[msg.sender]=id;
        }else{
            // else the id is the id of the fund raiser as at when he initially raised fund
            // (this is to ensure credibility of a particular fund raiser)
            id=lookUpId[msg.sender];
        }
        fundRaisers[id]=FundRaiser({
            adress:payable(msg.sender),
            votes:0,
            purpose:purpose,
            fundLeft:fund
        });
        // update 'exists' value to prevent same fund raiser from raising funds twice
        exists[msg.sender]=true;
    }
    // vote a fund raiser to show priority
    function vote(uint id)public{
        FundRaiser storage votee=fundRaisers[id];
        require(id<=fundRaiserId && exists[votee.adress],'Fund Raiser does not exist');
        votee.votes++;
    }
    // contribute to a fund raiser
    function contribute(uint id)payable public{
        FundRaiser storage votee=fundRaisers[id];
        // fund raiser must be available
        require(exists[votee.adress],'This fund raiser does not exist');
        // contribution must be greater then zero
        require(msg.value>0,"Contribution must be greater than zero");
        uint amount=msg.value;
        // get the amount to be transfered to the fee bank
        uint fee=calculateBankFee(amount);
        // transfer to the bank and fund raiser
        feeBank.transfer(fee);
        votee.adress.transfer(amount-fee);
        // if fund already raised, remove fund raiser
        if (votee.fundLeft<=amount-fee){
            votee.fundLeft=0;
            exists[votee.adress]=false;
        }else{
            // else just subtract the amount contributed
            votee.fundLeft-=(amount-fee);
        }
    }
    // calculate the bank fee
    function calculateBankFee(uint amt)public view returns(uint){
        return amt*percentage/100 ;
    }
}