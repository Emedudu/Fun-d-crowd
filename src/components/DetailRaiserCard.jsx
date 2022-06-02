import React, { useState } from "react";
import Web3 from 'web3'

const DetailRaiserCard=({
    contract,
    account,
    toggler,
    setToggler,
    fundRaiserDetails
    })=>{
    const web3=new Web3();
    const [contribution,setContribution]=useState(0)
    const {id,
    address,
    votes,
    heading,
    purpose,
    clip,
    initialAmount,
    fundLeft,
    projectsFunded}=fundRaiserDetails;
    const contribute=(e)=>{
        e.preventDefault();
        if (contribution>0){
            const amount=web3.utils.toWei(`${contribution}`)
            contract&&contract.methods.contribute(id).send({from:account,value:amount,gas:5000000})
            setToggler(false)
        }else{
            // setMessage
            window.alert('Contribution must be greater than zero')
        }
    }
    return(
        <div className={`p-3 position-fixed overflow-auto ${toggler?'visible':'invisible'}`} style={{'backgroundColor':'rgba(255,255,255,0.4)','zIndex':'999','height':'80vh','width':'100%'}}>
            <div className="card row" onClick={()=>setToggler(false)}>
                <img className="card-img-top" src={clip&&clip.toString()} alt="Card image cap"/>
                <div className="d-flex flex-column card-body">
                    <div className="mb-3">
                        <p className="card-title">
                            <b>Heading: {heading&&heading.toString()}</b>
                        </p>
                    </div>
                
                    <div className="mb-3">
                        <p className="card-text">
                            <b>Purpose: </b>{purpose&&purpose.toString()}
                        </p>
                    </div>
                   
                    <div className="row px-2 mb-3">
                        <div className="px-2 col-12 col-sm-6" >
                            <p className="card-text">
                                <b>Id: {id&&id.toString()}</b>
                            </p>
                            <p className="card-text">
                                <b>Votes: </b>{votes&&votes.toString()}
                            </p>
                            <p className="card-text">
                                <b>Address: </b><small>{address&&address.toString()}</small>
                            </p>
                        </div>
                        <div className="px-2 col-12 col-sm-6" >
                            <p className="card-text">
                                <b>Fund Left: </b><i>{fundLeft&&web3.utils.fromWei(fundLeft.toString())}</i><b> ETH</b>
                            </p>
                            <p className="card-text">
                                <b>Initial Amount: </b><i>{initialAmount&&web3.utils.fromWei(initialAmount.toString())}</i><b> ETH</b>
                            </p>
                            <p className="card-text">
                                <b>Number of Projects Funded: </b><i>{projectsFunded&&projectsFunded.toString()}</i>
                            </p>
                        </div>
                    </div>
                </div>
                <input
                onChange={(e)=>setContribution(e.target.value)}
                type='number'
                step='0.01'
                placeholder='Enter amount you want to contribute'
                className='form-control align-self-center col-12 col-sm-8 col-lg-6 mb-2'
                />
                <button onClick={contribute} 
                        type='button' 
                        className={`btn themeColor align-self-center mb-3`}>
                            CONTRIBUTE
                </button>
            </div>
        </div>
    )
}
export default DetailRaiserCard;