import s from './Pet.module.css';
import React, { useEffect, useState } from 'react';
import loading from '../../img/loadingGif.gif';
import axios from '../../axiosInterceptor';
import { getUserInfo, showMessage } from '../../extras/globalFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setCurrentDog } from '../../actions';
import { heartOutline, heart } from 'ionicons/icons';
import { Modal, Button } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { Link, useHistory, useLocation } from 'react-router-dom';



export default function Pet({ id }) {
    // Redux states
    const user = useSelector(state => state.user);

    // Own states
    const [errGlobal, setErrGlobal] = useState('');
    const [pet, setPet] = useState('');
    const [unauthorized, setUnauthorized] = useState(false);
    const [changed, setChanged] = useState(false);
    const [showDelete, setShowDelete] = useState(false)

    // Variables
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    // Hooks

    // This hook load the dog data
    useEffect(() => {
        async function findPet(id) {
            try {
                let response = await axios.get(`/pets/${id}`);
                setPet(response.data)
                setChanged(false)
            } catch (e) {
                if (e.response.status === 404 && e.response.data === `There is no pet with the id ${id}`) return setErrGlobal(e.response.data)
                setErrGlobal('Sorry, an error ocurred')
            }
        }
        findPet(id);
    }, [id, changed])

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

    // Function

    // This function allows us to give like
    async function likeORdislike() {
        try {
            await axios.post(`/likes/${id}`)
            setChanged(true); 
            const user = await getUserInfo();
            dispatch(setUser(user));
        } catch (e) {
            showMessage(e.response.data)
        }
    }

    // This funtion allows us to delete a pet
    async function deletePet() {
        try {
            const deletedPet = await axios.delete(`/pets/${id}`);
            history.push('/home')
            showMessage(deletedPet.data);
        } catch (e) {
            showMessage(e.response.data)
        }

    }


    return (
        <>
            <div className={s.container}>
                {!errGlobal ?
                    Object.keys(pet).length ?
                        <div className={s.columns}>
                            <div className={s.firstColumn}>
                                <h1 className='mb-3'>{pet.name}</h1>
                                <img src={pet.photo} className={s.image} alt={pet.name}></img>
                                <div className={s.optionsContainer}>
                                    <div className={s.likeIconContainer}>
                                        <IonIcon id='likeIcon' icon={Object.keys(user).length && user.likes.includes(parseInt(id)) ? heart : heartOutline} className={Object.keys(user).length && user.likes.includes(parseInt(id)) ? s.withLikes : s.withoutLikes} onClick={e => { Object.keys(user).length ? likeORdislike() : setUnauthorized(true); }}></IonIcon>
                                    </div>
                                    {
                                        Object.keys(user).length && user.pets.includes(parseInt(id)) ?
                                            <div className={s.optionsButtons}>
                                                <Link to={`/editPet/${id}`} className={`btn btn-primary ${s.editButton}`}> Edit {pet.name}</Link>
                                                <button className={`btn btn-danger ${s.deleteButton}`} onClick={() => setShowDelete(true)}> Delete {pet.name}</button>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            <div className={s.secondColumn}>
                                <div className={s.breedSection}>
                                    <h2 className='mb-3'>Dog Breed</h2>
                                    <p className={s.breedName}>{pet.dog.name}</p>
                                    <img src={pet.dog.image} alt={pet.dog.name} className={s.dogBreedImage}></img>
                                </div>
                                {
                                    pet.likes.length ?
                                        <div className={s.likesSection}>
                                            <h2 className='mb-3'>Likes</h2>
                                            <div className={s.likesDetail}>
                                                {
                                                    Object.keys(user).length ?
                                                        pet.likes.map((e, i) =>
                                                            <Link className={`${i === 0 ? s.userInfoContainer : s.userInfoContainerModal} linkRR`} to={`/${e.username}`} key={i}>
                                                                <img className={s.profilePic} src={e.profilepic} alt='User profile'></img>
                                                                <span>{e.fullname}</span>
                                                            </Link>
                                                        )
                                                        :
                                                        <div>
                                                            <p>You need to be login to see the likes given to this pet</p>
                                                            <Link to='/login' className='btn btn-primary w-100'>Log in</Link>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                        :
                                        null
                                }
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

            <Modal
                show={unauthorized}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}
                onHide={() => setUnauthorized(false)}
            >
                <Modal.Header>
                    <Modal.Title>Sorry, you need to be logged in to like a pet</Modal.Title>
                </Modal.Header>
                <Modal.Body className={s.centeredInfoModal}>
                    <Link to='/login' className='btn btn-primary w-100'>Log in</Link>
                </Modal.Body>
            </Modal>

            <Modal
                show={showDelete}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setShowDelete(false)}
            >
                <Modal.Header>
                    <Modal.Title>Delete {pet.name}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {pet.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowDelete(false); }}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => { deletePet(); setShowDelete(false); }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}
