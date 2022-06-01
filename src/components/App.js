import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import FundRaising from '../abis/FundRaising'
import Navigation from './Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from '../screens/Home';
import Contributions from '../screens/Contributions';
import Register from '../screens/Register';

const App =()=> {
  const [contract,setContract]=useState('')
  const [accounts,setAccounts]=useState('')
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [fundRaisers,setFundRaisers]=useState([])
  
  const loadBlockChainData=async()=>{
    setLoading(true)
    if(typeof window.ethereum!=='undefined'){
      const web3 = await new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'))
      // const url = `wss://eth-rinkeby.alchemyapi.io/v2/Mf4wYG7-6h-tjTrtHuvf-OiecMxN11vF`;
      // Using WebSockets
      // const web3 = createAlchemyWeb3(url);
      // Using web3js
      // const web3 = new Web3(new Web3.providers.WebsocketProvider(url));
      await window.ethereum.enable();
      const netId=await web3.eth.net.getId();
      const accounts=await web3.eth.getAccounts();
      if(typeof accounts[0] !=='undefined'){
        setAccounts(accounts);
        window.localStorage.setItem('connect', true);
      }else{
        window.alert('Please login with metamask')
      }
      try{
        let contract=await new web3.eth.Contract(FundRaising.abi,FundRaising.networks[netId].address);
        setContract(contract)
      }catch(err){
        window.alert("Unable to load Contracts")
      }
    }else{
      window.alert('Please Install Metamask')
    }
    setLoading(false)
  }
  useEffect(()=>{
    let connect=window.localStorage.getItem('connect');
    if (connect){
      loadBlockChainData()
    }
  },[])

  return (
    <div className={`container-fluid m-0 p-0 full-width d-flex flex-column ${loading&&'overflow-hidden'}`} style={{'backgroundImage': 'linear-gradient(to right,rgba(255,255,255,0.2),rgba(0,0,100,0.2))'}}>
      <Navigation walletConnect={loadBlockChainData} account={accounts[0]}/>
      <div className='container-fluid'>
        <div className={`container-fluid full-width d-flex position-fixed justify-content-between p-3 mb-2 bg-info text-white ${message!==''?'visible':'invisible'}`} style={{'zIndex':'999','backgroundImage':'linear-gradient(to right,rgba(0,0,200,0.5),rgba(255,255,255,0.2))'}}>
          {message}
          <button type="button" className="close" aria-label="Close" onClick={()=>setMessage('')}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className={`d-flex full-width justify-content-center position-fixed align-items-center ${loading?'visible':'invisible'}`} style={{'backgroundColor':'rgba(255,255,255,0.5)','zIndex':'999','height':'100vh'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <Routes>
          <Route exact path='/' element={<Home contract={contract} setLoading={setLoading} fundRaisers={fundRaisers} setFundRaisers={setFundRaisers}/>}/>
          <Route exact path='/contributions' element={<Contributions contract={contract}/>}/>
          <Route exact path='/register' element={<Register contract={contract}/>}/>
        </Routes>      
      </div>
    </div>
  );
  
}

export default App;
