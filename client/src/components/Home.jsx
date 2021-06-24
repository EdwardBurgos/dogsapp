import s from '../styles/Home.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cards from './Cards';
import * as actionsCreators from '../actions';
import { useDispatch, useSelector } from 'react-redux'
import Pagination from './Pagination';


export default function Home(props) {
  const dispatch = useDispatch();
  const dogsRedux = useSelector(state => state.dogs); // Default dogs
  const temperamentsRedux = useSelector(state => state.temperaments);
  const actualPageRedux = useSelector(state => state.actualPage);
  const finalResultRedux = useSelector(state => state.finalResult);


  const [foundogs, setFoundogs] = useState([]); // Searched dogs
  const [filterdogs, setFilterdogs] = useState([]); // Filter dogs
  const [secondfilterdogs, setSecondfilterdogs] = useState([]);

  useEffect(() => {
    dispatch(actionsCreators.axiosTemperaments());
    dispatch(actionsCreators.axiosDogs());
    //dispatch(actionsCreators.axiosFullDogs());
  }, [dispatch])

  useEffect(() => {
    dispatch(actionsCreators.modifyFinalResult(dogsRedux))
  }, [dogsRedux, dispatch])

  useEffect(() => {
    if (dogsRedux.length > 8) {
      dispatch(actionsCreators.changePage(dogsRedux.slice(0, 8)));
    }
  }, [dogsRedux, dispatch])


  async function searchDog(dogBreed) {
    const response = await axios.get(`http://localhost:3001/dogs/all?name=${dogBreed}`)
    if (response.data instanceof Array && response.data.length) {dispatch(actionsCreators.modifyFinalResult(response.data)); return setFoundogs(response.data);}
    dispatch(actionsCreators.modifyFinalResult(dogsRedux)); return setFoundogs([]);
  }

  async function filterTemperament(temperament) {
   // if (foundogs.length) { arrayToFilter = foundogs }
   // else if (foundogs.length) { arrayToFilter = foundogs }

    if (temperament === 'default') return setFilterdogs([]);
if (foundogs.length) {
      const filterResult = foundogs.filter(e => e.temperament ? e.temperament.toLowerCase().includes(temperament.toLowerCase()) : false)
      if (filterResult.length) {dispatch(actionsCreators.modifyFinalResult(filterResult)); return setFilterdogs(filterResult)}
      setFilterdogs('No se hallaron coincidencias')
}
    

    /*
    //(e) => e.temperament ? e.temperament.toLowerCase().includes(temperament.toLowerCase()) : false)
    const temperamentFilter = await axios.get(`http://localhost:3001/dogs?temperament=${temperament}`)
    if (temperamentFilter.data instanceof Array && temperamentFilter.data.length) return setFoundogs(temperamentFilter.data);
    return setFoundogs([]);*/
  }


  async function filterProperty(property) {
    let arrayToFilter = [];
    if (filterdogs.length) { arrayToFilter = filterdogs }
    else if (foundogs.length) { arrayToFilter = foundogs }
    else { arrayToFilter = dogsRedux }
    if (property === "own") arrayToFilter = arrayToFilter.filter(e => e.id >= 265)
    if (property === "notOwn") arrayToFilter = arrayToFilter.filter(e => e.id < 265)
    console.log(arrayToFilter)
    dispatch(actionsCreators.modifyFinalResult(arrayToFilter))
    if (arrayToFilter.length) return setSecondfilterdogs(arrayToFilter)
    setSecondfilterdogs('No se hallaron coincidencias')
    /*if (property === 'own') {
      const ownDogs = await axios.get(`http://localhost:3001/dogs/own`);
      console.log(ownDogs.data)
    }
    if (property === 'notOwn') return 'notOwn';
    if (property === 'all') return 'all';*/
  }

  function deletesecondfilter() {
    if (filterdogs.length) return dispatch(actionsCreators.modifyFinalResult(filterdogs))
    if (foundogs.length) return dispatch(actionsCreators.modifyFinalResult(foundogs))
    dispatch(actionsCreators.modifyFinalResult(dogsRedux))
  }

  function deletefirstfilter() {
    if (foundogs.length) return 
  }
  return (
    <div className={s.container}>
      <form>
        <input className={s.marginTop} id="search" placeholder="Enter a dog breed"
          onChange={e => { searchDog(e.target.value); }} />
        <button>Search</button>
        

        {/* onClick={(e) => searchDog(document.getElementById('#search').value, e)} */}
      </form>
      <div className={s.marginTop}>
        <label className={s.label}>Filter by temperament</label>
        <select onChange={e => filterTemperament(e.target.value)} id="temperamentSelector">
          <option key='default' value='default'>Select a temperament</option>
          {
            temperamentsRedux.map((e, i) => <option key={i} value={e}>{e}</option>)
          }
        </select>
        <button className={s.marginLeft} onClick={() => { setFilterdogs([]); document.getElementById('temperamentSelector').value = 'default'; deletefirstfilter()}}>Delete filter</button>

      </div>
      <div className={s.marginTop}>
        <span className={s.label}>Filter by property</span>
        <input type="radio" id="own" name="propertyFilter" value="own" onClick={e => filterProperty(e.target.value)} /> Show own dogs

        <input type="radio" id="notOwn" name="propertyFilter" value="notOwn" onClick={e => filterProperty(e.target.value)} className={s.marginLeft} /> Not show own dogs

        <button className={s.marginLeft} onClick={() => { setSecondfilterdogs([]); document.getElementById('own').checked = false; document.getElementById('notOwn').checked = false; deletesecondfilter()}}>Delete filter</button>


      </div>
      {<Cards dogs={actualPageRedux}></Cards>}
      
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
