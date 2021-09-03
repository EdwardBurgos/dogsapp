import s from './EditPet.module.css';
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
import { uploadConfirmedDogBreedImage, uploadDogBreedImage } from '../../extras/firebase';
import loadingHorizontal from '../../img/loadingHorizontalGif.gif'

export default function EditPet({ id }) { // si me psan el di seleccionar la raza automáticmanete si no mostrrar seleccionar raza en el <select
    // Redux states
    const user = useSelector(state => state.user);

    // Own states
    const [pet, setPet] = useState({})
    const [name, setName] = useState('')
    const [nameErr, setNameErr] = useState('')
    const [buttonState, setButtonState] = useState(true)
    const [errGlobal, setErrGlobal] = useState('')
    const [mainErr, setMainErr] = useState('')
    const [photo, setPhoto] = useState('https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/folder-open-outline.svg?alt=media&token=e7dacac8-113e-4f25-8339-51c2d49a7181')
    const [errPhoto, setErrPhoto] = useState('')
    const [changedPhoto, setChangedPhoto] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dogs, setDogs] = useState([])
    const [dogId, setDogId] = useState('default')
    const [guardando, setGuardando] = useState(false);
    const [imageFile, setImageFile] = useState(null)

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

    // This hook load the pet data
    useEffect(() => {
        async function findPet(id) {
            try {
                let response = await axios.get(`/pets/${id}`);
                const { name, photo, dog } = response.data
                setPet({ name, photo, dogId: dog.id });
                setName(name);
                setPhoto(photo);
                setDogId(dog.id);
            } catch (e) {
                if (e.response.status === 404 && e.response.data === `There is no pet with the id ${id}`) return setMainErr(e.response.data)
                setMainErr('Sorry, an error ocurred')
            }
        }
        findPet(id);
    }, [id])

    // This hook is to enable or disable the submit button
    useEffect(() => {
        if (uploading || nameErr || !name || !photo || !dogId || (name === pet.name && photo === pet.photo && parseInt(dogId) === pet.dogId)) return setButtonState(true);
        return setButtonState(false);
    }, [uploading, nameErr, name, photo, dogId])

    // This hook is to get the dogs name
    useEffect(() => {
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
    }, [dispatch])

    // Functions

    // This function allows us to handle changes in the form
    function handleChange(e) {
        let value = e.target.value;
        !value ? setNameErr('This field is required') : setNameErr('')
        return setName(value)
    }

    // This function allows us to handle the submit of the form
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setGuardando(true);
            let confirmedImageUrl = pet.photo;
            if (imageFile) {
                confirmedImageUrl = await uploadConfirmedDogBreedImage(name, imageFile)
                if (!validURL(confirmedImageUrl)) {
                    setPhoto(pet.photo);
                    setErrGlobal(`Sorry, we could not save the image you provided for ${pet.name}`);
                    return setChangedPhoto(false);
                }
            }
            const response = await axios.put('/pets', {
                id,
                name,
                photo: confirmedImageUrl,
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
                const urlPhoto = await uploadDogBreedImage(name, e.target.files[0])
                setUploading(false);
                if (validURL(urlPhoto)) {
                    setImageFile(e.target.files[0]);
                    setPhoto(urlPhoto);
                    setChangedPhoto(true);
                } else {
                    setErrPhoto(urlPhoto)
                }
            } else {
                setNameErr('Fill this field')
            }

        }
    }

    return (
        <div className={s.container}>
            {!mainErr ?
                user ?
                    Object.keys(user).length ?
                        <div className={s.content}>
                            <h1 className={s.title}>Edit pet</h1>


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
                                    dogs.length ?
                                        <>
                                            <div className={nameErr ? '' : 'mb-3'}>
                                                <label className={s.label}>Dog breed</label>
                                                <select className={`form-control`} id="temperamentSelector" value={dogId} onChange={e => setDogId(e.target.value)} name="temperament">
                                                    {dogId === 'default' ? <option key='default' value='default'>Select a dog breed</option> : null}
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
                                                <span>Change image</span>
                                                <input id="inputFile" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
                                            </div>
                                            :
                                            <>
                                                <div className={`w-100 btn btn-primary mb-3  ${uploading ? 'disabled' : ''}`} onClick={() => { document.getElementById('inputFileExtra').click() }}>
                                                    <span>Change image</span>
                                                    <input id="inputFileExtra" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
                                                </div>

                                                <button className={`w-100 btn btn-secondary`} disabled={uploading} onClick={async () => { setImageFile(null); setUploading(false); setErrPhoto(''); setChangedPhoto(false); setPhoto(pet.photo); }}>Cancel changes</button>
                                            </>
                                    }
                                </div>



                                {
                                    guardando ?
                                        <div className={`w-100 btn btn-primary disabled`}>
                                            <img src={loadingHorizontal} className={s.loadingHorizontal} alt='Loading'></img>
                                        </div>
                                        :
                                        <input type="submit" value="Save changes" disabled={buttonState} className={`w-100 btn btn-primary`} />
                                }
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



// import s from './EditPet.module.css';
// import React, { useEffect, useState } from 'react';
// import axios from '../../axiosInterceptor';
// import { useDispatch, useSelector } from 'react-redux';
// import { closeCircleOutline } from 'ionicons/icons';
// import { IonIcon } from '@ionic/react';
// import { Link } from 'react-router-dom';
// import loading from '../../img/loadingGif.gif';
// import { getTemperaments, showMessage, validURL, getUserInfo, getDogsNames } from '../../extras/globalFunctions';
// import { setUser } from '../../actions';
// import 'react-toastify/dist/ReactToastify.css';
// import { useHistory } from "react-router-dom";
// import { uploadConfirmedDogBreedImage } from '../../extras/firebase';

// export default function EditPet({ id }) { // si me psan el di seleccionar la raza automáticmanete si no mostrrar seleccionar raza en el <select
//     // Redux states
//     const user = useSelector(state => state.user);

//     // Own states
//     const [name, setName] = useState('')
//     const [nameErr, setnameErr] = useState('')
//     const [buttonState, setButtonState] = useState(true)
//     const [errGlobal, setErrGlobal] = useState('')
//     const [mainErr, setMainErr] = useState('')
//     const [photo, setPhoto] = useState('https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/folder-open-outline.svg?alt=media&token=e7dacac8-113e-4f25-8339-51c2d49a7181')
//     const [errPhoto, setErrPhoto] = useState('')
//     const [changedPhoto, setChangedPhoto] = useState(false)
//     const [uploading, setUploading] = useState(false)
//     const [dogs, setDogs] = useState([])
//     const [dogId, setDogId] = useState('default')

//     // Variables
//     const history = useHistory();
//     const dispatch = useDispatch();

//     // Hooks 

//     // This hook allow us to load the logued user
//     useEffect(() => {
//         const cancelToken = axios.CancelToken;
//         const source = cancelToken.source();
//         async function updateUser() {
//             const user = await getUserInfo(source.token);
//             if (user !== "Unmounted") {
//                 dispatch(setUser(user))
//             }
//         }
//         updateUser();
//         return () => source.cancel("Unmounted");
//     }, [dispatch])

//     // This hook is to enable or disable the submit button
//     useEffect(() => {
//         if (nameErr || !name || photo === 'https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/folder-open-outline.svg?alt=media&token=e7dacac8-113e-4f25-8339-51c2d49a7181' || uploading) return setButtonState(true);
//         return setButtonState(false);
//     }, [nameErr, name, photo, uploading])

//     // This hook is to get the dogs name
//     useEffect(() => {
//         if (!id) {
//             const cancelToken = axios.CancelToken;
//             const source = cancelToken.source();
//             async function requesting() {
//                 const dogs = await getDogsNames(source.token)
//                 if (dogs !== "Unmounted") {
//                     dogs.length ? setDogs(dogs) : setMainErr('Sorry, an error ocurred')
//                 }
//             }
//             requesting();
//             return () => source.cancel("Unmounted");
//         } else {
//             setDogId(id)
//         }
//     }, [dispatch])

//     // Functions

//     // This function allows us to handle changes in the form
//     function handleChange(e) {
//         let value = e.target.value;
//         !value ? setnameErr('This field is required') : setnameErr('')
//         return setName(value)
//     }

//     // This function allows us to handle the submit of the form
//     async function handleSubmit(e) {
//         e.preventDefault();
//         try {
//             setGuardando(true);
//             let confirmedImageUrl = dog.image;
//             if (imageFile) {
//                 confirmedImageUrl = await uploadConfirmedDogBreedImage(name, imageFile)
//                 if (!validURL(confirmedImageUrl)) {
//                     setPhoto(dog.image);
//                     setErrGlobal(`Sorry, we could not save the image you provided for ${name} dog breed`);
//                     return setChangedPhoto(false);
//                 }
//             }
//             const response = await axios.put('/pets', {
//                 id,
//                 name,
//                 photo,
//                 dogId
//             })
//             showMessage(response.data);
//             history.push(`/detail/${dogId}`);
//         } catch (e) {
//             return setErrGlobal(e.response.data);
//         }
//     }

//     // This function allows us to upload the dog breed picture
//     async function changePhoto(e) {
//         if (e.target.files[0]) {
//             if (name) {
//                 setUploading(true)
//                 const urlPhoto = await uploadDogBreedImage(name, e.target.files[0])
//                 setUploading(false);
//                 if (validURL(urlPhoto)) {
//                     setImageFile(e.target.files[0]);
//                     setPhoto(urlPhoto);
//                     setChangedPhoto(true);
//                 } else {
//                     setErrPhoto(urlPhoto)
//                 }
//             } else {
//                 setnameErr('Fill this field')
//             }
//         }
//     }



//     return (
//         <div className={s.container}>
//             {!mainErr ?
//                 user ?
//                     Object.keys(user).length ?
//                         <div className={s.content}>
//                             <h1 className={s.title}>Register your pet</h1>

//                             <div className={s.errorGlobalContainer}>
//                                 {errGlobal ? <p className={s.errorGlobal}>{errGlobal}</p> : null}
//                             </div>

//                             <form onSubmit={handleSubmit} className={s.form}>
//                                 <div className={nameErr ? '' : 'mb-3'}>
//                                     <label className={s.label}>Name</label>
//                                     <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="namePet"></input>
//                                 </div>
//                                 {nameErr ? <small className={s.error}>{nameErr}</small> : null}

//                                 {
//                                     !id && dogs.length ?
//                                         <>
//                                             <div className={nameErr ? '' : 'mb-3'}>
//                                                 <label className={s.label}>Dog breed</label>
//                                                 <select className={`form-control`} id="temperamentSelector" value={dogId} onChange={e => setDogId(e.target.value)} name="temperament">
//                                                     {dogId === 'default' ? <option key='default' value='default'>Select a dog breed</option> : null }
//                                                     {dogs.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
//                                                 </select>
//                                                 {/* <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="namePet"></input> */}
//                                             </div>
//                                             {nameErr ? <small className={s.error}>{nameErr}</small> : null}
//                                         </>
//                                         :
//                                         null
//                                 }
//                                 <div className={s.profilePictureEditor}>
//                                     <label className={s.labelProfile}>Image</label>
//                                     <div className={`${s.containerProfileImage} ${errPhoto ? '' : 'mb-3'}`}>
//                                         {
//                                             uploading ?
//                                                 <div className={s.uploadingContainer}>
//                                                     <img className={s.uploadingGif} src={loading} alt='Dog breed'></img>
//                                                 </div>
//                                                 :
//                                                 <img className={s.profilePic} src={photo} alt='Dog breed'></img>
//                                         }
//                                     </div>
//                                     {errPhoto ? <small className={s.error}>{errPhoto}</small> : null}
//                                     {
//                                         !changedPhoto ?
//                                             <div className={`w-100 btn btn-primary ${uploading || !name ? 'disabled' : ''}`} onClick={() => document.getElementById('inputFile').click()}>
//                                                 <span>Upload an image</span>
//                                                 <input id="inputFile" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
//                                             </div>
//                                             :
//                                             <>
//                                                 <div className={`w-100 btn btn-secondary mb-3 ${uploading ? 'disabled' : ''}`} onClick={() => { document.getElementById('inputFileExtra').click() }}>
//                                                     <span>Upload another image</span>
//                                                     <input id="inputFileExtra" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
//                                                 </div>
//                                             </>
//                                     }
//                                 </div>

//                                 <input type="submit" value="Register pet" disabled={buttonState} className={`w-100 btn btn-primary`} />
//                             </form>
//                         </div>
//                         :
//                         <div className={s.contentCenter}>
//                             <p>To be able to register your pet you need to be logged in.</p>
//                             <Link to="/login" className={s.loginButton}>Log in</Link>
//                         </div>
//                     :
//                     <div className={s.contentCenter}>
//                         <img className={s.loading} src={loading} alt='loadingGif'></img>
//                     </div>
//                 :
//                 <div className={s.contentCenter}>
//                     <div className={s.errorGlobalContainer}>
//                         <p className={s.errorMain}>{mainErr}</p>
//                     </div>
//                 </div>
//             }
//         </div>
//     )
// }