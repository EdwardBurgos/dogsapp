import s from './Pet.module.css';
import React, { useEffect, useState } from 'react';
import loading from '../../img/loadingGif.gif';
import axios from '../../axiosInterceptor';
import { getUserInfo, showMessage } from '../../extras/globalFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setCurrentDog } from '../../actions';
import { useHistory } from 'react-router';
import Post from '../Post/Post';

export default function Pet({ id }) {
    // Own states
    const [errGlobal, setErrGlobal] = useState('');
    const [pet, setPet] = useState('');

    // Variables
    const dispatch = useDispatch();
    const history = useHistory();

    // Hooks

    // This hook load the dog data
    useEffect(() => {
        async function findPet(id) {
            try {
                let response = await axios.get(`/pets/${id}`);
                setPet(response.data)
            } catch (e) {
                if (e.response.status === 404 && e.response.data === `There is no pet with the id ${id}`) return setErrGlobal(e.response.data)
                setErrGlobal('Sorry, an error ocurred')
            }
        }
        findPet(id);
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
        return () => source.cancel("Unmounted")
    }, [dispatch])

    return (
        <div className={s.container}>
            {!errGlobal ?
                Object.keys(pet).length ?
                    <div className={s.columns}>
                        <div className={s.onlyColumn}>
                            <h1 className={s.title}>{pet.name}</h1>
                            <img src={pet.photo} className={s.image} alt={pet.name}></img>
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
