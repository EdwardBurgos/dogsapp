import s from './Profile.module.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import logo from '../../img/logo.png';
import loading from '../../img/loadingGif.gif';
import { Link } from 'react-router-dom';
import { countries } from '../../extras/countries';
import axios from '../../axiosInterceptor';
import 'react-toastify/dist/ReactToastify.css';
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { IonIcon } from '@ionic/react';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { setLocalStorage } from '../../extras/globalFunctions';
import { useDispatch } from 'react-redux';
import { setUser } from '../../actions';
import { app, storage } from '../../extras/firebase';
import { isLoggedIn, logout, getUserInfo } from '../../extras/globalFunctions';


export default function Profile() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  

  // Own states
  const [errGlobal, setErrGlobal] = useState('');
  const [name, setName] = useState('');
  const [errName, setErrName] = useState('');
  const [lastname, setLastname] = useState(user.lastname);
  const [errLastname, setErrLastname] = useState('');
  const [username, setUsername] = useState(user.username);
  const [errUsername, setErrUsername] = useState(false);
  const [country, setCountry] = useState(user.country);
  const [email, setEmail] = useState(user.email);
  const [errEmail, setErrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [buttonState, setButtonState] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [photo, setPhoto] = useState(user.profilepic)
  const [errPhoto, setErrPhoto] = useState('')

  // Variables
  const history = useHistory();
 
  useEffect(() => {
    async function updateUser() {
      const userLocal = await getUserInfo();
      if (Object.keys(userLocal).length) {
        dispatch(setUser(userLocal))
        setPhoto(userLocal.profilepic)
        setName(userLocal.name)
        setLastname(userLocal.lastname)
        setUsername(userLocal.username)
        setCountry(userLocal.country)
        setEmail(userLocal.email)
      }
    }
    updateUser();
  }, [dispatch])

  

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
      case 'emailValue':
        !value ? setErrEmail('This field is required') : (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? setErrEmail('') : setErrEmail('Invalid email'))
        return setEmail(value)
      case 'passValue':
        if (!value) {
          setErrPassword('This field is required')
        } else {
          value.length < 21 ?
            /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(value) ?
              !/\s/.test(value) ?
                setErrPassword('')
                :
                setErrPassword("The password can't contain white spaces")
              :
              setErrPassword('The password should have between 8 and 20 characters combining lowercase and uppercase letters, numbers and symbols')
            :
            setErrPassword("The password can't have more than 20 characters")
        }
        return setPassword(value)
      default:
        break;
    }
  }

  function handleSubmit() {
    alert('fff')
  }

  useEffect(() => {
    console.log('TOKI', user)
  }, [])

  useEffect(() => {
    if (errName || errLastname || errUsername || errEmail || errPassword || !name || !lastname || !username || !email || !password) return setButtonState(true)
    return setButtonState(false)
  }, [errName, errLastname, errUsername, errEmail, errPassword, name, lastname, username, email, password])

  async function changePhoto(e) {
    if (e.target.files[0]) {
      const imageAsFile = e.target.files[0]
      const uploadTask = storage.ref(`/images/${user.username}ProfilePic`).put(imageAsFile)
      try {
        await uploadTask
        const url = await storage.ref('images').child(`${user.username}ProfilePic`).getDownloadURL()
        setPhoto(url)
      } catch (e) {
        setErrPhoto('Sorry, we could not upload your new profile picture')
      }



      // var storage = app.storage();
      // var storageRef = storage.ref();
      // var uploadTask = storageRef.child('folder/' + e.target.files[0].name).put(e.target.files[0]);

      // uploadTask.on(app.storage().TaskEvent.STATE_CHANGED,
      //   (snapshot) => {
      //     var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
      //     this.setState({ progress })
      //   }, (error) => {
      //     throw error
      //   }, () => {
      //     // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{

      //     uploadTask.snapshot.ref.getDownloadURL().then((url) => {
      //       this.setState({
      //         downloadURL: url
      //       })
      //       console.log('verg', url)
      //     })
      //     document.getElementById("file").value = null
      //   })


    }
  }

  /*
  
    // uploadImageToStorage(file)
  
  handleUpload = () =>{
  // console.log(this.state.image);
  let file = this.state.image;
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var uploadTask = storageRef.child('folder/' + file.name).put(file);
  
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) =>{
      var progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100
      this.setState({progress})
    },(error) =>{
      throw error
    },() =>{
      // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{
  
      uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
        this.setState({
          downloadURL: url
        })
      })
    document.getElementById("file").value = null
  
   }
  ) 
  }
  */

  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>My profile</h1>
        <div className={s.columns}>
          <div className={s.imageContainer}>
            <label className={s.label} htmlFor="nameValue">Profile picture</label>
            <div className={s.imageDiv}>
              <img className={s.profilePic} src={photo} alt='User profile'></img>
            </div>
            <input type="file" className={`w-100 btn btn-primary mb-3 ${s.colorBoton}`} onChange={changePhoto} accept="image/png, image/gif, image/jpeg, image/jpg" />
          </div>
          <div className={s.formContainer}>
            <form onSubmit={handleSubmit} className={s.infoForm}>
              <div className={errName ? '' : 'mb-3'}>
                <label className={s.label} htmlFor="nameValue">Name</label>
                <input id="nameValue" value={user.name} name='nameValue' onChange={handleChange} className={`form-control ${s.input} ${errName ? s.errorInput : ''}`} />
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

              <div className={errEmail ? '' : 'mb-3'}>
                <label className={s.label} htmlFor="emailValue">Email</label>
                <input id="emailValue" type='email' value={email} name='emailValue' onChange={handleChange} className={`form-control ${s.input} ${errEmail ? s.errorInput : ''}`} />
              </div>
              {errEmail ? <small className={s.error}>{errEmail}</small> : null}

              <div className={errPassword ? '' : 'mb-3'}>
                <label className={s.label} htmlFor="passValue">Password</label>
                <div className={s.test}>
                  <input id="passValue" value={password} name='passValue' type={showPassword ? 'text' : 'password'} onChange={handleChange} className={`form-control ${s.inputPassword} ${errPassword ? s.errorInput : ''}`} />
                  <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} className={s.iconDumb} onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)}></IonIcon>
                </div>
              </div>
              {errPassword ? <small className={s.error}>{errPassword}</small> : null}

              <input type="submit" value="Sign up" disabled={buttonState} className={`w-100 btn btn-primary mb-3 ${s.colorBoton}`} />
            </form>
          </div>


        </div>

      </div>
    </div>
  );
}
