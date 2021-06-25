import s from './Home.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cards from '../Cards/Cards';
import * as actionsCreators from '../../actions';
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../Pagination/Pagination';


export default function Home(props) {
  const dispatch = useDispatch();

  const finalResultRedux = useSelector(state => state.finalResult);
  const actualPageRedux = useSelector(state => state.actualPage);
  const temperamentsRedux = useSelector(state => state.temperaments);

  //const [temperamentsRedux] = useSelector([])

  const [dogs, setDogs] = useState([])
  const [foundogs, setFoundogs] = useState([]);
  const [firstfilterdogs, setFirstfilterdogs] = useState([]);
  const [secondfilterdogs, setSecondfilterdogs] = useState([]);
  const [error, setError] = useState('');
  //const [breed, setBreed] = useState('');
  const [temperament, setTemperament] = useState('');
  const [property, setProperty] = useState('');

  // Al cargar la página
  useEffect(() => {
    async function requesting() {
      const imcompleteDogs = await axios.get(`http://localhost:3001/dogs`);
      setDogs(imcompleteDogs.data);
      dispatch(actionsCreators.modifyFinalResult(imcompleteDogs.data))
      //if (imcompleteDogs > )
      const completeDogs = await axios.get(`http://localhost:3001/dogs/all`);
      setDogs(completeDogs.data);
      dispatch(actionsCreators.modifyFinalResult(completeDogs.data)) 
    }
    requesting();
  }, [dispatch])

  // useEffect(() => {
  //   dispatch(actionsCreators.axiosTemperaments());
  //   dispatch(actionsCreators.axiosDogs());
  //   //dispatch(actionsCreators.axiosFullDogs());
  // }, [dispatch])

  // useEffect(() => {
  //   dispatch(actionsCreators.modifyFinalResult(dogsRedux))
  // }, [dogsRedux, dispatch])

  // useEffect(() => {
  //   if (dogsRedux.length > 8) {
  //     dispatch(actionsCreators.changePage(dogsRedux.slice(0, 8)));
  //   }
  // }, [dogsRedux, dispatch])


  async function searchDog(dogBreed) {
    // setBreed(dogBreed);
    if (!dogBreed) return dispatch(actionsCreators.modifyFinalResult(dogs));
    const foundogs = dogs.filter((e) => e.name.toLowerCase().includes(dogBreed.toLowerCase()))
    if (foundogs.length) { dispatch(actionsCreators.modifyFinalResult(foundogs)); return setFoundogs([foundogs]) }
    dispatch(actionsCreators.modifyFinalResult([])); setError(`Not results found matching ${dogBreed}`);
  }

  async function filterTemperament(temperament) {
    // if (foundogs.length) { arrayToFilter = foundogs }
    // else if (foundogs.length) { arrayToFilter = foundogs }
    setTemperament(temperament);
    if (temperament === 'default') return setFirstfilterdogs([]);
    let arrayToFilter = [];
    if (foundogs.length) {arrayToFilter = foundogs;}
    else if (dogs.length) { arrayToFilter = dogs;}
    arrayToFilter = arrayToFilter.filter(e => e.temperament ? e.temperament.toLowerCase().includes(temperament.toLowerCase()) : false);
    if (arrayToFilter.length) { dispatch(actionsCreators.modifyFinalResult(arrayToFilter)); return setFirstfilterdogs(arrayToFilter) }
    dispatch(actionsCreators.modifyFinalResult(arrayToFilter)); return setError(`Not results found matching ${temperament}`)
    /*
    //(e) => e.temperament ? e.temperament.toLowerCase().includes(temperament.toLowerCase()) : false)
    const temperamentFilter = await axios.get(`http://localhost:3001/dogs?temperament=${temperament}`)
    if (temperamentFilter.data instanceof Array && temperamentFilter.data.length) return setFoundogs(temperamentFilter.data);
    return setFoundogs([]);*/
  }

  async function filterProperty(property) {
    setProperty(property);
    let arrayToFilter = [];
    if (firstfilterdogs.length) { arrayToFilter = firstfilterdogs }
    else if (foundogs.length) { arrayToFilter = foundogs }
    else if (dogs.length) { arrayToFilter = dogs }
    if (property === "own") arrayToFilter = arrayToFilter.filter(e => e.id >= 265)
    if (property === "notOwn") arrayToFilter = arrayToFilter.filter(e => e.id < 265)
    if (arrayToFilter.length) { dispatch(actionsCreators.modifyFinalResult(arrayToFilter)); return setSecondfilterdogs(arrayToFilter) }
    dispatch(actionsCreators.modifyFinalResult(arrayToFilter)); return setError(`Not results found matching ${property}`)
    /*if (property === 'own') {
      const ownDogs = await axios.get(`http://localhost:3001/dogs/own`);
      console.log(ownDogs.data)
    }
    if (property === 'notOwn') return 'notOwn';
    if (property === 'all') return 'all';*/
  }

  function deleteSearch() {
    document.getElementById('search').value = '';
    setFoundogs([]);
    if (secondfilterdogs.length) return filterProperty(property);
    if (firstfilterdogs.length) return filterTemperament(temperament);
    dispatch(actionsCreators.modifyFinalResult(dogs));
  }

  function deletefirstfilter() {
    document.getElementById('temperamentSelector').value = 'default';
    setFirstfilterdogs([]);
    if (secondfilterdogs.length) return filterProperty(property);
    if (foundogs.length) return dispatch(actionsCreators.modifyFinalResult(foundogs));
    dispatch(actionsCreators.modifyFinalResult(dogs));
  }

  function deletesecondfilter() {
    document.getElementById('own').checked = false; 
    document.getElementById('notOwn').checked = false;
    setSecondfilterdogs([]);
    if (firstfilterdogs.length) return dispatch(actionsCreators.modifyFinalResult(firstfilterdogs))
    if (foundogs.length) return dispatch(actionsCreators.modifyFinalResult(foundogs))
    dispatch(actionsCreators.modifyFinalResult(dogs))
  }

  
  return (
    <div className={s.container}>
      <form>
        <input className={s.marginTop} id="search" placeholder="Search a dog breed"
          onChange={e => { searchDog(e.target.value); }} />
        <button className={s.marginLeft} onClick={() => { deleteSearch() }}>Delete search</button>
      </form>
      <div className={s.marginTop}>
        <label className={s.label}>Filter by temperament</label>
        <select onChange={e => filterTemperament(e.target.value)} id="temperamentSelector">
          <option key='default' value='default'>Select a temperament</option>
          {
            temperamentsRedux.map((e, i) => <option key={i} value={e}>{e}</option>)
          }
        </select>
        <button className={s.marginLeft} onClick={() => { deletefirstfilter() }}>Delete filter</button>

      </div>
      <div className={s.marginTop}>
        <span className={s.label}>Filter by property</span>
        <input type="radio" id="own" name="propertyFilter" value="own" onClick={e => filterProperty(e.target.value)} /> Show own dogs

        <input type="radio" id="notOwn" name="propertyFilter" value="notOwn" onClick={e => filterProperty(e.target.value)} className={s.marginLeft} /> Not show own dogs

        <button className={s.marginLeft} onClick={() => { deletesecondfilter() }}>Delete filter</button>


      </div>
      {finalResultRedux.length ? <Cards dogs={actualPageRedux}></Cards> : <p>{error}</p>}

      {/*foundogs.length ? 
        secondfilterdogs instanceof Array && secondfilterdogs.length ?
          <Cards dogs={secondfilterdogs}></Cards> 
          : typeof secondfilterdogs === "string" ? 
            <p>{secondfilterdogs}</p>
            : filterdogs instanceof Array && filterdogs.length ? 
              <Cards dogs={filterdogs}></Cards> 
          : typeof filterdogs === "string" ? 
            <p>{filterdogs}</p> 
            : <Cards dogs={foundogs}></Cards>     
        : actualPageRedux.length ? 
          <Cards dogs={actualPageRedux}></Cards> 
      : <Cards dogs={dogsRedux}></Cards> */}
      {finalResultRedux.length ? <Pagination></Pagination> : null}
    </div>
  );
}

/*let dogList = [];
 async function getDogs() {
   const defaultResponse = await axios.get('http://localhost:3001/dogs');
   return dogList = defaultResponse.data;
 }*/
 //if(props.dogsRedux) setDogs(props.dogsRedux)
