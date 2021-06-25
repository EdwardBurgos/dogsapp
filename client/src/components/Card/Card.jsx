import s from './Card.module.css';
import {Link} from 'react-router-dom';
import React from 'react';

export default function Card({name, img, temperament, id}) {
  return (
    <div className={s.card}>
      <h1>{name}</h1>
      <img src={img} alt={name} height="200px"/>
      <div>
      <span className={s.label}>Temperaments:</span> 
      <p>{temperament}</p>
      </div>
      <Link to={`/detail/${id}`}><button>See details</button></Link>
    </div>
  );
}

