import React from "react";

const DetailRaiserCard=({
    toggler,
    fundRaiserDetails
    })=>{
    ({id,
    address,
    votes,
    heading,
    purpose,
    clip,
    initialAmount,
    fundLeft,
    projectsFunded})=fundRaiserDetails;
    return(
        <div className={`d-flex justify-content-center position-fixed align-items-center ${toggler?'visible':'invisible'}`} style={{'backgroundColor':'rgba(255,255,255,0.5)','zIndex':'999','height':'80vh'}}>
            <div >

            </div>
        </div>
    )
}
export default DetailRaiserCard;