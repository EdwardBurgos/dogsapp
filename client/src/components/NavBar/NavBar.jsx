import s from './NavBar.module.css';
import {NavLink} from 'react-router-dom';
import React from 'react';
import logo from '../../img/logo.gif';

export default function NavBar() {
  return (
      <div className={s.navbar}>
      <NavLink to="/home" className={s.enlace}><p className={s.section}>Home</p></NavLink>
      <NavLink to="/about" className={s.enlace}><p className={s.section}>About the creator</p></NavLink>
      <NavLink to="/create" className={s.enlace}><p className={s.section}>Create breed</p></NavLink>
      <img src={logo} className={s.logo} alt="Cute dog"></img>
      </div>
    // <div className={s.card}>
    //   <p className={s.title}>{name}</p>
    //   <img src={img} alt={name} width="100%"/>
    //   <div className={s.temperaments}>
    //   <span className={s.label}>Temperaments:</span> 
    //   <p>{temperament}</p>
    //   </div>
    //   <Link to={`/detail/${id}`}><button className={s.detailsButton}>See details</button></Link>
    // </div>
  );
}
