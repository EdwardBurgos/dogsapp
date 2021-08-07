import s from './NavBar.module.css';
import { NavLink, Link } from 'react-router-dom';
import React from 'react';
import { IonIcon } from '@ionic/react';
import logo from '../../img/logo.png';
import { menuOutline } from 'ionicons/icons'
import { useState } from 'react';
import { useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux';

export default function NavBar() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const login = useSelector(state => state.login);

  // function myFunction(x) {
  //     if (x.matches) {
  //       left.before(right)
  //       right.style.marginBottom = '16px';
  //     }
  //   }
  useEffect(() => {
    let x = window.matchMedia("(max-width: 768px)")
    x.addEventListener("change", () => {
      if (x.matches) {
        setMostrarMenu(false)
        console.log('READY')
      }
    });

  }, [])

  const [navExpanded, setNavExpanded] = useState(false);

  function setNav(navExpanded) {
    setNavExpanded(navExpanded);
  };
  function closeNav() {
    setNavExpanded(false);
  };

  return (
    // <>
    //   {
    //     mostrarMenu ?
    //       <div className={s.navbarExpanded}>
    //         <div className={s.center}>
    //           <NavLink to="/home" className={s.enlace} onClick={() => setMostrarMenu(false)}><img src={logo} className={s.logo} alt="Cute dog"></img></NavLink>
    //         </div>

    //         <div className={s.center}>
    //           <button onClick={() => mostrarMenu ? setMostrarMenu(false) : setMostrarMenu(true)} className={s.menu}>
    //             <IonIcon icon={menuOutline} className={s.icon}></IonIcon>
    //           </button>
    //         </div>

    //         <NavLink to="/about" className={`${s.enlace} ${s.enlaceInferior}`} onClick={() => setMostrarMenu(false)}><p className={s.sectionExpanded} >About the creator</p></NavLink>
    //         <NavLink to="/create" className={`${s.enlace} ${s.enlaceInferior}`} onClick={() => setMostrarMenu(false)}><p className={s.sectionExpanded}>Register a breed</p></NavLink>
    //       </div>
    //       :
    //       <div className={s.navbar}>
    //         <div className={s.center}>
    //           <NavLink to="/home" className={s.enlace}><img src={logo} className={s.logo} alt="Cute dog"></img></NavLink>
    //         </div>

    //         <NavLink to="/about" className={s.enlace}><p className={s.section}>About the creator</p></NavLink>
    //         <NavLink to="/create" className={s.enlace}><p className={s.section}>Register a new breed</p></NavLink>

    //         <div className={s.center}>
    //           <button onClick={mostrarMenu ? setMostrarMenu(false) : setMostrarMenu(true)} className={s.menu}>
    //             <IonIcon icon={menuOutline} className={s.icon}></IonIcon>
    //           </button>
    //         </div>
    //       </div>
    //   }
    // </>

    <Navbar expand="md" className={s.navbar} id="navBar" expanded={navExpanded}>
      <Navbar.Brand as={NavLink} to="/home" onClick={() => closeNav()}>
        <img src={logo} className={s.logo} alt="Cute dog"></img>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => navExpanded ? setNavExpanded(false) : setNavExpanded(true)} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" >
          <Nav.Link as={NavLink} to="/about" className={s.enlace} activeClassName={s.enlaceActivo} onClick={() => closeNav()}>About the creator</Nav.Link>
          <Nav.Link as={NavLink} to="/create" className={s.enlace} activeClassName={s.enlaceActivo} onClick={() => closeNav()}>Register a new breed</Nav.Link>
        </Nav>
        {
          login ?
            <Navbar.Text className={s.signedInfo}>
              <a href="#login">Mark Otto</a>
            </Navbar.Text>
            :
            <>
              <Nav.Link as={NavLink} to="/signup" className={s.enlace} activeClassName={s.enlaceActivo} onClick={() => closeNav()}>Sign up</Nav.Link>
              <Nav.Link as={NavLink} to="/login" className={s.enlaceLogin} activeClassName={s.enlaceActivo} onClick={() => closeNav()}>Log in</Nav.Link>
            </>
        }

      </Navbar.Collapse>
    </Navbar>


    // <div className={s.card}>
    //   <p className={s.title}>{name}</p>
    //   <img src={img} alt={name} width="100%" />
    //   <div className={s.temperaments}>
    //   <span className={s.label}>Temperaments:</span>
    //   <p>{temperament}</p>
    //   </div>
    //   <Link to={`/detail/${id}`}><button className={s.detailsButton}>See details</button></Link>
    // </div>
  );
}
