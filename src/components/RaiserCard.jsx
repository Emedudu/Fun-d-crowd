import React from "react";
import Web3 from "web3";
import Matic from "../images/matic.png";

const RaiserCard=({
    setToggler,
    setFundRaiserDetails,
    id,
    address,
    votes,
    heading,
    purpose,
    clip,
    initialAmount,
    fundLeft,
    projectsFunded})=>{
    let web3=new Web3()
    const toggleDetailsFunction=()=>{
        setToggler(true);
        setFundRaiserDetails({
            id,
            address,
            votes,
            heading,
            purpose,
            clip,
            initialAmount,
            fundLeft,
            projectsFunded
        })
    }
    return(
        <div className="p-3 col-10 col-sm-6 col-lg-4">
            <div className="card" onClick={toggleDetailsFunction}>
                <img className="card-img-top" src={clip} alt="Project Image"/>
                <div className="card-body">
                    <p className="card-title">
                        <b>Heading: {heading}</b>
                    </p>
                    <p className="card-text">
                        <b>Purpose: </b>{purpose}
                    </p>
                    <p className="card-text">
                        <b>Fund Left: {web3.utils.fromWei(fundLeft.toString())}</b><img src={Matic} height='36px' width='36px' alt="MATIC"/>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default RaiserCard;