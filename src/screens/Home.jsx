import React, { useEffect, useState } from 'react';
import DetailRaiserCard from '../components/DetailRaiserCard';
import RaiserCard from '../components/RaiserCard';

const Home=({contract,
            account,
            setLoading,
            homeInitialRender,
            setHomeInitialRender,
            fundRaisers,
            setFundRaisers})=>{
    const [toggler, setToggler]=useState(false)
    const [fundRaiserDetails,setFundRaiserDetails]=useState({})
    const getAllFundRaisers=async()=>{
        setLoading(true)
        let res=contract && await contract.methods.fundRaiserId().call()
        let count =parseInt(res)
        let fundRaisersFetched=[]
        for (let i=1;i<=count;i++){
            let fundRaiserFetched=await contract.methods.fundRaisers(i).call()
            let exists=await contract.methods.exists(fundRaiserFetched.adress).call()
            if (exists){
                console.log(fundRaiserFetched.uri)
                let response=await fetch(fundRaiserFetched.uri)
                console.log(response)
                let metadata=await response.json()
                
                let adress=fundRaiserFetched.adress
                let votes=fundRaiserFetched.votes
                let heading=metadata.heading
                let purpose=metadata.purpose
                let clip=metadata.clip
                let initialAmount=fundRaiserFetched.initialAmount
                let fundLeft=fundRaiserFetched.fundLeft
                let projectsFunded=fundRaiserFetched.projectsFunded
                
                fundRaisersFetched.push({
                    id:i,
                    address:adress,
                    votes,
                    heading,
                    purpose,
                    clip,
                    initialAmount,
                    fundLeft,
                    projectsFunded
                })
            }
        }
        setFundRaisers(fundRaisersFetched)
        setLoading(false)
    }
    useEffect(()=>{
        if(contract!==''){
            if (homeInitialRender) {
                getAllFundRaisers()
                setHomeInitialRender(false);
            } 
        }
    },[contract])
    contract&&contract.events.FundRaiserAdded({
        filter:{sender:account}
    })
    .on('data',event=>{
        // setMessage
        getAllFundRaisers()
    })
    contract&&contract.events.Contributed({
        filter:{sender:account}
    })
    .on('data',event=>{
        // setMessage
        getAllFundRaisers()
    })
    return(
        <div>
            <div>
                <DetailRaiserCard 
                contract={contract}
                account={account}
                toggler={toggler}
                setToggler={setToggler}
                fundRaiserDetails={fundRaiserDetails}/>
                {fundRaisers.length?(
                    <div className='row d-flex justify-content-center'>
                        {fundRaisers.map((obj,i)=>{
                                return <RaiserCard
                                key={i} 
                                setToggler={setToggler}
                                setFundRaiserDetails={setFundRaiserDetails}
                                id={obj.id}
                                address={obj.address}
                                votes={obj.votes}
                                heading={obj.heading}
                                purpose={obj.purpose}
                                clip={obj.clip}
                                initialAmount={obj.initialAmount}
                                fundLeft={obj.fundLeft}
                                projectsFunded={obj.projectsFunded}/>
                                })
                            }
                    </div>
                ):(
                    <div className='d-flex align-items-center justify-content-center' style={{'height':'100vh'}}>
                        <h4>There are no FundRaisers currently</h4>
                    </div>
                )

                }
            </div>
        </div>
    )
}
export default Home;