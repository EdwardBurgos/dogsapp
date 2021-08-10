import s from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import React from 'react';
import logo from '../../img/logo.png';
import { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import { useSelector } from 'react-redux';

export default function NavBar() {
  // Own States 
  const [navExpanded, setNavExpanded] = useState(false);

  // Redux states
  const login = useSelector(state => state.login);
  
  return (
    <Navbar expand="md" className={s.navbar} id="navBar" expanded={navExpanded} fixed="top">
      <Navbar.Brand as={NavLink} to="/home" onClick={() => setNavExpanded(false)} className={s.brand}>
        <img src={logo} className={s.logo} alt="Cute dog"></img>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => navExpanded ? setNavExpanded(false) : setNavExpanded(true)} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" >
          <Nav.Link as={NavLink} to="/about" className={s.enlace} activeClassName={s.enlaceActivo} onClick={() => setNavExpanded(false)}>About the creator</Nav.Link>
          <Nav.Link as={NavLink} to="/create" className={s.enlace} activeClassName={s.enlaceActivo} onClick={() => setNavExpanded(false)}>Register a new breed</Nav.Link>
        </Nav>
        {
          login ?
            <Navbar.Text className={s.signedInfo}>
              <a href="#login">Mark Otto</a>
            </Navbar.Text>
            :
            <>
              <Nav.Link as={NavLink} to="/signup" className={s.enlaceSignup} activeClassName={s.enlaceActivo} onClick={() => setNavExpanded(false)}>Sign up</Nav.Link>
              <Nav.Link as={NavLink} to="/login" className={s.enlaceLogin} activeClassName={s.enlaceActivo} onClick={() => setNavExpanded(false)}>Log in</Nav.Link>
            </>
        }
      </Navbar.Collapse>
    </Navbar>
  );
}
