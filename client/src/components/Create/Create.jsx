import s from './Create.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../axiosInterceptor';
import { useDispatch, useSelector } from 'react-redux';
import { closeCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';
import loading from '../../img/loadingGif.gif';
import { getTemperaments, showMessage } from '../../extras/globalFunctions';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";

export default function Create() {
    // Redux states
    const user = useSelector(state => state.user);

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

    // Variables
    const history = useHistory();
    const dispatch = useDispatch();

    // Hooks 

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
        if (nameErr || maxHeightErr || minHeightErr || maxWeightErr || minWeightErr || maxLifespanErr || minLifespanErr || !name) return setButtonState(true);
        return setButtonState(false);
    }, [nameErr, maxHeightErr, minHeightErr, maxWeightErr, minWeightErr, maxLifespanErr, minLifespanErr, name])

    // Functions

    function selectTemperament(temperament) {
        setTemperamentErr('');
        selectedTemperaments.includes(temperament) ? setTemperamentErr('Temperament already selected') : setSelectedTemperaments([...new Set([...selectedTemperaments, temperament])])
    }

    function deleteTemperament(temperament) {
        let newTemperaments = selectedTemperaments.filter(e => e === temperament ? false : true);
        setSelectedTemperaments(newTemperaments)
    }

    function handleChange(e) {
        let value = e.target.value;
        switch (e.target.name) {
            case 'nameBreed':
                !value ? setnameErr('This field is required') : setnameErr('')
                return setName(value)
            case 'maxHeight':
                if (!value) {
                    setMaxHeightErr(''); // setMaxHeightErr('This field is required');
                    if (minHeightErr === 'The minimum height must be less than maximum height') setMinHeightErr('');
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
                    setMinHeightErr(''); // setMinHeightErr('This field is required');
                    if (maxHeightErr === 'The maximum height must be greater than minimum height') setMaxHeightErr('');
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
                    setMaxWeightErr(''); // setMaxWeightErr('This field is required');
                    if (minWeightErr === 'The minimum weight must be less than maximum weight') setMinWeightErr('');
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
                    setMinWeightErr(''); // setMinWeightErr('This field is required');
                    if (maxWeightErr === 'The maximum weight must be greater than minimum weight') setMaxWeightErr('');
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
                    setMaxLifespanErr(''); // setMaxLifespanErr('This field is required');
                    if (minLifespanErr === 'The minimum lifespan must be less than maximum lifespan') setMinLifespanErr('');
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
                    setMinLifespanErr(''); // setMinLifespanErr('This field is required');
                    if (maxLifespanErr === 'The maximum lifespan must be greater than minimum lifespan') setMaxLifespanErr('');
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
            case 'bredFor':
                return setBreedFor(value);
            case 'bredGroup':
                return setBreedGroup(value);
            case 'origin':
                return setOrigin(value);
            default:
                break;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/dog', {
                name: name,
                heightmax: maxHeight,
                heightmin: minHeight,
                weightmax: maxWeight,
                weightmin: minWeight,
                lifespanmax: maxLifespan,
                lifespanmin: minLifespan,
                temperaments: selectedTemperaments
            })
            showMessage(response.data.message);
            history.push(`/detail/${response.data.id}`);
        } catch (e) {
            return setErrGlobal(e.response.data);
        }
    }

    return (
        <div className={s.container}>
            {!mainErr ?
                user && temperaments.length ?
                    Object.keys(user).length ?
                        <div className={s.content}>
                            <h1 className={s.title}>Register a breed</h1>
                            <div className={s.errorGlobalContainer}>
                                {errGlobal ? <p className={s.errorGlobal}>{errGlobal}</p> : null}
                            </div>
                            <form onSubmit={handleSubmit} className={s.form}>
                                <div className={nameErr ? '' : 'mb-3'}>
                                    <label className={s.label}>Name</label>
                                    <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="nameBreed"></input>
                                </div>
                                {nameErr ? <small className={s.error}>{nameErr}</small> : null}


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

                                {/* CARGA DE IMAGEN */}

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

                                <input type="submit" value="Register breed" disabled={buttonState} className={`w-100 btn btn-primary ${s.submit}`} />
                            </form>
                        </div>
                        :
                        <div className={s.contentCenter}>
                            <p>To be able to register a breed you need to be logged in.</p>
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