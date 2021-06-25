import Card from '../Card/Card';
import React from 'react';

export default function Cards({dogs}) {
  return (
    <div>{
      dogs.map((e, i) => <Card name={e.name} img={e.image} key={i} temperament={e.temperament} id={e.id}></Card>)
    }
    </div>
  );
}

