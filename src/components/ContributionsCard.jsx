import React from "react";
import Web3 from "web3";
import Matic from "../images/matic.png";

const ContributionsCard=({heading,
                        purpose,
                        clip,
                        to,
                        amount
                    })=>{
    const web3=new Web3()
    return(
        <div className="p-3 col-10 col-sm-6 col-lg-4">
            <div className="card">
                <img className="card-img-top" src={clip} alt="Project Image"/>
                <div className="card-body">
                    <p className="card-title">
                        <b>Heading: {heading}</b>
                    </p>
                    <p className="card-text">
                        <b>Purpose: </b>{purpose}
                    </p>
                    <p className="card-text">
                        <b>To:</b>{to}
                    </p>
                    <p className="card-text">
                        <b>Amount: </b>{web3.utils.fromWei(amount)}<img src={Matic} height='36px' width='36px' alt="MATIC"/>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default ContributionsCard;