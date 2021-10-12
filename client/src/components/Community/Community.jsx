import s from './Community.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../axiosInterceptor';
import Loading from '../Loading/Loading';
import CommunityMember from '../CommunityMember/CommunityMember';
import { countries } from '../../extras/countries';

export default function Community() {

  // Own states
  const [errGlobal, setErrGlobal] = useState('');
  const [users, setUsers] = useState([])

  // Hooks

  // This hook allows us to get the community
  useEffect(() => {
    let flags = {};
    require.context('../../img/svg', false, /\.(svg)$/).keys().forEach((item, index) => { flags[item.replace('./', '')] = require.context('../../img/svg', false, /\.(svg)$/)(item); });
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function getCommunity() {
      try {
        const users = await axios.get(`/users/communityAll`, { cancelToken: source.token })
        setUsers(users.data.map(e => { return { ...e, flag: flags[`${countries.filter(country => country.name === e.country)[0].code.toLowerCase()}.svg`].default } }))
      } catch (e) {
        if (e.message !== "Unmounted") {
          setErrGlobal(e.response.data)
        }
      }
    }
    getCommunity();
    return () => source.cancel("Unmounted");
  }, [])

  return (
    <div className={s.container}>
      {
        errGlobal ?
          <div className={s.contentCenter}>
            <p className={s.errorGlobal}>{errGlobal}</p>
          </div>
          :
          users.length ?
            <>
              <h1>Community</h1>
              <div className={s.content}>
                <div className={s.cardsContainer}>
                  {users.map((e, i) => <CommunityMember key={i} fullname={e.fullname} profilepic={e.profilepic} username={e.username} country={e.country} flag={e.flag} />)}
                </div>
              </div>
            </>
            :
            <Loading />
      }
    </div>
  );
}