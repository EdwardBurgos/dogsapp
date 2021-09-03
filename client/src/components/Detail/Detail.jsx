import s from './Detail.module.css';
import React, { useEffect, useState } from 'react';
import loading from '../../img/loadingGif.gif';
import axios from '../../axiosInterceptor';
import { getUserInfo, showMessage } from '../../extras/globalFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setCurrentDog } from '../../actions';
import { useHistory } from 'react-router';
import Post from '../Post/Post';

export default function Detail({ id }) {
    // Redux states
    const user = useSelector(state => state.user);
    const dog = useSelector(state => state.dog);

    // Own states
    const [errGlobal, setErrGlobal] = useState('');

    // Variables
    const dispatch = useDispatch();
    const history = useHistory();

    // Hooks

    // This hook load the dog data
    useEffect(() => {
        async function findDog(id) {
            try {
                let response = await axios.get(`http://localhost:3001/dogs/${id}`);
                dispatch(setCurrentDog(response.data));
            } catch (e) {
                if (e.response.status === 404 && e.response.data === `There is no dog breed with the id ${id}`) return setErrGlobal(e.response.data)
                setErrGlobal('Sorry, an error ocurred')
            }
        }
        findDog(id);
    }, [id])

    // This hook allow us to load the logued user
    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        async function updateUser() {
            const user = await getUserInfo(source.token);
            if (user !== "Unmounted") {
                dispatch(setUser(user))
            }
        }
        updateUser();
        return () => {
            source.cancel("Unmounted");
            dispatch(setCurrentDog({}));
        }
    }, [dispatch])

    return (
        <div className={s.container}>
            {!errGlobal ?
                Object.keys(dog).length ?
                    <div className={s.columns}>
                        <div className={dog.pets.length ? s.cardDetail : s.onlyColumn}>
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
                            {
                                dog.height ?
                                    <div>
                                        <span className={s.label}>Height :</span>
                                        <p>{dog.height}</p>
                                    </div>
                                    :
                                    null
                            }
                            {
                                dog.weight ?
                                    <div>
                                        <span className={s.label}>Weight :</span>
                                        <p>{dog.weight}</p>
                                    </div>
                                    :
                                    null
                            }
                            {
                                dog.lifespan ?
                                    <div>
                                        <span className={s.label}>Lifespan :</span>
                                        <p>{dog.lifespan}</p>
                                    </div>
                                    :
                                    null
                            }
                            {
                                dog.bred_for ?
                                    <div>
                                        <span className={s.label}>Bred for reason :</span>
                                        <p>{dog.bred_for}</p>
                                    </div>
                                    :
                                    null
                            }
                            {
                                dog.breed_group ?
                                    <div>
                                        <span className={s.label}>Breed group :</span>
                                        <p>{dog.breed_group}</p>
                                    </div>
                                    :
                                    null
                            }
                            {
                                dog.origin ?
                                    <div>
                                        <span className={s.label}>Origin :</span>
                                        <p>{dog.origin}</p>
                                    </div>
                                    :
                                    null
                            }
                            <div className={s.query}>
                                <span>Is your pet of this breed?</span>
                                <button className="w-100 btn btn-primary mt-2" onClick={() => history.push(`/registerPet/breed/${id}`)}>Register it here</button>
                            </div>
                        </div>
                        {
                            dog.pets.length ?
                                <div className={s.specimens}>
                                    <h2 className={s.petsTitle}>Pets</h2>
                                    <div className={s.postsContainer}>
                                        {
                                            dog.pets.map((e, i) => <Post key={i} id={e.id} name={e.name} img={e.photo} likesCount={e.likesCount} owner={e.user} likes={e.likes}></Post>)
                                        }
                                    </div>
                                </div>
                                :
                                null
                        }
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
