import Card from '../Card/Card';
import React from 'react';
import s from './Cards.module.css';

export default function Cards({ dogs }) {
  return (
    <div className={s.container}>
      {
        dogs.map((e, i) => <Card name={e.name} img={e.image} key={i} temperament={e.temperament} id={e.id}></Card>)
      }
    </div>
  );
}

