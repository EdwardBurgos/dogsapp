import s from './About.module.css';
import { Link } from 'react-router-dom';
import React from 'react';
import photo from '../../img/photo.jpg'
export default function About() {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>About the creator</h1>
        <div className={s.photoContainer}>
          <img src={photo} alt="Edward Paolo Profile Pic" className={s.photo}></img>
        </div>
        <div className={s.description}>
          <p>My name is Edward Paolo Burgos Núñez. I am 21 years old. I am from Perú.</p>
          <p>I am a full stack developer passionate about developing functional products that provide a good user experience without neglecting the clean, organized, understandable and optimized code.</p>
          <p>I am currently working every single day in building apps for my portfolio to show the world my development capabilities.</p>
          <p>My complete tech stack is JavaScript | TypeScript | React.js | Redux.js | Node.js | Express.js | PostgreSQL | MySQL | Sequelize | HTML | CSS3</p>
          <p>I want to be part of a company that helps me grow as a person, expand my knowledge and improve my skills.</p>
          <p>You can check my projects in my <a href="https://github.com/EdwardBurgos" target="_blank" className={s.important}>GitHub Profile</a></p>
          <p>You can check my <a href="https://www.linkedin.com/in/edwardburgosdev/" target="_blank" className={s.important}>Linkedin Profile</a></p>
          <p>If you want to contact me send me a message through Linkedin or an email to <a href="https://mail.google.com/mail/u/0/?tab=rm#inbox?compose=new" target="_blank" className={s.important}>edwardpbn@gmail.com</a></p>
        </div>
      </div>
    </div>
    //     <div className={s.card}>
    //       <p className={s.title}>{name}</p>
    //       <img src={img} alt={name} width="100%"/>
    //       <div className={s.temperaments}>
    //       <span className={s.label}>Temperaments:</span> 
    //       <p>{temperament}</p>
    //       </div>
    //       <Link to={`/detail/${id}`}><button className={s.detailsButton}>See details</button></Link>
    //     </div>
  );
}

