import React from "react";

const ContributionsCard=({heading,
                        purpose,
                        clip,
                        to,
                        amount
                    })=>{
    return(
        <div>
            <div >
                <p>

                {heading}
                </p>
                <p>
                    
                {purpose}
                </p>
                <p>
                {clip}
                    
                </p>
                <p>
                    
                {to}
                </p>
                <p>
                {amount}
                    
                </p>
            </div>
        </div>
    )
}
export default ContributionsCard;