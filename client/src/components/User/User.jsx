import s from './User.module.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import loading from '../../img/loadingGif.gif';
import { countries } from '../../extras/countries';
import axios from '../../axiosInterceptor';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUser, setPublicUser } from '../../actions';
import { uploadImage, uploadConfirmedImage } from '../../extras/firebase';
import { getUserInfo, showMessage, validURL } from '../../extras/globalFunctions';
import loadingHorizontal from '../../img/loadingHorizontalGif.gif'
import Post from '../Post/Post';
import Card from '../Card/Card';
import emptyVector from '../../img/empty.svg';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export default function User({ username }) {
  // Redux states
  const publicUser = useSelector(state => state.publicUser)
  const user = useSelector(state => state.user)


  // Own states
  const [errGlobal, setErrGlobal] = useState('');
  const [images, setImages] = useState({})

  // Variables
  const dispatch = useDispatch();
  // Hooks

  // This hook allows us to load the user info and show it in the component
  useEffect(() => {
    let flags = {};
    require.context('../../img/svg', false, /\.(svg)$/).keys().forEach((item, index) => { flags[item.replace('./', '')] = require.context('../../img/svg', false, /\.(svg)$/)(item); });
    setImages(flags);
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

  // This hook allows us to get the information of the user especified through the username parameter
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function updateUser() {
      try {
        const publicUser = await axios.get(`/users/${username}`, { cancelToken: source.token })
        dispatch(setPublicUser(publicUser.data))
      } catch (e) {
        if (e.message !== "Unmounted") {
          setErrGlobal(e.response.data)
        }
      }
    }
    updateUser();
    return () => source.cancel("Unmounted");
  }, [dispatch, username])

  return (

    <div className={s.container}>
      {!errGlobal ?
        Object.keys(publicUser).length && Object.keys(images).length ?
          <div className={s.content}>
            <div className={s.header}>
              <div className={s.headerInfo}>
              <img className={s.profilePic} src={publicUser.profilepic} alt='User profile'></img>
              <div className={s.information}>
                <h1 className={s.title}>{publicUser.username}</h1>
                {user.username === username ? <Link to="/profile" className={`btn btn-primary ${s.editButton}`}>Edit profile</Link> : null}
                <p className='mb-0'>{publicUser.fullname}</p>
                <div className={s.countryContainer}>
                  <img className={s.countryFlag} src={images[`${countries.filter(e => e.name === publicUser.country)[0].code.toLowerCase()}.svg`].default} alt='Country flag'></img>
                  <p className='mb-0'>{publicUser.country}</p>
                </div>
              </div>
              </div>
              
            </div>
            <div className={s.columns}>
              {!publicUser.dogs.length && !publicUser.pets.length ?
                <>
                  <img className={s.emptyVector} src={emptyVector} alt='Empty vector'></img>
                  <p className={s.noPets}>No pets published yet</p>
                </>
                :
                null
              }
              {publicUser.dogs.length ?
                <div className={publicUser.pets.length ? s.cardDetail : s.onlyColumn}>
                  {
                    publicUser.dogs.map((e, i) => <Card origin='publicProfile' name={e.name} img={e.image} key={i} temperament={e.temperament} id={e.id}></Card>)
                  }
                </div>
                :
                null
              }

              {/* <div className={s.cardsContainer}>
                  {
                    actualPageRedux.map((e, i) => <Card name={e.name} img={e.image} key={i} temperament={e.temperament} id={e.id}></Card>)
                  }
                </div> */}


              {
                publicUser.pets.length ?
                  <div className={publicUser.dogs.length ? s.specimens : s.onlyColumn}>
                    <h2 className={s.petsTitle}>Pets</h2>
                    <div className={s.postsContainer}>
                      {
                        publicUser.pets.map((e, i) => <Post origin='publicProfile' key={i} id={e.id} name={e.name} img={e.photo} likesCount={e.likesCount} owner={publicUser} likes={e.likes} dog={e.dog}></Post>)
                      }
                    </div>
                  </div>
                  :
                  null
              }
              {/* <div className={s.formContainer}> */}

              {/* <div className={s.errorGlobalContainer}>
              {errGlobal ? <p className={s.errorGlobal}>{errGlobal}</p> : null}
            </div>

            <form onSubmit={handleSubmit} className={s.infoForm}>
              <div className={errName ? '' : 'mb-3'}>
                <label className={s.label} htmlFor="nameValue">Name</label>
                <input id="nameValue" value={name} name='nameValue' onChange={handleChange} className={`form-control ${s.input} ${errName ? s.errorInput : ''}`} />
              </div>
              {errName ? <small className={s.error}>{errName}</small> : null}

              <div className={errLastname ? '' : 'mb-3'}>
                <label className={s.label} htmlFor="lastnameValue">Last Name</label>
                <input id="lastnameValue" value={lastname} name='lastnameValue' onChange={handleChange} className={`form-control ${s.input} ${errLastname ? s.errorInput : ''}`} />
              </div>
              {errLastname ? <small className={s.error}>{errLastname}</small> : null}

              <div className={errUsername ? '' : 'mb-3'}>
                <label className={s.label} htmlFor="usernameValue">Username</label>
                <input id="usernameValue" value={username} name='usernameValue' onChange={handleChange} className={`form-control ${s.input} ${errUsername ? s.errorInput : ''}`} />
              </div>
              {errUsername ? <small className={s.error}>{errUsername}</small> : null}

              <div className='mb-3'>
                <label className={s.label} htmlFor="countryValue">Country</label>
                <select id="countryValue" name='countryValue' value={country} onChange={handleChange} className={`form-control ${s.input}`}>
                  {countries.map(c => {
                    return <option key={c} value={c}>{c}</option>
                  })}
                </select>
              </div>

              <input type="submit" value="Save changes" disabled={buttonState} className={`w-100 btn btn-primary mb-3`} />
            </form> */}
              {/* </div> */}
            </div>
          </div>
          :
          <div className={s.contentCenter}>
            <img className={s.loading} src={loading} alt='loadingGif'></img>
          </div>
        :
        <div className={s.contentCenter}>
          <div className={s.errorGlobalContainer}>
            <p className={s.errorMain}>{errGlobal}</p>
          </div>
        </div>
      }
    </div>
  );
}
