import s from './Detail.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loading from '../../img/loadingGif.gif';


export default function Detail({ id }) {
    // Own states
    const [dog, setDog] = useState({});
    const [errGlobal, setErrGlobal] = useState('')

    // Hooks

    // This hook load the dog data
    useEffect(() => {
        async function findDog(id) {
            try {
                let response = await axios.get(`http://localhost:3001/dogs/${id}`);
                setDog(response.data);
            } catch (e) {
                if (e.response.status === 404 && e.response.data === `There is no dog breed with the id ${id}`) return setErrGlobal(e.response.data)
                setErrGlobal('Sorry, an error ocurred')
            }
        }
        findDog(id);
    }, [id])

    return (
        <div className={s.container}>
            {!errGlobal ?
                Object.keys(dog).length ?
                        <div className={s.cardDetail}>
                            <h1 className={s.title}>{dog.name}</h1>
                            <img src={dog.image} className={s.image} alt={dog.name}></img>
                            {dog.temperament ?
                                <>
                                    <span className={s.label}>Temperament :</span>
                                    <div className={s.temperamentsContainer}>
                                        {dog.temperament.split(', ').map((e, i) =>
                                            <div key={i} className={s.test}>
                                                <div className={s.temperament}>{e}</div>
                                            </div>
                                        )}
                                    </div>
                                </>
                                :
                                null
                            }
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
                    :
                    <div className={s.contentCenter}>
                        <img className={s.loading} src={loading} alt='loadingGif'></img>
                    </div>
                :
                <div className={s.contentCenter}>
                    {errGlobal ? <p className={s.errorGlobal}>{errGlobal}</p> : null}
                </div>
            }
        </div>

    );
}
