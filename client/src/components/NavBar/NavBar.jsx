import s from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { IonIcon } from '@ionic/react';
import logo from '../../img/logo.png';
import { menuOutline } from 'ionicons/icons'
import { useState } from 'react';
import { useEffect } from 'react';

export default function NavBar() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  // const x = window.matchMedia("(max-width: 768px)")
  //let x ;
  function desplegarMenu() {
    console.log(mostrarMenu)
    mostrarMenu ? setMostrarMenu(false) : setMostrarMenu(true)
    console.log(mostrarMenu)
  }

  

  // function myFunction(x) {
  //     if (x.matches) {
  //       left.before(right)
  //       right.style.marginBottom = '16px';
  //     }
  //   }
  useEffect(() => {
    let x = window.matchMedia("(max-width: 768px)")
    x.addEventListener("change", () => {
      if (x.matches) setMostrarMenu(false)
    });

  }, [])

  return (
    <>
      {
        mostrarMenu ?
          <div className={s.navbarExpanded}>
            <div className={s.center}>
              <NavLink to="/home" className={s.enlace} ><img src={logo} className={s.logo} alt="Cute dog"></img></NavLink>
            </div>

            <div className={s.center}>
              <button onClick={desplegarMenu} className={s.menu}>
                <IonIcon icon={menuOutline} className={s.icon}></IonIcon>
              </button>
            </div>

            <NavLink to="/about" className={`${s.enlace} ${s.enlaceInferior}`} onClick={() => console.log('')}><p className={s.sectionExpanded} >About the creator</p></NavLink>
            <NavLink to="/create" className={`${s.enlace} ${s.enlaceInferior}`} onClick={() => console.log('')}><p className={s.sectionExpanded}>Create breed</p></NavLink>
          </div>
          :
          <div className={s.navbar}>
            <div className={s.center}>
            <NavLink to="/home" className={s.enlace}><img src={logo} className={s.logo} alt="Cute dog"></img></NavLink>
            </div>
            
            <NavLink to="/about" className={s.enlace}><p className={s.section}>About the creator</p></NavLink>
            <NavLink to="/create" className={s.enlace}><p className={s.section}>Create breed</p></NavLink>

            <div className={s.center}>
              <button onClick={desplegarMenu} className={s.menu}>
                <IonIcon icon={menuOutline} className={s.icon}></IonIcon>
              </button>
            </div>
          </div>
      }
    </>

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
