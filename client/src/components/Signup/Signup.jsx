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

toast.configure();

export default function Signup(props) {
    // States
    const [errGlobal, setErrGlobal] = useState('');
    const [fullname, setFullname] = useState('');
    const [errFullname, setErrFullname] = useState('');
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

    // This function validate the form in every change done by the user 
    function handleChange(e) {
        const value = e.target.value;
        switch (e.target.name) {
            case 'fullnameValue':
                !value ? setErrFullname('This field is required') : setErrFullname('')
                return setFullname(value)
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

    function showMessage(data) {
        toast(data, { position: toast.POSITION.BOTTOM_LEFT, pauseOnFocusLoss: false })
    }

    // This function is executed on submit
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const availableUsername = await axios.post(`http://localhost:3001/users/register`, {
                fullname,
                username,
                country,
                email,
                password
            });
            if (availableUsername.status === 200) {
                showMessage(availableUsername.data);
                history.push('/home');
            }
        } catch (e) {
            if (e.response.status === 409 && e.response.data === 'There is already a user with this email') return setErrEmail(e.response.data)
            if (e.response.status === 409 && e.response.data === 'There is already a user with this username') return setErrUsername(e.response.data)
            return setErrGlobal('Sorry, an error occurred');
        }
    }

    // This hook set the country of the user
    useEffect(() => {
        async function getCountry() {
            const response = await axios.get('https://geolocation-db.com/json/');
            if (response) { setCountry(response.data.country_name); }
        }
        getCountry();
    }, [])

    // This hook 
    useEffect(() => {
        if (errFullname || errUsername || errEmail || errPassword || !fullname || !username || !email || !password) return setButtonState(true)
        return setButtonState(false)
    }, [errFullname, errUsername, errEmail, errPassword, fullname, username, email, password])

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
                                <div className={errFullname ? '' : 'mb-3'}>
                                    <label className={s.label} htmlFor="fullnameValue">Full Name</label>
                                    <input id="fullnameValue" value={fullname} name='fullnameValue' onChange={handleChange} className={`form-control ${s.input} ${errFullname ? s.errorInput : ''}`} />
                                </div>
                                {errFullname ? <small className={s.error}>{errFullname}</small> : null}

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
                    <img className={s.loading} src={loading} alt='loadingGif' width="25%"></img>
                }
            </div>
        </div>
    )
}

