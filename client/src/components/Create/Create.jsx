import s from './Create.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import * as actionsCreators from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from 'ionicons/icons';
import { closeCircleOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';

export default function Create() {
    const [selectedTemperaments, setSelectedTemperaments] = useState([]);
    const dispatch = useDispatch();
    const temperamentsRedux = useSelector(state => state.temperaments);
    useEffect(() => {
        dispatch(actionsCreators.axiosTemperaments());
    }, [dispatch])

    const login = useSelector(state => state.login);


    const [name, setName] = useState('')
    const [nameErr, setnameErr] = useState('This field is required')
    const [maxHeight, setMaxHeight] = useState('')
    const [maxHeightErr, setMaxHeightErr] = useState('This field is required')
    const [minHeight, setMinHeight] = useState('')
    const [minHeightErr, setMinHeightErr] = useState('This field is required')
    const [maxWeight, setMaxWeight] = useState('')
    const [maxWeightErr, setMaxWeightErr] = useState('This field is required')
    const [minWeight, setMinWeight] = useState('')
    const [minWeightErr, setMinWeightErr] = useState('This field is required')
    const [maxLifespan, setMaxLifespan] = useState('')
    const [maxLifespanErr, setMaxLifespanErr] = useState('This field is required')
    const [minLifespan, setMinLifespan] = useState('')
    const [minLifespanErr, setMinLifespanErr] = useState('This field is required')
    const [temperamentErr, setTemperamentErr] = useState('Select a temperament')
    const [actualTemperament, setActualTemperament] = useState('default')
    const [buttonState, setButtonState] = useState(true)

    function selectTemperament(temperament) {
        setTemperamentErr('');
        // if (selectedTemperaments.includes(temperament)) return setTemperamentErr('Temperament already selected')
        setSelectedTemperaments([...new Set([...selectedTemperaments, temperament])])
    }

    function deleteTemperament(e) {
        e.preventDefault();
        setSelectedTemperaments(selectedTemperaments.filter(el => el === e.target.value ? false : true))
    }

    useEffect(() => {
        if (!selectedTemperaments.length) return setTemperamentErr('Select a temperament')
    }, [selectedTemperaments])

    function validateValue(e, type) {
        let value = e.target.value;
        switch (type) {
            case 'name':
                value = value.replace(/[0-9]/g, '');
                if (!value) { setnameErr('This field is required') } else { setnameErr('') }
                return setName(value)
            case 'maxHeight':
                value = parseInt(value.replace(/[^0-9]/g, ''));
                if (isNaN(value)) { setMaxHeight(''); return setMaxHeightErr('This field is required'); }
                if (value > minHeight) { setMaxHeightErr(''); minHeight ? setMinHeightErr('') : setMinHeightErr('This field is required') } else { setMaxHeightErr('Max height must be greater than min height') }
                return setMaxHeight(value)
            case 'minHeight':
                value = parseInt(value.replace(/[^0-9]/g, ''));
                if (isNaN(value)) { setMinHeight(''); return setMinHeightErr('This field is required') }
                if (maxHeight > value) { setMinHeightErr(''); maxHeight ? setMaxHeightErr('') : setMaxHeightErr('This field is required') } else { setMinHeightErr('Min height must be less than max height') }
                return setMinHeight(value)
            case 'maxWeight':
                value = parseInt(value.replace(/[^0-9]/g, ''));
                if (isNaN(value)) { setMaxWeight(''); return setMaxWeightErr('This field is required') }
                if (value > minWeight) { setMaxWeightErr(''); minWeight ? setMinWeightErr('') : setMinWeightErr('This field is required') } else { setMaxWeightErr('Max weight must be greater than min weight') }
                return setMaxWeight(value)
            case 'minWeight':
                value = parseInt(value.replace(/[^0-9]/g, ''));
                if (isNaN(value)) { setMinWeight(''); return setMinWeightErr('This field is required') }
                if (maxWeight > value) { setMinWeightErr(''); maxWeight ? setMaxWeightErr('') : setMaxWeightErr('This field is required') } else { setMinWeightErr('Min weight must be less than max weight') }
                return setMinWeight(value)
            case 'maxLifespan':
                value = parseInt(value.replace(/[^0-9]/g, ''));
                if (isNaN(value)) { setMaxLifespan(''); return setMaxLifespanErr('This field is required') }
                if (value > minLifespan) { setMaxLifespanErr(''); minLifespan ? setMinLifespanErr('') : setMinLifespanErr('This field is required') } else { setMaxLifespanErr('Max lifespan must be greater than min lifespan') }
                return setMaxLifespan(value)
            case 'minLifespan':
                value = parseInt(value.replace(/[^0-9]/g, ''));
                if (isNaN(value)) { setMinLifespan(''); return setMinLifespanErr('This field is required') }
                if (maxLifespan > value) { setMinLifespanErr(''); maxLifespan ? setMaxLifespanErr('') : setMaxLifespanErr('This field is required') } else { setMinLifespanErr('Min lifespan must be less than max lifespan') }
                return setMinLifespan(value)
            default:
                return '';
        }
    }

    const creationMessageRedux = useSelector(state => state.creationMessage);

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


    useEffect(() => {
        if (!creationMessageRedux) {
            setSelectedTemperaments([])
            setName('')
            setnameErr('This field is required')
            setMaxHeight('')
            setMaxHeightErr('This field is required')
            setMinHeight('')
            setMinHeightErr('This field is required')
            setMaxWeight('')
            setMaxWeightErr('This field is required')
            setMinWeight('')
            setMinWeightErr('This field is required')
            setMaxLifespan('')
            setMaxLifespanErr('This field is required')
            setMinLifespan('')
            setMinLifespanErr('This field is required')
            setTemperamentErr('Select a temperament')
            setActualTemperament('default')
        }
    }, [creationMessageRedux])

    useEffect(() => {
        if (!nameErr && !maxHeightErr && !minHeightErr && !maxWeightErr && !minWeightErr && !maxLifespanErr && !minLifespanErr && !temperamentErr) {
            setButtonState(false);
        }
        if (nameErr || maxHeightErr || minHeightErr || maxWeightErr || minWeightErr || maxLifespanErr || minLifespanErr || temperamentErr) {
            setButtonState(true);
        }
    }, [nameErr, maxHeightErr, minHeightErr, maxWeightErr, minWeightErr, maxLifespanErr, minLifespanErr, temperamentErr])

    // const [name, setName] = useState('')
    // const [nameErr, setnameErr] = useState('This field is required')
    // const [maxHeight, setMaxHeight] = useState('')
    // const [maxHeightErr, setMaxHeightErr] = useState('This field is required')
    // const [minHeight, setMinHeight] = useState('')
    // const [minHeightErr, setMinHeightErr] = useState('This field is required')
    // const [maxWeight, setMaxWeight] = useState('')
    // const [maxWeightErr, setMaxWeightErr] = useState('This field is required')
    // const [minWeight, setMinWeight] = useState('')
    // const [minWeightErr, setMinWeightErr] = useState('This field is required')
    // const [maxLifespan, setMaxLifespan] = useState('')
    // const [maxLifespanErr, setMaxLifespanErr] = useState('This field is required')
    // const [minLifespan, setMinLifespan] = useState('')
    // const [minLifespanErr, setMinLifespanErr] = useState('This field is required')
    // const [temperamentErr, setTemperamentErr] = useState('Select a temperament')
    // const [actualTemperament, setActualTemperament] = useState('default')
    // const [buttonState, setButtonState] = useState(true)


    return (
        <>
            {
                login ?
                    <div className={s.container}>
                        <h1 className={s.title}>Register a new breed</h1>
                        <form onSubmit={e => { e.preventDefault(); submitForm(name, maxHeight, minHeight, maxWeight, minWeight, maxLifespan, minLifespan, selectedTemperaments) }}>
                            <label className={s.label}>Name</label><br />
                            <input value={name} placeholder="Insert name" className={nameErr ? s.errorInput : s.formInput} type="text" onChange={e => { validateValue(e, 'name') }}></input><br />
                            {nameErr ? <><small className={s.error}>{nameErr}</small><br /></> : null}
                            <label className={s.label}>Max Height</label><br />
                            <input value={maxHeight} placeholder="Insert max height" className={maxHeightErr ? s.errorInput : s.formInput} type="text" onChange={e => { validateValue(e, 'maxHeight') }} ></input><br />
                            {maxHeightErr ? <><small className={s.error}>{maxHeightErr}</small><br /></> : null}
                            <label className={s.label}>Min Height</label><br />
                            <input value={minHeight} placeholder="Insert min height" className={minHeightErr ? s.errorInput : s.formInput} type="text" onChange={e => { validateValue(e, 'minHeight') }}></input><br />
                            {minHeightErr ? <><small className={s.error}>{minHeightErr}</small><br /></> : null}
                            <label className={s.label}>Max Weight</label><br />
                            <input value={maxWeight} placeholder="Insert max weight" className={maxWeightErr ? s.errorInput : s.formInput} type="text" onChange={e => { validateValue(e, 'maxWeight') }}></input><br />
                            {maxWeightErr ? <><small className={s.error}>{maxWeightErr}</small><br /></> : null}
                            <label className={s.label}>Min Weight</label><br />
                            <input value={minWeight} placeholder="Insert min weight" className={minWeightErr ? s.errorInput : s.formInput} type="text" onChange={e => { validateValue(e, 'minWeight') }}></input><br />
                            {minWeightErr ? <><small className={s.error}>{minWeightErr}</small><br /></> : null}
                            <label className={s.label}>Max Lifespan</label><br />
                            <input value={maxLifespan} placeholder="Insert max lifespan" className={maxLifespanErr ? s.errorInput : s.formInput} type="text" onChange={e => { validateValue(e, 'maxLifespan') }}></input><br />
                            {maxLifespanErr ? <><small className={s.error}>{maxLifespanErr}</small><br /></> : null}
                            <label className={s.label}>Min Lifespan</label><br />
                            <input value={minLifespan} placeholder="Insert min lifespan" className={minLifespanErr ? s.errorInput : s.formInput} type="text" onChange={e => { validateValue(e, 'minLifespan') }}></input><br />
                            {minLifespanErr ? <><small className={s.error}>{minLifespanErr}</small><br /></> : null}
                            {/* onChange={e => filterTemperament(e.target.value)} */}
                            <label className={s.label}>Temperaments</label><br />
                            <select className={temperamentErr ? s.errorSelect : s.selectInput} id="temperamentSelector" value={actualTemperament} onChange={e => selectTemperament(e.target.value)}>
                                <option key='default' value='default' disabled>Select a temperament</option>
                                {
                                    temperamentsRedux.map((e, i) => <option key={i} value={e}>{e}</option>)
                                }
                            </select><br />
                            {temperamentErr ? <><small className={s.error}>{temperamentErr}</small><br /></> : null}
                            {selectedTemperaments.length ? <div className={s.temperamentsContainer}>{selectedTemperaments.map((e, i) => <><input key={i} type='button' value={e} className={s.temperament} onClick={e => deleteTemperament(e)} /> <img src={closeCircleOutline} className={s.iconColor}></img></>)}</div> : null}

                            <input type="submit" value="Register breed" className={s.submit} disabled={buttonState}></input>


                        </form>
                        {creationMessageRedux ? <Modal></Modal> : null}
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