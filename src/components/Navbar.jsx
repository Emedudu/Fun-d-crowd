import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../images/crowdFunding.png";

const Navigation=({walletConnect,account})=>{
    const [expanded, setExpanded] = useState(false);
    return(
        <Navbar expanded={expanded} collapseOnSelect expand="lg" variant="light" sticky='top' style={{'backgroundImage': 'linear-gradient(to right,rgba(255,255,255,0.7),rgba(0,200,200,0.4))'}}>
          <Container>
            <Navbar.Brand href="#home"><img src={Logo} alt="FUN-D-CROWD" width="48" height="48"/></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to='/' onClick={() => setExpanded(false)}>HOME</Nav.Link>
                <Nav.Link as={Link} to='/register' onClick={() => setExpanded(false)}>REGISTER AS FUNDRAISER</Nav.Link>
                <Nav.Link as={Link} to='/contributions' onClick={() => setExpanded(false)}>CONTRIBUTIONs</Nav.Link>
              </Nav>
              <Nav>
                {account?(
                  <Nav.Link
                  href={`https://etherscan.io/address/${account}`}
                  target='_blank'
                  className='button nav-button'>
                    {`${account.slice(0,5)}...${account.slice(38,42)}`}
                  </Nav.Link>
                ):(
                  <button onClick={walletConnect} type='button' className='btn btn-primary btn-sm align-self-start'>Connect Wallet</button>
                )
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    )

}
export default Navigation;