import s from './NotFound.module.css';
import React from 'react';
import logo from '../../img/notFound.svg';


export default function NotFound() {

    return (
        <div className={s.container}>
            <div className={s.content}>
            <div className={s.image}>
            <img className={s.logo} src={logo} alt='logo'></img>
            </div>
            <h1 className={s.title}>Sorry, this page does not exist</h1>
            </div>
        </div>
    );
}

