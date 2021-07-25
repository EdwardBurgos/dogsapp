import s from './Card.module.scss';
import {Link} from 'react-router-dom';
import React from 'react';

export default function Card({name, img, temperament, id}) {
  return (
    <div className={s.card}>
      <p className={s.title}>{name}</p>
      <img src={img} alt={name} width="100%"/>
      <div className={s.temperaments}>
      <span className={s.label}>Temperaments:</span> 
      <p>{temperament}</p>
      </div>
      <Link to={`/detail/${id}`}><button className={s.detailsButton}>See details</button></Link>
    </div>
  );
}

