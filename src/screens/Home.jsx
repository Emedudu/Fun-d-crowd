import React from 'react';
import DetailRaiserCard from '../components/DetailRaiserCard';

const Home=({contract,setLoading,fundRaisers,setFundRaisers})=>{
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
                let response=await fetch(fundRaiserFetched.uri)
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
    return(
        <div>
            Home
            <div>
                <DetailRaiserCard 
                toggler={toggler}
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