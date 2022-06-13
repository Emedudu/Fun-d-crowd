import React, { useState } from "react";
import Web3 from 'web3'
import Matic from "../images/matic.png";
// import Like from "../images/like.png";
// import { useEffect } from "react";

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
        <div className={`p-3 align-self-center position-fixed overflow-auto ${toggler?'visible':'invisible'}`} style={{'backgroundColor':'rgba(255,255,255,0.4)','zIndex':'999','width':'100%','height':'80vh'}}>
            <div className="card row">
                <img className="card-img-top" src={clip&&clip.toString()} alt="Project Pic"/>
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
                            {/* <p className="card-text">
                                <b>Votes: </b>{votes&&votes.toString()}<img src={Like} height='36px' width='40px' alt="LIKES"/>
                            </p> */}
                            <p className="card-text">
                                <b>Address: </b><small>{address&&address.toString()}</small>
                            </p>
                        </div>
                        <div className="px-2 col-12 col-sm-6" >
                            <p className="card-text">
                                <b>Fund Left: </b><i>{fundLeft&&web3.utils.fromWei(fundLeft.toString())}</i><img src={Matic} height='36px' width='36px' alt="MATIC"/>
                            </p>
                            <p className="card-text">
                                <b>Initial Amount: </b><i>{initialAmount&&web3.utils.fromWei(initialAmount.toString())}</i><img src={Matic} height='36px' width='36px' alt="MATIC"/>
                            </p>
                            <p className="card-text">
                                <b>Number of Projects Funded: </b><i>{projectsFunded&&projectsFunded.toString()}</i>
                            </p>
                        </div>
                    </div>
                    {/* <div className='d-flex flex-row justify-content-end'>
                        <button type='button'
                                className='btn'>
                            <img src={Like} height='36px' width='40px' alt="SUPPORT"/>
                        </button>
                    </div> */}
                </div>
                <div className="row">
                    <input
                    onChange={(e)=>setContribution(e.target.value)}
                    type='number'
                    step='0.01'
                    placeholder={`Enter amount in MATIC`}
                    className='form-control ml-2 col-6 mb-2'
                    />
                    <button onClick={contribute} 
                            type='button' 
                            className={`btn themeColor col-3 p-0 ml-5`}>
                                <b>DONATE</b>
                    </button>
                </div>   
                <button onClick={()=>setToggler(false)}
                        type='button' 
                        className={`btn btn-danger align-self-center m-3`}>
                            CANCEL
                </button>
                
            </div>
        </div>
    )
}
export default DetailRaiserCard;