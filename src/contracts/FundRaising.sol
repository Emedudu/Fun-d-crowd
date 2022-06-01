pragma solidity ^0.8.0;

contract FundRaising {
    // unique id for each fund raiser
    uint public fundRaiserId;
    // percentage of bank charges
    uint public percentage;
    // address to pay the bank charges
    address payable public feeBank;
    // fund raiser is an object with values: address(for payment of funds), votes(to sort fund raisers according to priority),
    // purpose of raising the fund, and amount of fund left to be completed 
    struct FundRaiser{
        address payable adress;
        uint votes;
        string purpose;
        uint initialAmount;
        int fundLeft;
        uint projectsFunded;
        mapping(address=>bool) allVoters;
    }
    // a mapping of the fund raisers id to the fund raisers object
    mapping(uint=>FundRaiser) public fundRaisers;
    // mapping address of the fund raiser to a boolean(exists or not)
    mapping(address=>bool) public exists;
    // look up id of a particular address that might have been added to fund raisers platform in the past
    mapping(address=>uint) public lookUpId;
    // events
    event FundRaiserAdded(address indexed sender,uint id,uint fund,string purpose);
    event Contributed(address indexed sender,address to,uint amount);
    // constructor
    constructor(uint percent){
        // initializing bank charges and address during deployment
        percentage=percent;
        feeBank=payable(msg.sender);
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
        uint fundedProjects=fundRaisers[id].projectsFunded;
        FundRaiser storage fundRaiser=fundRaisers[id];
        fundRaiser.adress=payable(msg.sender);
        fundRaiser.votes=0;
        fundRaiser.purpose=purpose;
        fundRaiser.initialAmount=fund;
        fundRaiser.fundLeft=int(fund);
        fundRaiser.projectsFunded=fundedProjects;
        fundRaiser.allVoters;
        // update 'exists' value to prevent same fund raiser from raising funds twice
        exists[msg.sender]=true;
        emit FundRaiserAdded(msg.sender,id,fund,purpose);
    }
    // vote a fund raiser to show priority
    function vote(uint id)public{
        FundRaiser storage votee=fundRaisers[id];
        require(votee.allVoters[msg.sender]==false,'You cannot vote twice');
        require(id<=fundRaiserId && exists[votee.adress],'Fund Raiser does not exist');
        votee.votes++;
        votee.allVoters[msg.sender]=true;
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

        votee.fundLeft-=int(amount-fee);
        // if fund already raised, remove fund raiser
        if (votee.fundLeft<=0){
            votee.projectsFunded+=1;
            exists[votee.adress]=false;
        }
        emit Contributed(msg.sender,votee.adress,amount);
    }
    // calculate the bank fee
    function calculateBankFee(uint amt)public view returns(uint){
        return amt*percentage/100 ;
    }
}