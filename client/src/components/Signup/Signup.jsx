import { useEffect, useState } from 'react';
import logo from '../../img/logo.png';
import loading from '../../img/loadingGif.gif';
import { Link } from 'react-router-dom';
import { countries } from '../../extras/countries';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import s from './Signup.module.css';
import { eyeOutline, eyeOffOutline, alertCircleOutline } from "ionicons/icons";
import { IonIcon } from '@ionic/react';

export default function Signup(props) {
    // States
    const [fullName, setFullName] = useState('');
    const [errFullName, setErrFullName] = useState('');
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState(false)
    const [country, setCountry] = useState('');
    const [errCountry, setErrCountry] = useState('');
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
        switch (e.target.name) {
            case 'countryValue':
                !e.target.value ? setErrCountry('This field is required') : setErrCountry('')
                setCountry(e.target.value)
                break;
            case 'fullNameValue':
                !e.target.value ? setErrFullName('This field is required') : setErrFullName('')
                setFullName(e.target.value)
                break;
            case 'usernameValue':
                if (e.target.value) setDescription(false)
                setUsername(e.target.value)
                break;
            case 'emailValue':
                !e.target.value ? setErrEmail('This field is required') : (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value) ? setErrEmail('') : setErrEmail('Invalid email'))
                setEmail(e.target.value)
                break;
            case 'passValue':
                if (!e.target.value) {
                    setErrPassword('This field is required')
                } else {
                    e.target.value.length < 21 ?
                        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(e.target.value) ?
                            !/\s/.test(e.target.value) ?
                                setErrPassword('')
                                :
                                setErrPassword("The password can't contain white spaces")
                            :
                            setErrPassword('The password should have between 8 and 20 characters combining lowercase and uppercase letters, numbers and symbols')
                        :
                        setErrPassword("The password can't have more than 20 characters")
                }
                setPassword(e.target.value)
                break;
            default:
                break;
        }
    }

    // This function is executed on submit
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const login = await axios.post(`http://localhost:3001/api/login`, {
                mail: email,
                password: password
            }, { withCredentials: true })
            document.cookie = `token=${JSON.stringify(login.data.token)}`
            localStorage.setItem('login', 'true')
            // const user = await axios.post(`http://localhost:3001/api/verify`, {}, { headers: { Authorization: getCookieValue('token').replaceAll("\"", '') } })
            // if (user !== null) props.getUserLoged({ mail: user.data.mail, name: user.data.name, lastName: user.data.lastName })
            // console.log(store.getState())
            // const usuarioActualizado = await setRoleOfUser()
            // dispatch(modificarUsuarioLogueado(usuarioActualizado))
            // const clases = await axios.get(`http://localhost:3001/api/carrito/all/${usuarioActualizado[1].mail}`)
            history.push('/home')
        } catch (error) {
            //setWrongPassword(true)
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
        if (errFullName || errCountry || errEmail || errPassword || !fullName || !country || !email || !password) return setButtonState(true)
        return setButtonState(false)
    }, [errFullName, errCountry, errEmail, errPassword, fullName, country, email, password])

    return (
        <div className={s.container}>
            <div className={s.content}>
                {
                    country ?
                        <>
                            <div className={s.image}>
                                <img className={s.logo} src={logo} alt='logo' width="100%"></img>
                            </div>
                            <div className={s.form}>
                                <h1 className={s.title}>Sign up</h1>
                                <form onSubmit={handleSubmit} className={s.infoForm}>
                                    <div className={errFullName ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="fullNameValue">Full Name</label>
                                        <input id="fullNameValue" value={fullName} name='fullNameValue' onChange={handleChange} className={`form-control ${s.input}`} />
                                    </div>
                                    {errFullName ? <small className={s.error}>{errFullName}</small> : null}

                                    <div className={description ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="usernameValue">Username</label>
                                        <div className={s.test}>
                                            <input id="usernameValue" value={username} name='usernameValue' onChange={handleChange} className={`form-control ${s.inputPassword}`} />
                                            <IonIcon icon={alertCircleOutline} className={s.iconDumb} onClick={() => description ? setDescription(false) : setDescription(true)}></IonIcon>
                                        </div>

                                    </div>
                                    {description ? <small className={s.description}>This field is optional. If you leave it empty, we will assign you one after being registered. If you fill it, we will tell you if it is available.</small> : null}

                                    <div className={errCountry ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="countryValue">Country</label>
                                        <select id="countryValue" name='countryValue' onChange={handleChange} className={`form-control ${s.input}`}>
                                            {country ?
                                                countries.map(c => {
                                                    if (c === country) {
                                                        return <option selected value={c}>{c}</option>
                                                    } else {
                                                        return <option value={c}>{c}</option>
                                                    }
                                                })
                                                :
                                                countries.map(c => {
                                                    return <option value={c}>{c}</option>
                                                })}
                                        </select>
                                    </div>
                                    {errCountry ? <small className={s.error}>{errCountry}</small> : null}

                                    <div className={errEmail ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="emailValue">Email</label>
                                        <input id="emailValue" type='email' value={email} name='emailValue' onChange={handleChange} className={`form-control ${s.input}`} />
                                    </div>
                                    {errEmail ? <small className={s.error}>{errEmail}</small> : null}

                                    <div className={errPassword ? '' : 'mb-3'}>
                                        <label className={s.label} htmlFor="passValue">Password</label>
                                        <div className={s.test}>
                                            <input id="passValue" value={password} name='passValue' type={showPassword ? 'text' : 'password'} onChange={handleChange} className={`form-control ${s.inputPassword}`} />
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
                        <img className={s.loading} src={loading} alt='loadingGig' width="25%"></img>
                }
            </div>
        </div>
    )
}

