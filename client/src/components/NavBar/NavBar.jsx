import s from './NavBar.module.css';
import { NavLink, useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import logo from '../../img/logo.png';
import { useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { isLoggedIn, logout, getUserInfo } from '../../extras/globalFunctions';
import { useDispatch } from 'react-redux';
import { setUser } from '../../actions';
import axios from '../../axiosInterceptor';
import { toast } from 'react-toastify';

toast.configure();

export default function NavBar() {
  // Redux states
  const user = useSelector(state => state.user)

  // Own States 
  const [navExpanded, setNavExpanded] = useState(false);

  // Variables
  const dispatch = useDispatch();
  const history = useHistory();



  // This function allows us to use the toasts
  function showMessage(data) {
    toast(data, { position: toast.POSITION.BOTTOM_LEFT, pauseOnFocusLoss: false })
}

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
          Object.keys(user).length ?
            //   {/* // <Navbar.Text className={s.signedInfo}>
            // //   <a href="#login">{user.name}</a>
            // // </Navbar.Text> */}
            <Dropdown align={{ md: 'end' }}>
              <Dropdown.Toggle variant="light" id="dropdown-basic" className={s.titleDropdown}>
                <img className={s.profilePic} src={user.profilepic} alt='User profile'></img>
                <span>{user.fullname}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu> 
              {/* className={s.enlaceSignup} activeClassName={s.enlaceActivo} */}
                <Dropdown.Item to="/profile" onClick={() => history.push('/profile')}>Edit my profile</Dropdown.Item>
                <Dropdown.Item onClick={() => { logout(); dispatch(setUser({})); history.push('/login'); showMessage(`Logged out successfully`);}}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
