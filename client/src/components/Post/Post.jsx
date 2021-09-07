import s from './Post.module.css';
import React, { useEffect, useState } from 'react';
import { heartOutline, heart, ellipsisHorizontal } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from '../../axiosInterceptor.js'
import { showMessage, getUserInfo } from '../../extras/globalFunctions';
import { setUser, setPublicUser, setCurrentDog } from '../../actions';



export default function Post({ name, img, id, likesCount, owner, likes, origin, dog }) {
  // Redux states
  const user = useSelector(state => state.user)

  // Own states
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [targetOrigin, setTargetOrigin] = useState('');

  // Variables
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // Functions

  // This function allows us to handle the clicks on the post
  function handleClick(e) {
    const elementId = e.target.id;
    if (['ownerInfo', 'ownerInfoPhoto', 'ownerInfoName', 'ownerUsername', 'ownerUsername', 'breed'].includes(elementId)) return;
    if (elementId === 'elipsis') return setShowOptions(true);
    if (elementId === 'likeIcon') return;
    if (elementId === 'likesTotal') { setTargetOrigin('likesInfo'); return Object.keys(user).length ? setShowModal(true) : setUnauthorized(true); }
    if (elementId === 'userInfo') return setShowModal(false);
    history.push(`/pet/${id}`)
  }

  // This function allows us to give like
  async function likeORdislike() {
    try {
      await axios.post(`/likes/${id}`)
      const user = await getUserInfo();
      dispatch(setUser(user));
      if (origin === 'publicProfile') {
        const publicUser = await axios.get(`/users${location.pathname}`)
        dispatch(setPublicUser(publicUser.data))
      } else {
        const currentDog = await axios.get(`/dogs${location.pathname.slice(7)}`);
        dispatch(setCurrentDog(currentDog.data));
      }
    } catch (e) {
      showMessage(e.response.data)
    }
  }

  // This funtion allows us to delete a pet
  async function deletePet() {
    try {
      const deletedPet = await axios.delete(`/pets/${id}`)
      if (origin === 'publicProfile') {
        const publicUser = await axios.get(`/users${location.pathname}`)
        dispatch(setPublicUser(publicUser.data))
      } else {
        const currentDog = await axios.get(`/dogs${location.pathname.slice(7)}`);
        dispatch(setCurrentDog(currentDog.data));
      }
      showMessage(deletedPet.data);
    } catch (e) {
      showMessage(e.response.data)
    }

  }

  return (
    <>
      <div id="parentContainer" className={origin === "publicProfile" ? s.post : s.postFullWidth} onClick={handleClick}>
        <div className={s.firstRow}>
          <Link id='ownerInfo' className={`${s.userInfoContainer} linkRR ${s.boldWeight}`} to={`/${owner.username}`} onClick={handleClick}>
            <img className={s.profilePic} src={owner.profilepic} alt='User profile' id='ownerInfoPhoto' onClick={handleClick}></img>
            <span id='ownerInfoName' onClick={handleClick}>{owner.fullname}</span>
          </Link>
          <IonIcon id='elipsis' icon={ellipsisHorizontal} className={s.elipsis} onClick={handleClick}></IonIcon>
        </div>
        <img className={s.image} src={img} alt={name} width="100%" />
        <IonIcon id='likeIcon' icon={Object.keys(user).length && user.likes.includes(parseInt(id)) ? heart : heartOutline} className={Object.keys(user).length && user.likes.includes(parseInt(id)) ? s.withLikes : s.withoutLikes} onClick={e => { setTargetOrigin('giveLike'); Object.keys(user).length ? likeORdislike() : setUnauthorized(true); handleClick(e) }}></IonIcon>
        <p id='likesTotal' className={s.likesTotal} onClick={handleClick}>{`${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}`}</p>
        <div className={s.lastRow}>
          <Link id='ownerUsername' className={`${s.username} linkRR`} to={`/${owner.username}`} onClick={handleClick}>{owner.username}</Link>
          <span>{`My dog's name is ${name}`}{origin === 'publicProfile' ? ['a', 'e', 'i', 'o', 'u'].includes(dog.name[0].toLowerCase()) ? ' and is an ' : ' and is a ' : ''}{origin === 'publicProfile' ? <Link id='breed' to={`/detail/${dog.id}`} className={s.linkDetail} onClick={handleClick}>{dog.name}</Link> : ''}</span>
        </div>
      </div>

      <Modal
        show={showModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Likes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            likes.map((e, i) =>
              <Link id='userInfo' className={`${i === 0 ? s.userInfoContainer : s.userInfoContainerModal} linkRR`} to={`/${e.username}`} key={i} onClick={handleClick}>
                <img className={s.profilePic} src={e.profilepic} alt='User profile'></img>
                <span>{e.fullname}</span>
              </Link>
            )
          }
        </Modal.Body>
      </Modal>

      <Modal
        show={unauthorized}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
        onHide={() => setUnauthorized(false)}
      >
        <Modal.Header>
          <Modal.Title>{targetOrigin === 'likesInfo' ? 'You need to be login to see the likes given to this pet' : 'Sorry, you need to be logged in to like a pet'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={s.centeredInfoModal}>
          <Link to='login' className='btn btn-primary w-100'>Log in</Link>
        </Modal.Body>
      </Modal>

      <Modal
        show={showOptions}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
        onHide={() => setShowOptions(false)}
      >
        <Modal.Body className={s.optionsModal}>
          {
            Object.keys(user).length && user.pets.includes(id) ?
              <>
                <div className={s.optionDelete} onClick={() => setShowDelete(true)}>Delete {name}</div>
                <Link to={`/editPet/${id}`} className={`${s.option} linkRR`} >Edit {name}</Link>
              </>
              : null
          }
          <div className={s.optionLast} onClick={() => { navigator.clipboard.writeText(`http://localhost:3000/pet/${id}`); setShowOptions(false); showMessage('Link copied to clipboard'); }}>Copy link</div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showDelete}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => setShowDelete(false)}
      >
        <Modal.Header>
          <Modal.Title>Delete {name}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDelete(false); setShowOptions(false) }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { deletePet(); setShowDelete(false); setShowOptions(false) }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

