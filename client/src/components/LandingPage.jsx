import s from '../styles/LandingPage.module.css';
import {Link} from 'react-router-dom';
import React from 'react';

export default function LandingPage() {
  return (
    <div className={s.container}>
      <h1>Henry Dogs</h1>
      <Link to="/home"><button className={s.buttonHome}>HOME</button></Link>
    </div>
  );
}

