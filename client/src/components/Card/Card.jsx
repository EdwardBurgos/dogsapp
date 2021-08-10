import s from './Card.module.css';
import React from 'react';
import { useHistory } from 'react-router';

export default function Card({ name, img, temperament, id }) {
  // Variables
  const history = useHistory();

  return (
    <div className={s.card} onClick={() => history.push(`/detail/${id}`)}>
      <p className={s.title}>{name}</p>
      <img className={s.image} src={img} alt={name} width="100%" />
      {temperament ?
        <div className={s.temperaments}>
          <span className={s.label}>Temperaments:</span>
          <div className={s.temperamentsContainer}>
            {temperament.split(', ').map((e, i) =>
              <div key={i} className={s.test}>
                <div className={s.temperament}>{e}</div>
              </div>
            )}
          </div>
        </div>
        :
        null
      }
      <div className={s.detailsButton}>See details</div>
    </div>
  );
}

