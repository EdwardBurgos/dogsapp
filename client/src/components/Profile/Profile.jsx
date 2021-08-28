import s from './Profile.module.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import loading from '../../img/loadingGif.gif';
import { countries } from '../../extras/countries';
import axios from '../../axiosInterceptor';
import 'react-toastify/dist/ReactToastify.css';
import { validURL } from '../../extras/globalFunctions';
import { useDispatch } from 'react-redux';
import { setUser } from '../../actions';
import { uploadImage, uploadConfirmedImage } from '../../extras/firebase';
import { getUserInfo, showMessage } from '../../extras/globalFunctions';


export default function Profile() {
  // Redux states
  const user = useSelector(state => state.user);

  // Own states
  const [errGlobal, setErrGlobal] = useState('');
  const [name, setName] = useState('');
  const [errName, setErrName] = useState('');
  const [lastname, setLastname] = useState('');
  const [errLastname, setErrLastname] = useState('');
  const [username, setUsername] = useState('');
  const [errUsername, setErrUsername] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [buttonState, setButtonState] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [photo, setPhoto] = useState('')
  const [errPhoto, setErrPhoto] = useState('')
  const [changedPhoto, setChangedPhoto] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Variables
  const dispatch = useDispatch();

  // Hooks

  // This hook allows us to load the user info and show it in the component
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function updateUser() {
      const user = await getUserInfo(source.token);
      if (user !== "Unmounted") {
        dispatch(setUser(user))
        if (Object.keys(user).length) {
          setPhoto(user.profilepic)
          setName(user.name)
          setLastname(user.lastname)
          setUsername(user.username)
          setCountry(user.country)
          setEmail(user.email)
        }
      }
    }
    updateUser();
    return () => source.cancel("Unmounted");
  }, [dispatch])

  // This hook allows us to handle the form submit button status
  useEffect(() => {
    if ((name !== user.name || lastname !== user.lastname || username !== user.username || country !== user.country) && !errName && !errLastname && !errUsername) return setButtonState(false)
    setButtonState(true)
  }, [name, lastname, username, country, errName, errLastname, errUsername, user])

  // Functions

  // This function allows us to handle the changes in the form
  function handleChange(e) {
    const value = e.target.value;
    switch (e.target.name) {
      case 'nameValue':
        !value ? setErrName('This field is required') : setErrName('')
        return setName(value)
      case 'lastnameValue':
        !value ? setErrLastname('This field is required') : setErrLastname('')
        return setLastname(value)
      case 'usernameValue':
        !value ? setErrUsername('This field is required') : (value.length < 31 ? (/\s/.test(value) ? setErrUsername("The username can't contain white spaces") : (/^[a-z0-9._]+$/g.test(value) ? setErrUsername('') : setErrUsername("The username only can contains lowercase letters, numbers, points and subscripts"))) : setErrUsername("The username can't have more than 30 characters"))
        return setUsername(value)
      case 'countryValue':
        return setCountry(value)
      default:
        break;
    }
  }

  // This function allows us to handle the submit of the form 
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const update = await axios.put('/users/updateUserInfo', { name, lastname, username, country });
      showMessage(update.data)
      setButtonState(true)
      const user = await getUserInfo();
      dispatch(setUser(user))
    } catch (e) {
      if (e.response.status === 409 && e.response.data === "There is already a user with this username") return setErrUsername(e.response.data)
      if (e.response.status === 500 && e.response.data === "Sorry, your information could not be updated") return setErrGlobal(e.response.data)
      if (e.response.status === 404 && e.response.data === "User not found") return setErrGlobal(e.response.data)
      setErrGlobal('Sorry, an error ocurred')
    }
  }

  // This function allows us to upload a test photo for the user profile picture
  async function changePhoto(e) {
    if (e.target.files[0]) {
      setUploading(true)
      const urlPhoto = await uploadImage(user.username, e.target.files[0])
      setUploading(false);
      if (validURL(urlPhoto)) {
        setImageFile(e.target.files[0]);
        setPhoto(urlPhoto);
        setChangedPhoto(true);
      } else {
        setErrPhoto(urlPhoto)
      }
    }
  }

  // This function allows us to update the user profile picture
  async function setNewProfilePic() {
    try {
      setUploading(true)
      const urlPhoto = await uploadConfirmedImage(user.username, imageFile)
      if (validURL(urlPhoto)) {
        const upload = await axios.post('/users/changePhoto', { profilePic: urlPhoto })
        setErrPhoto('')
        setUploading(false)
        showMessage(upload.data);
        setChangedPhoto(false)
        const user = await getUserInfo();
        dispatch(setUser(user))
      } else { setUploading(false); setErrPhoto(urlPhoto) }
    } catch (e) {
      setUploading(false)
      if (e.response.status === 500 && e.response.data === "Sorry, your profile picture could not be updated") return setErrPhoto(e.response.data)
      if (e.response.status === 404 && e.response.data === "User not found") return setErrPhoto(e.response.data)
      setErrPhoto('Sorry, an error ocurred')
    }
  }

  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>My profile</h1>
        <div className={s.columns}>
          <div className={s.imageContainer}>

            <div className={s.profilePictureEditor}>
              <label className={s.labelProfile} htmlFor="nameValue">Profile picture</label>
              <div className={`${s.containerProfileImage} ${errPhoto ? '' : 'mb-3'}`}>
                {
                  uploading ?
                    <div className={s.uploadingContainer}>
                      <img className={s.uploadingGif} src={loading} alt='User profile'></img>
                    </div>
                    :
                    <img className={s.profilePic} src={photo} alt='User profile'></img>
                }
              </div>
              {errPhoto ? <small className={s.error}>{errPhoto}</small> : null}
              {
                !changedPhoto ?
                  <div className={`w-100 btn btn-primary ${s.boton} ${uploading ? s.disabled : ''}`} onClick={() => document.getElementById('inputFile').click()}>
                    <span>Upload new profile picture</span>
                    <input id="inputFile" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
                  </div>
                  :
                  <>
                    <button className={`w-100 btn btn-success mb-3 ${s.boton}`} disabled={uploading} onClick={() => { setNewProfilePic() }}>Save changes</button>

                    <div className={`w-100 btn btn-secondary mb-3 ${s.boton} ${uploading ? s.disabled : ''}`} onClick={() => { document.getElementById('inputFileExtra').click() }}>
                      <span>Upload new profile picture</span>
                      <input id="inputFileExtra" type="file" className={s.fileInput} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
                    </div>

                    <button className={`w-100 btn btn-secondary ${s.boton}`} disabled={uploading} onClick={async () => { dispatch(setUser(await getUserInfo())); setImageFile(null); setUploading(false); setErrPhoto(''); setChangedPhoto(false); setPhoto(user.profilepic); }}>Cancel changes</button>

                  </>
              }
            </div>

            <div className={`w-100 ${s.emailInfo}`}>
              <label className={s.label} htmlFor="emailValue">Email</label>
              <p className={`form-control mb-0`}>{email}</p>
            </div>

            <div className={s.bottomContent}>
              <button className={`w-100 btn btn-primary mb-3 ${s.boton}`} onClick={() => { setNewProfilePic() }}>Change password</button>
              <button className={`w-100 btn btn-danger ${s.boton}`} onClick={() => { setNewProfilePic() }}>Delete account</button>
            </div>

          </div>
          <div className={s.formContainer}>

            <div className={s.errorGlobalContainer}>
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

              <input type="submit" value="Save changes" disabled={buttonState} className={`w-100 btn btn-primary mb-3 ${s.boton}`} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
