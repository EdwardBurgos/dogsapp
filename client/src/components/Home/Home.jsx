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
import { closeCircleOutline, searchOutline, optionsOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Modal, Form } from 'react-bootstrap';

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
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedTemperaments, setSelectedTemperaments] = useState([])
  // Variables
  const dispatch = useDispatch();

  // Hooks

  useEffect(() => {
    console.log(selectedTemperaments)
  }, [selectedTemperaments])




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
    if (componentId === 'deleteSearch') { if (searchTerm) { finalResult = dogs; setSearchTerm(''); } else { return } } else {
      finalResult = dogs.filter((e) => e.name.toLowerCase().includes(actualsearchterm.toLowerCase()))
    }
    if (componentId === 'deleteTemperamentFilter' || (componentId === 'temperament' && componentValue === 'default')) { if (temperament && temperament !== 'default') { setTemperament(''); } else { return } } else {
      finalResult = finalResult.filter(e => e.temperament ? e.temperament.toLowerCase().includes(actualtemperament.toLowerCase()) : false);
    }

    if (!finalResult.length) setError('Not results found')
    dispatch(actionsCreators.modifyFinalResult(finalResult))
  }

  return (
    <>
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
                  <div className={s.searchContainer}>
                    <div className={s.test}>
                      <Form.Control id="searchTerm" autoComplete="off" value={searchTerm} onChange={e => filter(e)} className={s.searchInput} placeholder='Search a dog breed' />
                      <IonIcon icon={searchTerm ? closeCircleOutline : searchOutline} className={s.iconDumb} id="deleteSearch" onClick={e => filter(e)}></IonIcon>
                    </div>
                    <IonIcon icon={optionsOutline} className={s.filterIcon} onClick={() => setShowFilterModal(true)}></IonIcon>
                  </div>
                  <div className={s.temperaments}>
                    {selectedTemperaments.map(e =>
                      <div key={e} className={s.temperamentContainer}>
                        <span className={s.temperament}>{e}</span>
                        <IonIcon icon={closeCircleOutline} className={s.iconDumb} onClick={() => setSelectedTemperaments([...new Set(selectedTemperaments.filter(element => element !== e))])}></IonIcon>
                      </div>
                    )}
                  </div>

                  {/* <div className={s.marginTop}>
                  <input className={s.searchInput}


                </div> */}
                  {/* <div className={s.marginTop}>
                  <select onChange={e => filter(e)} id="temperament" value={temperament} className={s.selectInput}>
                    <option key='default' value='default'>Select a temperament</option>
                    {temperaments.map((e, i) => <option key={i} value={e}>{e}</option>)}
                  </select>
                  <button className={s.button} id="deleteTemperamentFilter" onClick={e => { filter(e) }}>Delete filter</button>
                </div> */}
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

      <Modal
        show={showFilterModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
        onHide={() => setShowFilterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Select temperaments to filter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            {
              temperaments.map((e, i) =>
                <Form.Check
                  type='checkbox'
                  key={e.toLowerCase()}
                  id={e.toLowerCase()}
                  value={e}
                  checked={selectedTemperaments.includes(e) ? true : false}
                  label={e}
                  onChange={() => selectedTemperaments.includes(e) ? setSelectedTemperaments([...new Set(selectedTemperaments.filter(element => element !== e))]) : setSelectedTemperaments([...new Set([...selectedTemperaments, e])])}
                  name="temperaments"
                />)
            }
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}