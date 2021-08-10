import s from './Create.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as actionsCreators from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from 'ionicons/icons';
import { closeCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';
import loading from '../../img/loadingGif.gif';
import { getTemperaments } from '../../extras/globalFunctions';

export default function Create() {
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
    const [temperamentErr, setTemperamentErr] = useState('')
    const [actualTemperament, setActualTemperament] = useState('default')
    const [buttonState, setButtonState] = useState(true)

    // Redux states
    const login = useSelector(state => state.login);

    // Variables
    const dispatch = useDispatch()

    // This hook is to get the temperaments when the component mount
    useEffect(() => {
        async function loadTemperaments() {
            setTemperaments(await getTemperaments())
        }
        loadTemperaments();
    }, [])





    function selectTemperament(temperament) {
        setTemperamentErr('');
        // if (selectedTemperaments.includes(temperament)) return setTemperamentErr('Temperament already selected')
        setSelectedTemperaments([...new Set([...selectedTemperaments, temperament])])
    }

    function deleteTemperament(temperament) {
        setSelectedTemperaments(selectedTemperaments.filter(e => e === temperament ? false : true))
    }

    function handleChange(e) {
        const value = e.target.value;
        switch (e.target.name) {
            case 'name':
                !value ? setnameErr('This field is required') : setnameErr('')
                return setName(value)
            case 'maxHeight':
                if (!value) {
                    setMaxHeightErr('This field is required');
                    if (minHeightErr === 'The minimum height must be less than maximum height') setMinHeightErr('');
                } else {
                    if (/^\d+$/.test(value)) {
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
                    } else {
                        setMaxHeightErr('The maximum height must be an integer')
                    }
                }
                return setMaxHeight(value)
            case 'minHeight':
                if (!value) {
                    setMinHeightErr('This field is required');
                    if (maxHeightErr === 'The maximum height must be greater than minimum height') setMaxHeightErr('');
                } else {
                    if (/^\d+$/.test(value)) {
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
                    } else {
                        setMinHeightErr('The minimum height must be an integer')
                    }
                }
                return setMinHeight(value)
            case 'maxWeight':
                if (!value) {
                    setMaxWeightErr('This field is required');
                    if (minWeightErr === 'The minimum weight must be less than maximum weight') setMinWeightErr('');
                } else {
                    if (/^\d+$/.test(value)) {
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
                    } else {
                        setMaxWeightErr('The maximum weight must be an integer')
                    }
                }
                return setMaxWeight(value)
            case 'minWeight':
                if (!value) {
                    setMinWeightErr('This field is required');
                    if (maxWeightErr === 'The maximum weight must be greater than minimum weight') setMaxWeightErr('');
                } else {
                    if (/^\d+$/.test(value)) {
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
                    } else {
                        setMinWeightErr('The minimum weight must be an integer')
                    }
                }
                return setMinWeight(value)
            case 'maxLifespan':
                if (!value) {
                    setMaxLifespanErr('This field is required');
                    if (minLifespanErr === 'The minimum lifespan must be less than maximum lifespan') setMinLifespanErr('');
                } else {
                    if (/^\d+$/.test(value)) {
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
                    } else {
                        setMaxLifespanErr('The maximum lifespan must be an integer')
                    }
                }
                return setMaxLifespan(value)
            case 'minLifespan':
                if (!value) {
                    setMinLifespanErr('This field is required');
                    if (maxLifespanErr === 'The maximum lifespan must be greater than minimum lifespan') setMaxLifespanErr('');
                } else {
                    if (/^\d+$/.test(value)) {
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
                    } else {
                        setMinLifespanErr('The minimum lifespan must be an integer')
                    }
                }
                return setMinLifespan(value);
            case 'temperament':
                return selectTemperament(value);
            default:
                break;
        }
    }

    async function submitForm(name, maxHeight, minHeight, maxWeight, minWeight, maxLifespan, minLifespan, selectedTemperaments) {
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
            dispatch(actionsCreators.saveCreationMessage(response.data));

        } catch (e) {
            console.log(e)
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        submitForm(name, maxHeight, minHeight, maxWeight, minWeight, maxLifespan, minLifespan, selectedTemperaments);
    }




    useEffect(() => {
        if (!nameErr && !maxHeightErr && !minHeightErr && !maxWeightErr && !minWeightErr && !maxLifespanErr && !minLifespanErr && !temperamentErr) {
            setButtonState(false);
        }
        if (nameErr || maxHeightErr || minHeightErr || maxWeightErr || minWeightErr || maxLifespanErr || minLifespanErr || temperamentErr) {
            setButtonState(true);
        }
    }, [nameErr, maxHeightErr, minHeightErr, maxWeightErr, minWeightErr, maxLifespanErr, minLifespanErr, temperamentErr])

    return (
        <>
            {login ?
                temperaments.length ?
                    <div className={s.container}>
                        <h1 className={s.title}>Register a new breed</h1>
                        <form onSubmit={handleSubmit} className={s.form}>
                            <div className={nameErr ? '' : 'mb-3'}>
                                <label className={s.label}>Name</label><br />
                                <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="name"></input><br />
                            </div>
                            {nameErr ? <small className={s.error}>{nameErr}</small> : null}


                            <div className={maxHeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Max Height</label><br />
                                <input value={maxHeight} placeholder="Insert max height" className={maxHeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="maxHeight"></input><br />
                            </div>
                            {maxHeightErr ? <small className={s.error}>{maxHeightErr}</small> : null}

                            <div className={minHeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Min Height</label><br />
                                <input value={minHeight} placeholder="Insert min height" className={minHeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="minHeight"></input><br />
                            </div>
                            {minHeightErr ? <small className={s.error}>{minHeightErr}</small> : null}


                            <div className={maxWeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Max Weight</label><br />
                                <input value={maxWeight} placeholder="Insert max weight" className={maxWeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="maxWeight"></input><br />
                            </div>
                            {maxWeightErr ? <small className={s.error}>{maxWeightErr}</small> : null}


                            <div className={minWeightErr ? '' : 'mb-3'}>
                                <label className={s.label}>Min Weight</label><br />
                                <input value={minWeight} placeholder="Insert min weight" className={minWeightErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="minWeight"></input><br />
                            </div>
                            {minWeightErr ? <small className={s.error}>{minWeightErr}</small> : null}


                            <div className={maxLifespanErr ? '' : 'mb-3'}>
                                <label className={s.label}>Max Lifespan</label><br />
                                <input value={maxLifespan} placeholder="Insert max lifespan" className={maxLifespanErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="maxLifespan"></input><br />
                            </div>
                            {maxLifespanErr ? <small className={s.error}>{maxLifespanErr}</small> : null}

                            <div className={minLifespanErr ? '' : 'mb-3'}>
                                <label className={s.label}>Min Lifespan</label><br />
                                <input value={minLifespan} placeholder="Insert min lifespan" className={minLifespanErr ? s.errorInput : s.formInput} type="text" onChange={handleChange} name="minLifespan"></input><br />
                            </div>
                            {minLifespanErr ? <small className={s.error}>{minLifespanErr}</small> : null}

                            <div className={temperamentErr ? '' : 'mb-3'}>
                                <label className={s.label}>Temperaments</label><br />
                                <select className={temperamentErr ? s.errorSelect : s.selectInput} id="temperamentSelector" value={actualTemperament} onChange={handleChange} name="temperament">
                                    <option key='default' value='default' disabled>Select a temperament</option>
                                    {temperaments.map((e, i) => <option key={i} value={e}>{e}</option>)}
                                </select><br />
                            </div>
                            {temperamentErr ? <small className={s.error}>{temperamentErr}</small> : null}

                            {selectedTemperaments.length ?
                                <div className={s.temperamentsContainer}>
                                    {selectedTemperaments.map((e, i) =>
                                        <div key={i} className={s.test}>
                                            <button onClick={() => deleteTemperament(e)} value={e} className={s.temperament}>
                                                {e}
                                                <IonIcon icon={closeCircleOutline} className={s.iconDelete}></IonIcon>
                                            </button>
                                        </div>
                                    )}
                                    {/* <div className={s.quitarDeCesta}>
                                        <button onClick={quitardeCesta} className={s.quitarDeCestaButton}>
                                            <IonIcon icon={closeCircleOutline} className={s.iconDumb}></IonIcon>
                                            <span className={s.textDumb}>Quitar</span>
                                        </button>
                                    </div> */}


                                    {/* {selectedTemperaments.map((e, i) => 
                                    <div className={s.test}>
                                        <input key={i} type='button' value={e} className={s.temperament} onClick={e => deleteTemperament(e)} />
                                        <IonIcon icon={closeCircleOutline} className={s.iconColor}></IonIcon>
                                    </div>)} */}
                                </div>
                                : null}

                            <input type="submit" value="Register breed" disabled={buttonState} className={`w-100 btn btn-primary ${s.submit}`} />
                        </form>
                    </div>
                    :
                    <div className={s.containerNoLogin}>
                        <div className={s.contentNoLogin}>
                            <img className={s.loading} src={loading} alt='loadingGif' width="25%"></img>
                        </div>
                    </div>
                :
                <div className={s.containerNoLogin}>
                    <div className={s.contentNoLogin}>
                        <p>To be able to register a new breed you need to be logged in.</p>
                        <Link to="/login" className={s.loginButton}>Log in</Link>
                    </div>
                </div>
            }
        </>
    )
}