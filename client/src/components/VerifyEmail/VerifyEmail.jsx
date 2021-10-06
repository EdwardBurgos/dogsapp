import s from './VerifyEmail.module.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import { setLocalStorage, getCountry, getUserInfo, showMessage } from '../../extras/globalFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../actions';
import axios from '../../axiosInterceptor';
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { IonIcon } from '@ionic/react';


export default function VerifyEmail({ token, reason, expires }) {


    // `${url}/${reason}/${token.token}?expires=${token.expires}`

    // Variables
    const history = useHistory();
    const dispatch = useDispatch();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [errNewPassword, setErrNewPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    // const user = useSelector(state => state.user)

    // Hooks
    useEffect(() => {
        async function loginUser() {
            if (token && expires) {
                try {
                    setLocalStorage({ token, expiresIn: expires });
                    const user = await getUserInfo();
                    if (reason !== 'resetPassword') {
                        if (reason === 'verifyEmail') await axios.put('/users/verifyUser', { email: user.email })
                        dispatch(setUser(user))
                        history.push('/home')
                    } else {
                        setUserInfo(user)
                    }
                } catch (e) {
                    showMessage('Sorry, an error ocurred during your account verification')
                }

            }
        }
        loginUser()
    }, [])

    // This function allows us to handle the changes in the form
    function handleChange(e) {
        const value = e.target.value;
        if (!value) {
            setErrNewPassword('This field is required');
        } else {
            value.length < 21 ?
                /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(value) ?
                    !/\s/.test(value) ?
                        setErrNewPassword('')
                        :
                        setErrNewPassword("The password can't contain white spaces")
                    :
                    setErrNewPassword('The password should have between 8 and 20 characters combining lowercase and uppercase letters, numbers and symbols')
                :
                setErrNewPassword("The password can't have more than 20 characters")
        }
        return setNewPassword(value)
    }

    async function changePassword(e) {
        e.preventDefault()
        const login = await axios.post(`/users/changePassword`, {
            emailORusername: userInfo.email,
            password: newPassword
        })
        showMessage(`${login.data.user} your password was updated successfully`);
        showMessage(`${login.data.user} your login was successful`);
        setLocalStorage(login.data);
        const user = await getUserInfo();
        dispatch(setUser(user))
        history.push('/home');
    }

    return (
        <>
            {
                reason !== 'resetPassword' ?
                    <h1>{reason.toUpperCase()}</h1>
                    :
                    <div className={s.container}>
                        <form onSubmit={changePassword} className={s.form}>
                            <div className={errNewPassword ? '' : 'mb-3'}>
                                <label className={s.label} htmlFor="passNewValue">New password</label>
                                <div className={s.test}>
                                    <input id="passNewValue" value={newPassword} name='passNewValue' type={showNewPassword ? 'text' : 'password'} onChange={handleChange} className={`form-control ${s.inputPassword} ${errNewPassword ? s.errorInput : ''}`} />
                                    <IonIcon icon={showNewPassword ? eyeOutline : eyeOffOutline} className={s.iconDumb} onClick={() => showNewPassword ? setShowNewPassword(false) : setShowNewPassword(true)}></IonIcon>
                                </div>
                            </div>
                            {errNewPassword ? <small className={s.error}>{errNewPassword}</small> : null}
                            <input type="submit" value="Confirm password" disabled={!newPassword || errNewPassword} className={`w-100 btn btn-primary`} />
                        </form>
                    </div>
            }
        </>
    );
}

