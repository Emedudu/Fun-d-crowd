import React, { useState } from 'react';
import Web3 from 'web3';
import {create as ipfsHttpClient} from 'ipfs-http-client'

const client=ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Register=({contract,account})=>{
    const [file,setFile]=useState('')
    const [heading,setHeading]=useState('')
    const [purpose,setPurpose]=useState('')
    const [fund,setFund]=useState(0)
    const web3=new Web3()
    const setFileFromInput=(e)=>{
        const fileForUpload=e.target.files[0]
        const reader  = new FileReader();
        reader.onload=(e)=>{
            const readFile=e.target.result
            readFile&&setFile(readFile)
        }
        reader.readAsDataURL(fileForUpload)   
    }
    const submitForm=async(e)=>{
        e.preventDefault();
        let metadata=JSON.stringify({heading,purpose,clip:file})
        try{
            let res=await client.add(metadata)
            contract&&contract.methods.addFundRaiser(web3.utils.toWei(`${fund}`),`https://ipfs.infura.io/ipfs/${res.path}`).send({from:account, gas:5000000})
        }catch(error){
            // gonna setMessage
            console.log('Could not upload to IPFS, Please try again on another device')
        }
    }
    contract&&contract.events.FundRaiserAdded({
        filter:{adress:account}
    })
        .on('data',event=>{console.log(event.returnValues)})
    return(
        <div>
            <input 
            onChange={setFileFromInput}
            type='file'
            placeholder='Choose Image'
            className="form-control"
            accept="audio/*,video/*,image/*"
            />
            <input
            onChange={(e)=>setHeading(e.target.value)}
            placeholder='Enter a brief heading of the project'
            className='form-control'
            />
            <textarea
            onBlur={(e)=>setPurpose(e.target.value)}
            rows='4'
            placeholder='Enter purpose of project in detail'
            className='form-control'
            />
            <input
            onChange={(e)=>setFund(e.target.value)}
            type='number'
            step='0.01'
            placeholder='Enter Fund needed in ETH'
            className='form-control'
            />
            <button onClick={submitForm} type='button' className='btn btn-primary'>UPLOAD</button>
            <img src={file} height='48px' width='48px'/>
        </div>
    )
}
export default Register;