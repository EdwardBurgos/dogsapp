import { useEffect, useState } from 'react';
import logo from '../../img/logo.png';
import { Link } from 'react-router-dom'
import axios from '../../axiosInterceptor';
import { useHistory } from "react-router-dom";
import s from './Login.module.css';
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { IonIcon } from '@ionic/react';
import googleLogo from '../../img/googleLogo.png';
import { app, googleAuthProvider } from '../../extras/firebase.js';
import { Modal } from 'react-bootstrap'
import { countries } from '../../extras/countries';
import loading from '../../img/loadingGif.gif';
import { setLocalStorage } from '../../extras/globalFunctions';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../../actions';

toast.configure();

export default function Login() {
    // Own states
    const [emailUsername, setEmailUsername] = useState('');
    const [errEmailUsername, setErrEmailUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errPassword, setErrPassword] = useState('');
    const [wrongCredentials, setWrongCredentials] = useState('');
    const [errGlobal, setErrGlobal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [country, setCountry] = useState('');
    const [errCountry, setErrCountry] = useState('');
    const [buttonState, setButtonState] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [googleProfile, setGoogleProfile] = useState({});
    const [username, setUsername] = useState('');
    const [errUsername, setErrUsername] = useState('');
    const [modalButtonState, setModalButtonState] = useState(true);
    const [onlyPassword, setOnlyPassword] = useState(false);

    // Variables
    const history = useHistory();
    const dispatch = useDispatch();

    // Hooks

    // This hook set the country of the user
    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        async function getCountry() {
            try {
                const response = await axios.get('https://geolocation-db.com/json/', { cancelToken: source.token });
                throw 'ROSALÍA'
                setCountry(response.data.country_name);
            } catch (e) {
                if (e.message !== "Unmounted") setCountry('Select a country');
            }
        }
        getCountry();
        return () => source.cancel("Unmounted");
    }, [])

    // This hook manage the button state
    useEffect(() => {
        if (errEmailUsername || errPassword || !emailUsername || !password) return setButtonState(true);
        setWrongCredentials(false);
        setButtonState(false);
    }, [errEmailUsername, errPassword, emailUsername, password])


    // This hook manage the modal button state
    useEffect(() => {
        if (errUsername || errCountry || !username || country === "Select a country") return setModalButtonState(true);
        setModalButtonState(false);
    }, [errUsername, errCountry, username, country])

    // This hook update the states buttonState, password, errPassword and wrongCredentials when the form / onlyPassword value change
    useEffect(() => {
        setModalButtonState(false);
        setPassword('');
        setErrPassword('');
        setWrongCredentials('');
    }, [onlyPassword])

    // Functions

    // This function makes the form dynamic
    function handleChange(e) {
        const value = e.target.value;
        switch (e.target.name) {
            case 'emailUsernameValue':
                !value ? setErrEmailUsername('This field is required') : setErrEmailUsername('');
                return setEmailUsername(value)
            case 'passValue':
                if (!value) {
                    setErrPassword('This field is required')
                } else {
                    if (onlyPassword) {
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
                    } else {
                        setErrPassword('');
                    }
                }
                return setPassword(value)
            case 'usernameValue':
                !value ? setErrUsername('This field is required') : (value.length < 31 ? (/\s/.test(value) ? setErrUsername("The username can't contain white spaces") : (/^[a-z0-9._]+$/g.test(value) ? setErrUsername('') : setErrUsername("The username only can contains lowercase letters, numbers, points and subscripts"))) : setErrUsername("The username can't have more than 30 characters"))
                return setUsername(value)
            case 'countryValue':
                !value ? setErrCountry('This field is required') : value === "Select a country" ? setErrCountry('This field is required') : setErrCountry('')
                return setCountry(value)
            default:
                break;
        }
    }

    // This function allows us to use the toasts
    function showMessage(data) {
        toast(data, { position: toast.POSITION.BOTTOM_LEFT, pauseOnFocusLoss: false })
    }

    // This function allows us to login with Google
    async function loginConGoogle() {
        try {
            const googleLogin = await app.auth().signInWithPopup(googleAuthProvider);
            app.auth().signOut();
            if (Object.keys(googleLogin.additionalUserInfo.profile).length) {
                const email = googleLogin.additionalUserInfo.profile.email;
                const availableEmail = await axios.get(`http://localhost:3001/users/availableEmail/${email}`);
                if (availableEmail.status === 200) {
                    if (availableEmail.data) {
                        setGoogleProfile(googleLogin.additionalUserInfo.profile);
                        setShowModal(true);
                    } else {
                        const logged = await axios.post(`http://localhost:3001/users/login`, {
                            emailORusername: email,
                            password: '',
                            type: 'Google'
                        });
                        if (logged.status === 200) {
                            setLocalStorage(logged.data);
                            const infoReq = await axios.get('/users/info')
                            if (infoReq.status === 200) {
                                dispatch(setUser(infoReq.data.user))
                            } else {
                                dispatch(setUser({}))
                            }
                            showMessage(`${logged.data.user} your login was successful`);
                            history.push('/home');
                        } else {
                            return setErrGlobal('Sorry, an error occurred');
                        }
                    }
                } else { return setErrGlobal('Sorry, an error occurred'); }
            } else { return setErrGlobal('Sorry, an error occurred'); }
        } catch (e) { return setErrGlobal('Sorry, an error occurred'); }
    }

    // This function allows us to register and login with Google
    async function handleModalSubmit(e) {
        e.preventDefault();
        setShowModal(false);
        if (Object.keys(googleProfile).length) {
            try {
                let { name, given_name, family_name, picture, email } = googleProfile;
                const registered = await axios.post(`http://localhost:3001/users/register`, {
                    fullname: name,
                    name: given_name,
                    lastname: family_name,
                    profilepic: picture ? picture : "https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/defaultProfilePic.png?alt=media&token=77a0fa3a-c3e3-4e2a-ae91-ac2ffdadbba8",
                    username,
                    country,
                    email: email,
                    password: 'google',
                    type: 'Google'
                });
                if (registered.status === 200) {
                    showMessage(`${registered.data.user} your registration was successful`);
                    const logged = await axios.post(`http://localhost:3001/users/login`, {
                        emailORusername: email,
                        password: '',
                        type: 'Google'
                    });
                    if (logged.status === 200) {
                        setLocalStorage(logged.data);
                        const infoReq = await axios.get('/users/info')
                        if (infoReq.status === 200) {
                            dispatch(setUser(infoReq.data.user))
                        } else {
                            dispatch(setUser({}))
                        }
                        showMessage(`${logged.data.user} your login was successful`);
                        history.push('/home');
                    } else {
                        return setErrGlobal('Sorry, an error occurred');
                    }
                } else {
                    return setErrGlobal('Sorry, an error occurred');
                }

            } catch (e) {
                return setErrGlobal('Sorry, an error occurred');
            }
        } else {
            return setErrGlobal('Sorry, an error occurred');
        }
    }

    // This function allows us to login natively
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const login = await axios.post(`http://localhost:3001/users/login`, {
                emailORusername: emailUsername,
                password,
                type: 'Native'
            })
            if (login.status === 200) {
                setLocalStorage(login.data);
                const infoReq = await axios.get('/users/info')
                if (infoReq.status === 200) {
                    dispatch(setUser(infoReq.data.user))
                } else {
                    dispatch(setUser({}))
                }
                showMessage(`${login.data.user} your login was successful`);
                history.push('/home');
            } else {
                setButtonState(true);
                return setErrGlobal('Sorry, an error occurred');
            }
        } catch (e) {
            setButtonState(true);
            if (e.response.status === 403 && e.response.data.msg.includes('Google')) { setOnlyPassword(true); return setErrGlobal(e.response.data.msg) }
            if (e.response.status === 403 && e.response.data.msg === 'Incorrect password') return setWrongCredentials(e.response.data.msg);
            if (e.response.status === 404 && e.response.data.msg === 'There is no user registered with this email') return setWrongCredentials(e.response.data.msg)
            return setErrGlobal('Sorry, an error occurred');
        }
    }

    // This function allows us to change the password specifically when the user was registered with Google and do not have one
    async function handleSubmitOnlyPassword(e) {
        e.preventDefault();
        try {
            const login = await axios.post(`http://localhost:3001/users/changePassword`, {
                emailORusername: emailUsername,
                password,
            })
            if (login.status === 200) {
                setLocalStorage(login.data);
                const infoReq = await axios.get('/users/info')
                if (infoReq.status === 200) {
                    dispatch(setUser(infoReq.data.user))
                } else {
                    dispatch(setUser({}))
                }
                showMessage(`${login.data.user} your password was updated successfully`);
                showMessage(`${login.data.user} your login was successful`);
                history.push('/home');
            } else {
                setButtonState(true);
                return setErrGlobal('Sorry, an error occurred');
            }
        } catch (e) {
            setButtonState(true);
            if (e.response.status === 500 && e.response.data.msg === 'Password could not be updated') return setErrGlobal(e.response.data.msg);
            if (e.response.status === 404 && e.response.data.msg === 'There is no user registered with this email') return setWrongCredentials(e.response.data.msg)
            return setErrGlobal('Sorry, an error occurred');
        }
    }

    return (
        <div className={s.container}>
            {country ?
                <div className={s.content}>
                    <div className={s.image}>
                        <img className={s.logo} src={logo} alt='logo' width="100%"></img>
                    </div>
                    <div className={s.form}>
                        <h1 className={s.title}>Log in</h1>

                        <div className={s.errorGlobalContainer}>
                            {errGlobal ? <small className={s.errorGlobal}>{errGlobal}</small> : null}
                        </div>
                        {
                            onlyPassword ?
                                <form onSubmit={handleSubmitOnlyPassword}>
                                    <div className={errPassword ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="passValue">Password</label>
                                        <div className={s.test}>
                                            <input id="passValue" value={password} name='passValue' type={showPassword ? 'text' : 'password'} onChange={handleChange} className={`form-control ${s.inputPassword} ${errPassword ? s.errorInput : ''}`} />
                                            <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} className={s.iconDumb} onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)}></IonIcon>
                                        </div>
                                    </div>
                                    {errPassword ? <small className={s.error}>{errPassword}</small> : null}

                                    <input type="submit" value="Log in" disabled={buttonState} className={`w-100 btn btn-primary mb-3 ${s.colorBoton}`} />
                                </form>
                                :
                                <form onSubmit={handleSubmit}>
                                    <div className={errEmailUsername ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="emailUsernameValue">Email or username</label>
                                        <input id="emailUsernameValue" value={emailUsername} name='emailUsernameValue' onChange={handleChange} className={`form-control ${s.input} ${errEmailUsername ? s.errorInput : ''}`} />
                                    </div>
                                    {errEmailUsername ? <small className={s.error}>{errEmailUsername}</small> : null}

                                    <div className={errPassword ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="passValue">Password</label>
                                        <div className={s.test}>
                                            <input id="passValue" value={password} name='passValue' type={showPassword ? 'text' : 'password'} onChange={handleChange} className={`form-control ${s.inputPassword} ${errPassword ? s.errorInput : ''}`} />
                                            <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} className={s.iconDumb} onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)}></IonIcon>
                                        </div>
                                    </div>
                                    {errPassword ? <small className={s.error}>{errPassword}</small> : null}

                                    <input type="submit" value="Log in" disabled={buttonState} className={`w-100 btn btn-primary mb-3 ${s.colorBoton}`} />

                                    {wrongCredentials ?
                                        <div className={s.center}>
                                            <small className={s.errorMessage}>{wrongCredentials}</small>
                                        </div>
                                        :
                                        null
                                    }
                                </form>
                        }

                        <div className={s.division}>
                            <span>Or</span>
                        </div>

                        {onlyPassword ?
                            <div className={`w-100 btn ${s.loginOtherEmail}`} onClick={() => { setEmailUsername(''); setErrEmailUsername(''); setErrGlobal(''); setOnlyPassword(false); }}>
                                <span>Log in with other email</span>
                            </div>
                            :
                            null
                        }

                        <div className={`w-100 btn ${s.loginButton}`} onClick={loginConGoogle}>
                            <img src={googleLogo} className={s.loginLogo} alt='Google Logo'></img>
                            <span>Log in with Google</span>
                        </div>

                        <p className={s.marginBottom0}>
                            Don't have an account?
                            <Link className={s.registroLink} to="/signup">
                                Sign up
                            </Link>
                        </p>
                    </div>
                    <Modal
                        show={showModal}
                        backdrop="static"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        keyboard={false}
                    >
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Complete this form
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleModalSubmit}>
                                <div className={errUsername ? '' : 'mb-3'}>
                                    <label className={s.label} htmlFor="usernameValue">Username</label>
                                    <input id="usernameValue" value={username} name='usernameValue' onChange={handleChange} className={`form-control ${s.input} ${errUsername ? s.errorInput : ''}`} />
                                </div>
                                {errUsername ? <small className={s.error}>{errUsername}</small> : null}

                                <div className={errCountry ? '' : 'mb-3'}>
                                    <label className={s.label} htmlFor="countryValue">Country</label>
                                    <select id="countryValue" name='countryValue' value={country} onChange={handleChange} className={`form-control ${s.input}`}>
                                        <option key="Select a country" value="Select a country">Select a country</option>
                                        {countries.map(c => {
                                            return <option key={c} value={c}>{c}</option>
                                        })}
                                    </select>
                                </div>
                                {errCountry ? <small className={s.error}>{errCountry}</small> : null}

                                <input type="submit" value="Log in" disabled={modalButtonState} className={`w-100 btn btn-primary mb-3 ${s.colorBoton}`} />
                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
                :
                <div className={s.contentCenter}>
                    <img className={s.loading} src={loading} alt='loadingGif'></img>
                </div>
            }
        </div>
    )
}