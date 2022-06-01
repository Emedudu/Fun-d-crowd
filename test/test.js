const { assert,expect } = require('chai')

const FundRaising=artifacts.require('./FundRaising')

const toWei=(eth)=>{return (web3.utils.toWei(eth))}
require('chai')
    .use(require('chai-as-promised'))
    .should()

let raise

contract('tests',(accounts)=>{
    before(async()=>{
        raise=await FundRaising.deployed()
    })
    describe('Constructor variables',()=>{
        it('should have correct percentage and feebank',async()=>{
            let percent=await raise.percentage()
            let feeBank=await raise.feeBank()
            console.log(percent,feeBank)
            assert.equal(percent,2)
            assert.equal(feeBank,accounts[0])
        })
    })
    describe('addFundRaiser function',()=>{
        it('should add the fund raiser to the platform',async()=>{
            let result=await raise.addFundRaiser(toWei('3'),'To pay children school fees',{from:accounts[1]})
            assert.equal(result.logs[0].args.fund,toWei('3'))
            let id=await raise.lookUpId(accounts[1])
            assert.equal(id,1)
            let exist1=await raise.exists(accounts[1]);
            console.log(exist1)
        })
        it('should not add fund raiser',async()=>{
            await expect(raise.addFundRaiser(toWei('3'),'To pay children school fees',{from:accounts[1]})
                ).to.be.rejectedWith('Fund Raiser already exists')
                let exist1=await raise.exists(accounts[1]);
                console.log(exist1)
        })
        it('should also add the fund raiser to the platform',async()=>{
            let result=await raise.addFundRaiser(toWei('2'),'For the orphanage',{from:accounts[2]})
            assert.equal(parseInt(result.logs[0].args.fund.toString()),toWei('2'))
            let id=await raise.lookUpId(accounts[2])
            assert.equal(id,2)
            let exist1=await raise.exists(accounts[1]);
            console.log(exist1)
        })
    })
    describe('contribute function',()=>{
        it('should contribute successfully',async()=>{
            let result=await raise.contribute(1,{from:accounts[3],value:toWei('2')})
            assert.equal(result.logs[0].args.to,accounts[1],'it should be paid to first account')
            let bankFee=await raise.calculateBankFee(toWei('2'));
            let fundRaiser=await raise.fundRaisers(1);
            assert(parseInt(fundRaiser.fundLeft.toString())==toWei('3')-(toWei('2')-bankFee),'Probably recalculate the fund left')
        })
        it('should also contribute suceessfully',async()=>{
            let result=await raise.contribute(1,{from:accounts[4],value:toWei('2')})
            assert.equal(result.logs[0].args.to,accounts[1],'it should be paid to first account')
            let bankFee=await raise.calculateBankFee(2);
            let fundRaiser=await raise.fundRaisers(1);
            console.log(fundRaiser.fundLeft)
            assert(fundRaiser.fundLeft<0,'should be less than zero')
        })
        it('should not contribute suceessfully',async()=>{
            await expect(raise.contribute(1,{from:accounts[5],value:toWei('2')})
                ).to.be.rejectedWith('This fund raiser does not exist')
        })
    })
    describe('vote function',()=>{
        it('should vote successfully',async()=>{
            let exist1=await raise.exists(accounts[1]);
            let exist2=await raise.exists(accounts[2]);
            let exist3=await raise.exists(accounts[3]);
            let exist4=await raise.exists(accounts[4]);
            console.log(exist1,exist2,exist3,exist4)
            await raise.vote(1,{from:accounts[6]})
            let fundRaiser=await raise.fundRaisers(1)
            assert.equal(fundRaiser.votes,1)
        })
        it('should not vote successfully',async()=>{
            await expect(raise.vote(1,{from:accounts[6]})
                ).to.be.rejectedWith('You cannot vote twice')
            let fundRaiser=await raise.fundRaisers(1)
            assert.equal(fundRaiser.votes,1)
        })
        it('should vote successfully',async()=>{
            await raise.vote(2,{from:accounts[6]})
            let fundRaiser=await raise.fundRaisers(2)
            assert.equal(fundRaiser.votes,1)
        })
        it('should vote successfully',async()=>{
            await raise.vote(1,{from:accounts[7]})
            let fundRaiser=await raise.fundRaisers(1)
            assert.equal(fundRaiser.votes,2)
        })
    })
})