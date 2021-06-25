import s from './Home.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cards from '../Cards/Cards';
import * as actionsCreators from '../../actions';
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../Pagination/Pagination';

export default function Home(props) {
  // Dispatch
  const dispatch = useDispatch();

  // Global States
  const finalResultRedux = useSelector(state => state.finalResult);
  const actualPageRedux = useSelector(state => state.actualPage);

  // Local States
  const [dogs, setDogs] = useState([]);
  const [temperaments, setTemperaments] = useState([]);
  const [error, setError] = useState('');

  // Elements states
  const [searchTerm, setSearchTerm] = useState('');
  const [temperament, setTemperament] = useState('');
  const [property, setProperty] = useState('');

  // When component mounts
  useEffect(() => {
    async function requesting() {
      const imcompleteDogs = await axios.get(`http://localhost:3001/dogs`);
      setDogs(imcompleteDogs.data);
      dispatch(actionsCreators.modifyFinalResult(imcompleteDogs.data))
      const temperaments = await axios.get('http://localhost:3001/temperament');
      setTemperaments(temperaments.data);
      //if (imcompleteDogs > )
      const completeDogs = await axios.get(`http://localhost:3001/dogs/all`);
      setDogs(completeDogs.data);
      dispatch(actionsCreators.modifyFinalResult(completeDogs.data))
    }
    requesting();
  }, [dispatch])

  // Filter function
  function filter(e) {
    if (e.target.id !== 'own' && e.target.id !== 'notOwn') { e.preventDefault(); }
    if (dogs.length < 8) return setError('Wait a moment please');
    let componentValue = e.target.value;
    let componentId = e.target.id;
    let finalResult = [];
    let actualsearchterm = searchTerm;
    let actualtemperament = temperament;
    let actualproperty = property;
    if (componentId === 'searchTerm') { actualsearchterm = componentValue; setSearchTerm(componentValue) }
    if (componentId === 'temperament') { actualtemperament = componentValue; setTemperament(componentValue) }
    if (componentId === 'own') { actualproperty = 'own'; setProperty('own') }
    if (componentId === 'notOwn') { actualproperty = 'notOwn'; setProperty('notOwn') }
    if (componentId === 'deleteSearch') { finalResult = dogs; setSearchTerm(''); } else {
      finalResult = dogs.filter((e) => e.name.toLowerCase().includes(actualsearchterm.toLowerCase()))
    }
    if (componentId === 'deleteTemperamentFilter') { setTemperament('') } else {
      finalResult = finalResult.filter(e => e.temperament ? e.temperament.toLowerCase().includes(actualtemperament.toLowerCase()) : false);
    }
    if (componentId === 'deletePropertyFilter') { setProperty('') } else {
      if (actualproperty === "own") {
        finalResult = finalResult.filter(e => e.id >= 265);
      } else if (actualproperty === "notOwn") {
        finalResult = finalResult.filter(e => e.id < 265);
      }
    }
    if (!finalResult.length) setError('Not results found')
    dispatch(actionsCreators.modifyFinalResult(finalResult))
  }

  // HTML estructure
  return (
    <div className={s.container}>
      <form>
        <input className={s.marginTop} id="searchTerm" placeholder="Search a dog breed" value={searchTerm}
          onChange={e => filter(e)} />
        <button className={s.marginLeft} id="deleteSearch" onClick={e => { filter(e) }}>Delete search</button>
      </form>
      <div className={s.marginTop}>
        <label className={s.label}>Filter by temperament</label>
        <select onChange={e => filter(e)} id="temperament" value={temperament}>
          <option key='default' value='default'>Select a temperament</option>
          {temperaments.map((e, i) => <option key={i} value={e}>{e}</option>)}
        </select>
        <button className={s.marginLeft} id="deleteTemperamentFilter" onClick={e => { filter(e) }}>Delete filter</button>
      </div>
      <div className={s.marginTop}>
        <span className={s.label}>Filter by property</span>
        <input type="radio" id="own" name="propertyFilter" checked={property === 'own'} onChange={e => filter(e)} /> Show own dogs
        <input type="radio" id="notOwn" name="propertyFilter" checked={property === 'notOwn'} onChange={e => filter(e)} className={s.marginLeft} /> Not show own dogs
        <button id="deletePropertyFilter" className={s.marginLeft} onClick={e => { filter(e) }}>Delete filter</button>
      </div>
      {finalResultRedux.length ? <Cards dogs={actualPageRedux}></Cards> : <p>{error}</p>}
      {finalResultRedux.length ? <Pagination></Pagination> : null}
    </div>
  );
}
