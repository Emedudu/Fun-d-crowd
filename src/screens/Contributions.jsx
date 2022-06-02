import React, { useEffect } from 'react';
import ContributionsCard from '../components/ContributionsCard';

const Contributions=({contract,
                    account,
                    setLoading,
                    allContributions,
                    setAllContributions,
                    contributionsInitialRender,
                    setContributionsInitialRender
                })=>{
    const getAllContributions=()=>{
        setLoading(true)
        contract&&contract.getPastEvents('Contributed',{
            filter:{sender:account},
            fromBlock:0,
            toBlock:'latest'
        }).then(async(events)=>{
            const contributions=await Promise.all(events.map(async obj=>{
                console.log(obj)
                obj=obj.returnValues
                const {to,amount,uri}=obj
                const response=await fetch(uri)
                const metadata=await response.json()
                const {heading,purpose,clip}=metadata
                return({
                    heading,
                    purpose,
                    clip,
                    to,
                    amount
                })
            }))
            setAllContributions(contributions);
            setLoading(false)
         })
    }
    useEffect(()=>{
        if(contract&&contributionsInitialRender){
            getAllContributions()
            setContributionsInitialRender(false)
        }
    },[contract])
    contract&&contract.events.Contributed({
        filter:{sender:account}
    })
    .on('data',event=>{
        // setMessage
        getAllContributions()
    })
    return(
        <div>
            Contributions
            
            {allContributions.length?(
                <div className='d-flex row justify-content-center'>
                    {allContributions.map((obj,i)=>{
                            return <ContributionsCard
                            key={i} 
                            heading={obj.heading}
                            purpose={obj.purpose}
                            clip={obj.clip}
                            to={obj.to}
                            amount={obj.amount}                                />
                            })
                        }
                </div>
            ):(
                <div className='d-flex align-items-center justify-content-center' style={{'height':'100vh'}}>
                    <h4>You have never contributed in your life</h4>
                </div>
            )
            }
            
        
        </div>
    )
}
export default Contributions