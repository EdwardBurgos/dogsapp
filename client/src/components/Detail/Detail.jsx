import s from './Detail.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Detail({ id }) {
    const [dog, setDog] = useState({});

    useEffect(() => {
        async function findDog(id) {
            const response = await axios.get(`http://localhost:3001/dogs/${id}`);
            setDog(response.data);
        }
        findDog(id);
    }, [id])
    
    return (
        <div className={s.container}>
            <h1>{dog.name}</h1>
            <img src={dog.image} className={s.image} alt={dog.name}></img>
            <div>
                <span className={s.label}>Temperament :</span>
                <p>{dog.temperament}</p>
            </div>
            <div>
                <span className={s.label}>Height :</span>
                <p>{dog.height} cm</p>
            </div>
            <div>
                <span className={s.label}>Weight :</span>
                <p>{dog.weight} kg</p>
            </div>
            <div>
                <span className={s.label}>Lifespan :</span>
                <p>{dog.lifespan}</p>
            </div>
        </div>
    );
}
