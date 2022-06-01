const FundRaising = artifacts.require("FundRaising");

module.exports = async function(deployer) {
    const accounts= await web3.eth.getAccounts()
    await deployer.deploy(FundRaising,2,{from:accounts[0]});
};
