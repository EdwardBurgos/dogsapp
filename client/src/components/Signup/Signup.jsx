import { useEffect, useRef, useState } from 'react';
import { bindActionCreators } from "redux";
import logo from '../../img/logo.png';
import { Link } from 'react-router-dom';
import {countries} from '../../extras/countries';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { connect, useDispatch, useSelector } from 'react-redux'
import { getUserLoged, modificarUsuarioLogueado } from '../../actions';
import s from './Signup.module.css';
import { eyeOutline, eyeOffOutline, alertCircleOutline } from "ionicons/icons";
import { IonIcon } from '@ionic/react';
// import Swal from 'sweetalert2';
// import getCookieValue from '../../cookieParser';

export default function Signup(props) {
    const [fullName, setFullName] = useState('');
    const [errFullName, setErrFullName] = useState('');
    const [username, setUsername] = useState('');
    const [country, setCountry] = useState('');
    const [errCountry, setErrCountry] = useState('');

    const [email, setEmail] = useState('');

    const [description, setDescription] = useState(false)
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: null, password: null })
    const [wrongPassword, setWrongPassword] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const usuario = useSelector(state => state['user'])
    const history = useHistory();
    const dispatch = useDispatch();

    function validateErrors() {
        if (!email) {
            //email, a pesar de estar vacío y entrar a esta validación, no cambia el estado
            setErrors({ ...errors, email: 'Se necesita un E-mail' })
        } else if (!/\S+@{1}[a-zA-Z]+\.{1}[a-z]{3}\.?[a-z]*/gm.test(email)) {
            setErrors({ ...errors, email: 'E-mail inválido' })
        } else {
            setErrors({ ...errors, email: null })
        }
        if (!/[\S]/.test(password)) {
            setErrors({ ...errors, password: 'No puede contener espacio blanco' })
        } else if (password.length < 4 || password.length > 20) {
            setErrors({ ...errors, password: 'La contraseña debe tener de 4 a 20 caracteres' })
        } else {
            setErrors({ ...errors, password: null })
        }
    }

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
                !e.target.value ? setDescription(true) : setDescription(false)
                setUsername(e.target.value)
                break;
            case 'emailValue':
                setEmail(e.target.value)
                break;
            case 'passValue':
                setPassword(e.target.value)
                break;
            default:
                break;
        }
        validateErrors();

    }

    async function handleSubmit(e) {
        e.preventDefault()
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
            setWrongPassword(true)
        }
    }

    const inputRef = useRef()
    const eyeRef = useRef()

    function myFunction() {
        let showPassword = inputRef.current
        let eye = eyeRef.current

        if (showPassword && showPassword.type === "password") {
            showPassword.type = "text";
            eye.icon = eyeOutline;
        } else {
            showPassword.type = "password";
            eye.icon = eyeOffOutline;
        }
    }

    return (
        <div className={s.container}>
            <div className={s.content}>
                <div className={s.image}>
                    <img className={s.logo} src={logo} alt='logo' width="100%"></img>
                </div>
                <div className={s.form}>
                    <form onSubmit={handleSubmit}>
                        <h1 className={s.title}>Sign up</h1>
                        <div className={`form-floating ${errFullName ? '' : 'mb-3'}`}>
                            <input value={fullName} name='fullNameValue' onChange={handleChange} placeholder='Full Name' className={`form-control ${s.input}`} />
                            <label htmlFor="floatingInput">Full Name</label>
                        </div>
                        {errFullName ? <small className={s.error}>{errFullName}</small> : null}

                        <div className={`form-floating ${s.test} ${description ? '' : 'mb-3'}`}>
                            <input value={username} name='usernameValue' onChange={handleChange} placeholder='Username'  className={`form-control ${s.inputPassword}`} />
                            <label htmlFor="floatingInput">Username</label>
                            <IonIcon icon={alertCircleOutline} className={s.iconDumb} onClick={() => description ? setDescription(false) : setDescription(true)}></IonIcon>
                        </div>
                        {description ? <small className={s.description}>This field is optional if you leave it empty we will assign you one after being registered</small> : null}
                        
                        <div className="form-floating">
                            <select name='countryValue' onChange={handleChange} placeholder='Country' className={`form-control mb-3 ${s.input}`}>
                            <option selected value=''>Select your country</option>
                            {countries.map(c => {
                                return <option value={c}>{c}</option>
                            })}
                            </select>
                            <label htmlFor="floatingInput">Country</label>
                        </div>
                        {errCountry ? <small className={s.error}>{errCountry}</small> : null}

                        <div className="form-floating">
                            <input type='email' value={email} name='emailValue' onChange={handleChange} placeholder='Email' className={`form-control mb-3 ${s.input}`} />
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                        
                        <div className={`form-floating ${s.test}`} >
                            <input className={s.inputMargin} ref={inputRef} type='password' value={password} name='passValue' onChange={handleChange} placeholder='Contraseña' className={`form-control mb-3 ${s.inputPassword}`} />
                            <label htmlFor="floatingPassword">Password</label>
                            {/* <i style={eyeTest} ref={eyeRef} className="fa fa-eye-slash" onClick={() => myFunction()}></i> */}
                            <IonIcon ref={eyeRef} icon={eyeOutline} className={s.iconDumb} onClick={() => myFunction()}></IonIcon>
                        </div>
                        <input type="submit" value="Sign up" className={`w-100 btn btn-primary mb-3 ${s.colorBoton}`} />
                        <p className={s.marginBottom0}>
                            Already have an account?
                            <Link className={s.registroLink} to='/login'>
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}


// export default connect(null, mapDispatchToProps)(Signup)
// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({ getUserLoged }, dispatch);
// }

