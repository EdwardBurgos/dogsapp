import s from './VerifyEmail.module.css';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import { setLocalStorage, getCountry, getUserInfo, showMessage } from '../../extras/globalFunctions';
import { useDispatch } from 'react-redux';
import { setUser } from '../../actions';
import axios from '../../axiosInterceptor';


export default function VerifyEmail({ token, expires }) {

    // Variables
    const history = useHistory();
    const dispatch = useDispatch();

    // Hooks
    useEffect(() => {
        async function loginUser() {
            if (token && expires) {
                try {
                    setLocalStorage({ token, expiresIn: expires });
                    const user = await getUserInfo();
                    dispatch(setUser(user))
                    await axios.put('/users/verifyUser', { email: user.email })
                    history.push('/home')
                } catch (e) {
                    showMessage('Sorry, an error ocurred during your account verification')
                }
                
            }
        }
        loginUser()
    }, [])



    return (
        <h1>ROSALÍA</h1>
    );
}

