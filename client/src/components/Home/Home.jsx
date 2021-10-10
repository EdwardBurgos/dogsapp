import s from './Home.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../axiosInterceptor';
import Card from '../Card/Card';
import * as actionsCreators from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import PaginationComponent from '../PaginationComponent/PaginationComponent';
import loading from '../../img/loadingGif.gif';
import { getDogs, getTemperaments, getUserInfo } from '../../extras/globalFunctions';
import emptyVector from '../../img/empty.svg';
import Loading from '../Loading/Loading';

export default function Home() {
  // Redux states
  const finalResultRedux = useSelector(state => state.finalResult);
  const actualPageRedux = useSelector(state => state.actualPage);
  const loadingRedux = useSelector(state => state.loading);

  // Own States
  const [temperaments, setTemperaments] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [temperament, setTemperament] = useState('');
  const [errorGlobal, setErrorGlobal] = useState('')
  const [dogs, setDogs] = useState([])
  // Variables
  const dispatch = useDispatch();

  // Hooks

  // This hooks allows us to stop loading when the results of the page are ready 
  useEffect(() => {
    dispatch(actionsCreators.setLoading(false))
  }, [actualPageRedux])

  // This hook load the dogs and the temperaments for the filter
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function requesting() {
      const dogs = await getDogs(source.token);
      const temperaments = await getTemperaments(source.token);
      if (temperaments !== "Unmounted" && dogs !== "Unmounted") {
        if (dogs.length && temperaments.length) {
          setDogs(dogs)
          dispatch(actionsCreators.modifyFinalResult(dogs));
          setTemperaments(temperaments);
        } else { setErrorGlobal('Sorry, an error ocurred'); }
      }
    }
    requesting();
    return () => source.cancel("Unmounted");
  }, [dispatch])

  // This hook allow us to load the logued user
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function updateUser() {
      const user = await getUserInfo(source.token);
      if (user !== "Unmounted") {
        dispatch(actionsCreators.setUser(user))
      }
    }
    updateUser();
    return () => source.cancel("Unmounted");
  }, [dispatch])

  // Functions 

  function filter(e) {
    e.preventDefault();
    if (dogs.length < 9) return setError('Wait a moment please');
    let componentValue = e.target.value;
    let componentId = e.target.id;
    let finalResult = [];
    let actualsearchterm = searchTerm;
    let actualtemperament = temperament;
    if (componentId === 'searchTerm') { actualsearchterm = componentValue; setSearchTerm(componentValue) }
    if (componentId === 'temperament') { actualtemperament = componentValue; setTemperament(componentValue) }
    if (componentId === 'deleteSearch') { if (searchTerm) { finalResult = dogs; setSearchTerm('');} else {return} } else {
      finalResult = dogs.filter((e) => e.name.toLowerCase().includes(actualsearchterm.toLowerCase()))
    }
    if (componentId === 'deleteTemperamentFilter' || (componentId === 'temperament' && componentValue === 'default')) { if (temperament && temperament !== 'default') { setTemperament(''); } else {return} } else {
      finalResult = finalResult.filter(e => e.temperament ? e.temperament.toLowerCase().includes(actualtemperament.toLowerCase()) : false);
    }

    if (!finalResult.length) setError('Not results found')
    dispatch(actionsCreators.modifyFinalResult(finalResult))
  }

  return (
    <div className={s.container}>
      {
        errorGlobal ?
          <div className={s.contentCenter}>
            <p className={s.errorGlobal}>{errorGlobal}</p>
          </div>
          :
          dogs.length && temperaments.length ?
            <>
              <div className={s.header}>
                <h1 className={s.title}>Dog breeds</h1>
                <div className={s.marginTop}>
                  <label className={s.label}>Search a breed</label>
                  <input className={s.searchInput} id="searchTerm" value={searchTerm}
                    onChange={e => filter(e)} />
                  <button className={s.button} id="deleteSearch" onClick={e => { filter(e) }}>Delete search</button>
                </div>
                <div className={s.marginTop}>
                  <label className={s.label}>Filter by temperament</label>
                  <select onChange={e => filter(e)} id="temperament" value={temperament} className={s.selectInput}>
                    <option key='default' value='default'>Select a temperament</option>
                    {temperaments.map((e, i) => <option key={i} value={e}>{e}</option>)}
                  </select>
                  <button className={s.button} id="deleteTemperamentFilter" onClick={e => { filter(e) }}>Delete filter</button>
                </div>
              </div>
              <div className={s.content}>
                {finalResultRedux.length ?
                  <>
                    {
                      !loadingRedux ?
                        <div className={s.cardsContainer}>
                          {
                            actualPageRedux.map((e, i) => <Card name={e.name} img={e.image} key={i} temperament={e.temperament} id={e.id}></Card>)
                          }
                        </div>
                        :
                        <div className={s.loadingContainer}>
                          <Loading />
                        </div>
                    }
                    <div className='w-100'><PaginationComponent /></div>
                  </>
                  :
                  <>
                    <div className={s.emptyVectorContainer}>
                      <img className={s.emptyVector} src={emptyVector} alt='Empty vector'></img>
                      <p className={s.noDogs}>{error}</p>
                    </div>
                  </>
                }
              </div>
            </>
            :
            <Loading />
      }
    </div>
  );
}