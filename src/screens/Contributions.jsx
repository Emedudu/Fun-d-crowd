import React, { useEffect, useState } from 'react';
import ContributionsCard from '../components/ContributionsCard';

const Contributions=({contract,
                    account,
                    setLoading,
                    allContributions,
                    setAllContributions,
                    contributionsInitialRender,
                    setContributionsInitialRender
                })=>{
    const [filteredContributions,setFilteredContributions]=useState([])
    const getAllContributions=()=>{
        setLoading(true)
        contract&&contract.getPastEvents('Contributed',{
            filter:{sender:account},
            fromBlock:0,
            toBlock:'latest'
        }).then(async(events)=>{
            const contributions=await Promise.all(events.map(async obj=>{
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
            setFilteredContributions(contributions)
            setLoading(false)
         })
    }
    const filterContributions=(e)=>{
        e.preventDefault();
        const filtered=allContributions.filter((obj,i)=>{
            return obj.heading.includes(e.target.value)
        })
        setFilteredContributions(filtered)
    }
    useEffect(()=>{
        if(contract&&contributionsInitialRender){
            getAllContributions()
            setContributionsInitialRender(false)
        }
        setFilteredContributions(allContributions)
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
            <input
            onInput={filterContributions}
            placeholder='Search Contributions'
            className='form-control align-self-center col-12 col-sm-8 col-lg-6 mb-2'
            />
            {filteredContributions.length?(
                <div className='d-flex row justify-content-center'>
                    {filteredContributions.map((obj,i)=>{
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
                    <h4>No contributions</h4>
                </div>
            )
            }
            
        
        </div>
    )
}
export default Contributions