import { useEffect, useState } from 'react';
import logo from '../../img/logo.png';
import loading from '../../img/loadingGif.gif';
import { Link } from 'react-router-dom';
import { countries } from '../../extras/countries';
import axios from 'axios';
import s from './Signup.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { IonIcon } from '@ionic/react';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { setLocalStorage } from '../../extras/globalFunctions';

toast.configure();

export default function Signup(props) {
    // Own states
    const [errGlobal, setErrGlobal] = useState('');
    const [name, setName] = useState('');
    const [errName, setErrName] = useState('');
    const [lastname, setLastname] = useState('');
    const [errLastname, setErrLastname] = useState('');
    const [username, setUsername] = useState('');
    const [errUsername, setErrUsername] = useState(false);
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [errEmail, setErrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errPassword, setErrPassword] = useState('');
    const [buttonState, setButtonState] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    // Variables
    const history = useHistory();

    // Hooks 

    // This hook set the country of the user
    useEffect(() => {
        async function getCountry() {
            const response = await axios.get('https://geolocation-db.com/json/');
            if (response) { setCountry(response.data.country_name); }
        }
        getCountry();
    }, [])

    // This hook manage the button state
    useEffect(() => {
        if (errName || errLastname || errUsername || errEmail || errPassword || !name || !lastname || !username || !email || !password) return setButtonState(true)
        return setButtonState(false)
    }, [errName, errLastname, errUsername, errEmail, errPassword, name, lastname, username, email, password])

    // Functions 

    // This function make the form dynamic
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

    // This function allows us to use the toasts
    function showMessage(data) {
        toast(data, { position: toast.POSITION.BOTTOM_LEFT, pauseOnFocusLoss: false })
    }

    // This function allows us to register and login natively
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const availableUsername = await axios.post(`http://localhost:3001/users/register`, {
                fullname: `${name} ${lastname}`,
                name,
                lastname,
                profilepic: 'https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/defaultProfilePic.png?alt=media&token=77a0fa3a-c3e3-4e2a-ae91-ac2ffdadbba8',
                username,
                country,
                email,
                password,
                type: 'Native'
            });
            if (availableUsername.status === 200) {
                showMessage(`${availableUsername.data.user} your registration was successful`);
                const login = await axios.post(`http://localhost:3001/users/login`, {
                    emailORusername: email,
                    password,
                    type: 'Native'
                })
                if (login.status === 200) {
                    setLocalStorage(login.data);
                    showMessage(`${login.data.user} your login was successful`);
                    history.push('/home');
                } else {
                    setButtonState(true);
                    return setErrGlobal('Sorry, an error occurred');
                }
            } else {
                setButtonState(true);
                return setErrGlobal('Sorry, an error occurred');
            }
        } catch (e) {
            setButtonState(true);
            if (e.response.status === 409 && e.response.data.msg.includes('email')) return setErrEmail(e.response.data.msg);
            if (e.response.status === 409 && e.response.data.msg.includes('username')) return setErrUsername(e.response.data.msg);
            return setErrGlobal('Sorry, an error occurred');
        }
    }

    return (
        <div className={s.container}>
            <div className={s.content}>
                {country ?
                    <>
                        <div className={s.image}>
                            <img className={s.logo} src={logo} alt='logo' width="100%"></img>
                        </div>
                        <div className={s.form}>
                            <h1 className={s.title}>Sign up</h1>
                            {errGlobal ? <small className={s.errorGlobal}>{errGlobal}</small> : null}
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
                            <p className={s.marginBottom0}>
                                Already have an account?
                                <Link className={s.registroLink} to='/login'>
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </>
                    :
                    <img className={s.loading} src={loading} alt='loadingGif'></img>
                }
            </div>
        </div>
    )
}

