import s from './Edit.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../axiosInterceptor';
import { useDispatch } from 'react-redux';
import { closeCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import loading from '../../img/loadingGif.gif';
import loadingHorizontal from '../../img/loadingHorizontalGif.gif'
import { getTemperaments, showMessage, validURL, getUserInfo } from '../../extras/globalFunctions';
import { setUser } from '../../actions';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { uploadConfirmedDogBreedImage, uploadDogBreedImage } from '../../extras/firebase';

export default function Edit({ id }) {
    // Own states
    const [temperaments, setTemperaments] = useState([])
    const [selectedTemperaments, setSelectedTemperaments] = useState([]);
    const [name, setName] = useState('')
    const [nameErr, setnameErr] = useState('')
    const [maxHeight, setMaxHeight] = useState('')
    const [maxHeightErr, setMaxHeightErr] = useState('')
    const [minHeight, setMinHeight] = useState('')
    const [minHeightErr, setMinHeightErr] = useState('')
    const [maxWeight, setMaxWeight] = useState('')
    const [maxWeightErr, setMaxWeightErr] = useState('')
    const [minWeight, setMinWeight] = useState('')
    const [minWeightErr, setMinWeightErr] = useState('')
    const [maxLifespan, setMaxLifespan] = useState('')
    const [maxLifespanErr, setMaxLifespanErr] = useState('')
    const [minLifespan, setMinLifespan] = useState('')
    const [minLifespanErr, setMinLifespanErr] = useState('')
    const [bredFor, setBreedFor] = useState('')
    const [breedGroup, setBreedGroup] = useState('')
    const [origin, setOrigin] = useState('')
    const [temperamentErr, setTemperamentErr] = useState('')
    const [buttonState, setButtonState] = useState(true)
    const [errGlobal, setErrGlobal] = useState('')
    const [mainErr, setMainErr] = useState('')
    const [photo, setPhoto] = useState('https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/folder-open-outline.svg?alt=media&token=e7dacac8-113e-4f25-8339-51c2d49a7181')
    const [errPhoto, setErrPhoto] = useState('')
    const [changedPhoto, setChangedPhoto] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dog, setDog] = useState({})
    const [imageFile, setImageFile] = useState(null)
    const [guardando, setGuardando] = useState(false)

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

    // This hook load the dog data
    useEffect(() => {
        async function findDog(id) {
            try {
                let response = await axios.get(`http://localhost:3001/dogs/${id}`);
                const { name, image, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin, bred_for, breed_group, origin, temperamentsArray } = response.data
                setDog(response.data);
                setName(name);
                setPhoto(image);
                setMaxHeight(heightmax ? heightmax : '')
                setMinHeight(heightmin ? heightmin : '')
                setMaxWeight(weightmax ? weightmax : '')
                setMinWeight(weightmin ? weightmin : '')
                setMaxLifespan(lifespanmax ? lifespanmax : '')
                setMinLifespan(lifespanmin ? lifespanmin : '')
                setBreedFor(bred_for ? bred_for : '')
                setBreedGroup(breed_group ? breed_group : '')
                setOrigin(origin ? origin : '')
                setSelectedTemperaments(temperamentsArray);
            } catch (e) {
                if (e.response.status === 404 && e.response.data === `There is no dog breed with the id ${id}`) return setMainErr(e.response.data)
                setMainErr('Sorry, an error ocurred')
            }
        }
        findDog(id);
    }, [id])

    // This hook is to get the temperaments when the component mount
    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        async function requesting() {
            const temperaments = await getTemperaments(source.token)
            if (temperaments !== "Unmounted") {
                temperaments.length ? setTemperaments(temperaments) : setMainErr('Sorry, an error ocurred')
            }
        }
        requesting();
        return () => source.cancel("Unmounted");
    }, [dispatch])

    // This hook is to enable or disable the submit button
    useEffect(() => {
        if (nameErr || maxHeightErr || minHeightErr || maxWeightErr || minWeightErr || maxLifespanErr || minLifespanErr || !name || !photo ||
            (name === dog.name && photo === dog.image && JSON.stringify(selectedTemperaments) === JSON.stringify(dog.temperamentsArray) &&
                maxHeight === (dog.heightmax ? dog.heightmax : '') && minHeight === (dog.heightmin ? dog.heightmin : '') &&
                minWeight === (dog.weightmin ? dog.weightmin : '') && maxWeight === (dog.weightmax ? dog.weightmax : '') &&
                minLifespan === (dog.lifespanmin ? dog.lifespanmin : '') && maxLifespan === (dog.lifespanmax ? dog.lifespanmax : '') &&
                bredFor === (dog.bred_for ? dog.bred_for : '') && breedGroup === (dog.breed_group ? dog.breed_group : '') &&
                origin === (dog.origin ? dog.origin : ''))) return setButtonState(true);
        return setButtonState(false);
    }, [nameErr, maxHeightErr, minHeightErr, maxWeightErr, minWeightErr, maxLifespanErr, minLifespanErr, name, photo, bredFor, breedGroup,
        dog, maxHeight, maxLifespan, maxWeight, minHeight, minLifespan, minWeight, origin, selectedTemperaments])

    // Functions

    // This function allows us to select a temperament
    function selectTemperament(temperament) {
        setTemperamentErr('');
        selectedTemperaments.includes(temperament) ? setTemperamentErr('Temperament already selected') : setSelectedTemperaments([...new Set([...selectedTemperaments, temperament])])
    }

    // This function allows us to delete a temperament
    function deleteTemperament(temperament) {
        let newTemperaments = selectedTemperaments.filter(e => e === temperament ? false : true);
        setSelectedTemperaments(newTemperaments)
    }

    // This function allows us to handle changes in the form
    function handleChange(e) {
        let value = e.target.value;
        switch (e.target.name) {
            case 'nameBreed':
                !value ? setnameErr('This field is required') : setnameErr('')
                return setName(value)
            case 'maxHeight':
                if (!value) {
                    setMaxHeightErr('');
                    setMinHeightErr('');
                } else {
                    value = value.replace(/[^0-9]/g, '');
                    if (parseInt(value) > parseInt(minHeight)) {
                        setMaxHeightErr('');
                        setMinHeightErr('');
                    } else {
                        if (minHeight) {
                            setMaxHeightErr('The maximum height must be greater than minimum height')
                        } else {
                            setMaxHeightErr('');
                        }
                    }

                }
                return setMaxHeight(value)
            case 'minHeight':
                if (!value) {
                    setMinHeightErr('');
                    setMaxHeightErr('');
                } else {
                    value = value.replace(/[^0-9]/g, '');
                    if (parseInt(value) < parseInt(maxHeight)) {
                        setMinHeightErr('');
                        setMaxHeightErr('');
                    } else {
                        if (maxHeight) {
                            setMinHeightErr('The minimum height must be less than maximum height')
                        } else {
                            setMinHeightErr('');
                        }
                    }
                }
                return setMinHeight(value)
            case 'maxWeight':
                if (!value) {
                    setMaxWeightErr('');
                    setMinWeightErr('');
                } else {
                    value = value.replace(/[^0-9]/g, '');
                    if (parseInt(value) > parseInt(minWeight)) {
                        setMaxWeightErr('');
                        setMinWeightErr('');
                    } else {
                        if (minWeight) {
                            setMaxWeightErr('The maximum weight must be greater than minimum weight')
                        } else {
                            setMaxWeightErr('');
                        }
                    }
                }
                return setMaxWeight(value)
            case 'minWeight':
                if (!value) {
                    setMinWeightErr('');
                    setMaxWeightErr('');
                } else {
                    value = value.replace(/[^0-9]/g, '');
                    if (parseInt(value) < parseInt(maxWeight)) {
                        setMinWeightErr('');
                        setMaxWeightErr('');
                    } else {
                        if (maxWeight) {
                            setMinWeightErr('The minimum weight must be less than maximum weight')
                        } else {
                            setMinWeightErr('');
                        }
                    }
                }
                return setMinWeight(value)
            case 'maxLifespan':
                if (!value) {
                    setMaxLifespanErr('');
                    setMinLifespanErr('');
                } else {
                    value = value.replace(/[^0-9]/g, '');
                    if (parseInt(value) > parseInt(minLifespan)) {
                        setMaxLifespanErr('');
                        setMinLifespanErr('');
                    } else {
                        if (minLifespan) {
                            setMaxLifespanErr('The maximum lifespan must be greater than minimum lifespan')
                        } else {
                            setMaxLifespanErr('');
                        }
                    }
                }
                return setMaxLifespan(value)
            case 'minLifespan':
                if (!value) {
                    setMinLifespanErr('');
                    setMaxLifespanErr('');
                } else {
                    value = value.replace(/[^0-9]/g, '');
                    if (parseInt(value) < parseInt(maxLifespan)) {
                        setMinLifespanErr('');
                        setMaxLifespanErr('');
                    } else {
                        if (maxLifespan) {
                            setMinLifespanErr('The minimum lifespan must be less than maximum lifespan')
                        } else {
                            setMinLifespanErr('');
                        }
                    }
                }
                return setMinLifespan(value);
            default:
                break;
        }
    }

    // This function allows us to handle the submit of the form
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setGuardando(true);
            let confirmedImageUrl = dog.image;
            if (imageFile) {
                confirmedImageUrl = await uploadConfirmedDogBreedImage(name, imageFile)
                if (!validURL(confirmedImageUrl)) {
                    setPhoto(dog.image);
                    setErrGlobal(`Sorry, we could not save the image you provided for ${name} dog breed`);
                    return setChangedPhoto(false);
                }
            }
            const response = await axios.put('/dogs', {
                id: dog.id,
                name: name,
                image: confirmedImageUrl,
                heightmax: maxHeight ? maxHeight : null,
                heightmin: minHeight ? minHeight : null,
                weightmax: maxWeight ? maxWeight : null,
                weightmin: minWeight ? minWeight : null,
                lifespanmax: maxLifespan ? maxLifespan : null,
                lifespanmin: minLifespan ? minLifespan : null,
                temperaments: selectedTemperaments,
                bred_for: bredFor ? bredFor : null,
                breed_group: breedGroup ? breedGroup : null,
                origin: origin ? origin : null
            })
            showMessage(response.data.message);
            history.push(`/detail/${response.data.id}`);
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
                setnameErr('Fill this field')
            }
        }
    }

    return (
        <div className={s.container}>
            {!mainErr ?
                temperaments.length ?
                    <div className={s.content}>
                        <h1 className={s.title}>Edit the {dog.name} dog breed</h1>

                        <div className={s.errorGlobalContainer}>
                            {errGlobal ? <p className={s.errorGlobal}>{errGlobal}</p> : null}
                        </div>

                        <form onSubmit={handleSubmit} className={s.form}>
                            <div className={nameErr ? '' : 'mb-3'}>
                                <label className={s.label}>Name</label>
                                <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="nameBreed"></input>
                            </div>
                            {nameErr ? <small className={s.error}>{nameErr}</small> : null}

                            <div className={s.profilePictureEditor}>
                                <label className={s.labelProfile} htmlFor="nameValue">Image</label>
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

                                            <button className={`w-100 btn btn-secondary`} disabled={uploading} onClick={async () => { setImageFile(null); setUploading(false); setErrPhoto(''); setChangedPhoto(false); setPhoto(dog.image); }}>Cancel changes</button>
                                        </>
                                }
                            </div>

                            <div className={maxHeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Maximum height</label>
                                <input value={maxHeight} placeholder="Insert maximum height in centimeters" className={maxHeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="maxHeight"></input>
                            </div>
                            {maxHeightErr ? <small className={s.error}>{maxHeightErr}</small> : null}

                            <div className={minHeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Minimum height</label>
                                <input value={minHeight} placeholder="Insert minimum height in centimeters" className={minHeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="minHeight"></input>
                            </div>
                            {minHeightErr ? <small className={s.error}>{minHeightErr}</small> : null}


                            <div className={maxWeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Maximum weight</label>
                                <input value={maxWeight} placeholder="Insert maximum weight in kilograms" className={maxWeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="maxWeight"></input>
                            </div>
                            {maxWeightErr ? <small className={s.error}>{maxWeightErr}</small> : null}

                            <div className={minWeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Minimum weight</label>
                                <input value={minWeight} placeholder="Insert minimun weight in kilograms" className={minWeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="minWeight"></input>
                            </div>
                            {minWeightErr ? <small className={s.error}>{minWeightErr}</small> : null}


                            <div className={maxLifespanErr ? '' : 'mb-3'}>
                                <label className={s.label}>Maximum lifespan</label>
                                <input value={maxLifespan} placeholder="Insert maximum lifespan" className={maxLifespanErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="maxLifespan"></input>
                            </div>
                            {maxLifespanErr ? <small className={s.error}>{maxLifespanErr}</small> : null}

                            <div className={minLifespanErr ? '' : 'mb-3'}>
                                <label className={s.label}>Minimum lifespan</label>
                                <input value={minLifespan} placeholder="Insert minimum lifespan" className={minLifespanErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="minLifespan"></input>
                            </div>
                            {minLifespanErr ? <small className={s.error}>{minLifespanErr}</small> : null}

                            <div className={'mb-3'}>
                                <label className={s.label}>Bred for reason</label>
                                <input value={bredFor} placeholder="Insert the reason why it is bred" className={s.formInput} type="text" onChange={e => setBreedFor(e.target.value)} name="bredFor"></input>
                            </div>

                            <div className={'mb-3'}>
                                <label className={s.label}>Breed group</label>
                                <input value={breedGroup} placeholder="Insert breed group" className={s.formInput} type="text" onChange={e => setBreedGroup(e.target.value)} name="bredGroup"></input>
                            </div>

                            <div className={'mb-3'}>
                                <label className={s.label}>Origin</label>
                                <input value={origin} placeholder="Insert origin" className={s.formInput} type="text" onChange={e => setOrigin(e.target.value)} name="origin"></input>
                            </div>

                            <div className={temperamentErr ? '' : 'mb-3'}>
                                <label className={s.label}>Temperaments</label>
                                <select className={temperamentErr ? s.errorSelect : s.selectInput} id="temperamentSelector" value='default' onChange={e => selectTemperament(e.target.value)} name="temperament">
                                    <option key='default' value='default' disabled>Select a temperament</option>
                                    {temperaments.map((e, i) => <option key={i} value={e}>{e}</option>)}
                                </select>
                            </div>
                            {temperamentErr ? <small className={s.error}>{temperamentErr}</small> : null}

                            {selectedTemperaments.length ?
                                <div className={`${s.temperamentsContainer} ${temperamentErr ? '' : 'mt-3'}`}>
                                    {selectedTemperaments.map((e, i) =>
                                        <div key={i} className={s.test}>
                                            <button type="button" onClick={() => deleteTemperament(e)} value={e} className={s.temperament}>
                                                {e}
                                                <IonIcon icon={closeCircleOutline} className={s.iconDelete}></IonIcon>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                : null}

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