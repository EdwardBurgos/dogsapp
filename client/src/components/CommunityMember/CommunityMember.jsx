import s from './CommunityMember.module.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function CommunityMember({ fullname, profilepic, username, country, flag }) {

  return (
    <Link to={`/${username}`} className={`${s.card} linkRR`}>
      <div className={s.infoContainer}>
        <div className={s.flagContainer}>
          <img className={s.flag} src={flag} alt={`${country} flag`} />
        </div>
        <div className={s.dataContainer}>
          <p className='mb-0'>{fullname}</p>
          <p className='mb-0'>{username}</p>
          <p className='mb-0'>{country}</p>
        </div>
      </div>
      <img className={s.image} src={profilepic} alt={username} />
    </Link>
  );
}

