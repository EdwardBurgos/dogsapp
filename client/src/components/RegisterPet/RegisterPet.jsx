import s from './RegisterPet.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../axiosInterceptor';
import { useDispatch, useSelector } from 'react-redux';
import { closeCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';
import loading from '../../img/loadingGif.gif';
import { getTemperaments, showMessage, validURL, getUserInfo, getDogsNames } from '../../extras/globalFunctions';
import { setUser } from '../../actions';
import 'react-toastify/dist/ReactToastify.css';
import { uploadConfirmedDogBreedImage } from '../../extras/firebase';

export default function RegisterPet({ id }) { // si me psan el di seleccionar la raza automáticmanete si no mostrrar seleccionar raza en el <select
    // Redux states
    const user = useSelector(state => state.user);

    // Own states
    const [name, setName] = useState('')
    const [nameErr, setnameErr] = useState('')
    const [buttonState, setButtonState] = useState(true)
    const [errGlobal, setErrGlobal] = useState('')
    const [mainErr, setMainErr] = useState('')
    const [photo, setPhoto] = useState('https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/folder-open-outline.svg?alt=media&token=e7dacac8-113e-4f25-8339-51c2d49a7181')
    const [errPhoto, setErrPhoto] = useState('')
    const [changedPhoto, setChangedPhoto] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dogs, setDogs] = useState([])
    const [dogId, setDogId] = useState('default')

    // Variables
    const history = useHistory();
    const dispatch = useDispatch();

    // Hooks 

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
        return () => source.cancel("Unmounted");
    }, [dispatch])

    // This hook is to enable or disable the submit button
    useEffect(() => {
        if (nameErr || !name || photo === 'https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/folder-open-outline.svg?alt=media&token=e7dacac8-113e-4f25-8339-51c2d49a7181' || uploading) return setButtonState(true);
        return setButtonState(false);
    }, [nameErr, name, photo, uploading])

    // This hook is to get the dogs name
    useEffect(() => {
        if (!id) {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            async function requesting() {
                const dogs = await getDogsNames(source.token)
                if (dogs !== "Unmounted") {
                    dogs.length ? setDogs(dogs) : setMainErr('Sorry, an error ocurred')
                }
            }
            requesting();
            return () => source.cancel("Unmounted");
        } else {
            setDogId(id)
        }
    }, [dispatch])

    // Functions

    // This function allows us to handle changes in the form
    function handleChange(e) {
        let value = e.target.value;
        !value ? setnameErr('This field is required') : setnameErr('')
        return setName(value)
    }

    // This function allows us to handle the submit of the form
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('/pets', {
                name,
                photo,
                dogId
            })
            showMessage(response.data);
            history.push(`/detail/${dogId}`);
        } catch (e) {
            return setErrGlobal(e.response.data);
        }
    }

    // This function allows us to upload the dog breed picture
    async function changePhoto(e) {
        if (e.target.files[0]) {
            if (name) {
                setUploading(true)
                const urlPhoto = await uploadConfirmedDogBreedImage(name, e.target.files[0])
                setUploading(false);
                if (validURL(urlPhoto)) {
                    setPhoto(urlPhoto);
                    setChangedPhoto(true);
                } else {
                    setErrPhoto(urlPhoto)
                }
            } else {
                setnameErr('Fill this field')
            }

        }
    }

    return (
        <div className={s.container}>
            {!mainErr ?
                user ?
                    Object.keys(user).length ?
                        <div className={s.content}>
                            <h1 className={s.title}>Register your pet</h1>

                            <div className={s.errorGlobalContainer}>
                                {errGlobal ? <p className={s.errorGlobal}>{errGlobal}</p> : null}
                            </div>

                            <form onSubmit={handleSubmit} className={s.form}>
                                <div className={nameErr ? '' : 'mb-3'}>
                                    <label className={s.label}>Name</label>
                                    <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="namePet"></input>
                                </div>
                                {nameErr ? <small className={s.error}>{nameErr}</small> : null}

                                {
                                    !id && dogs.length ?
                                        <>
                                            <div className={nameErr ? '' : 'mb-3'}>
                                                <label className={s.label}>Dog breed</label>
                                                <select className={`form-control`} id="temperamentSelector" value={dogId} onChange={e => setDogId(e.target.value)} name="temperament">
                                                    {dogId === 'default' ? <option key='default' value='default'>Select a dog breed</option> : null }
                                                    {dogs.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                                </select>
                                                {/* <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="namePet"></input> */}
                                            </div>
                                            {nameErr ? <small className={s.error}>{nameErr}</small> : null}
                                        </>
                                        :
                                        null
                                }
                                <div className={s.profilePictureEditor}>
                                    <label className={s.labelProfile}>Image</label>
                                    <div className={`${s.containerProfileImage} ${errPhoto ? '' : 'mb-3'}`}>
                                        {
                                            uploading ?
                                                <div className={s.uploadingContainer}>
                                                    <img className={s.uploadingGif} src={loading} alt='Dog breed'></img>
                                                </div>
                                                :
                                                <img className={s.profilePic} src={photo} alt='Dog breed'></img>
                                        }
                                    </div>
                                    {errPhoto ? <small className={s.error}>{errPhoto}</small> : null}
                                    {
                                        !changedPhoto ?
                                            <div className={`w-100 btn btn-primary ${uploading || !name ? 'disabled' : ''}`} onClick={() => document.getElementById('inputFile').click()}>
                                                <span>Upload an image</span>
                                                <input id="inputFile" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
                                            </div>
                                            :
                                            <>
                                                <div className={`w-100 btn btn-secondary mb-3 ${uploading ? 'disabled' : ''}`} onClick={() => { document.getElementById('inputFileExtra').click() }}>
                                                    <span>Upload another image</span>
                                                    <input id="inputFileExtra" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
                                                </div>
                                            </>
                                    }
                                </div>

                                <input type="submit" value="Register pet" disabled={buttonState} className={`w-100 btn btn-primary`} />
                            </form>
                        </div>
                        :
                        <div className={s.contentCenter}>
                            <p>To be able to register your pet you need to be logged in.</p>
                            <Link to="/login" className={s.loginButton}>Log in</Link>
                        </div>
                    :
                    <div className={s.contentCenter}>
                        <img className={s.loading} src={loading} alt='loadingGif'></img>
                    </div>
                :
                <div className={s.contentCenter}>
                    <div className={s.errorGlobalContainer}>
                        <p className={s.errorMain}>{mainErr}</p>
                    </div>
                </div>
            }
        </div>
    )
}

