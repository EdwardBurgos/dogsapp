import s from './Post.module.css';
import React, { useEffect, useState } from 'react';
import { heartOutline, heart, ellipsisHorizontal } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from '../../axiosInterceptor.js'
import { showMessage } from '../../extras/globalFunctions';
import { setUser, setPublicUser, setCurrentDog } from '../../actions';



export default function Post({ name, img, id, likesCount, owner, likes, origin, dog }) {
  // Redux states
  const user = useSelector(state => state.user)

  // Own states
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Variables
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // Functions

  // This function allows us to give like
  async function likeORdislike() {
    try {
      await axios.post(`/likes/${id}`)
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


  // setLikesTotal(post.data.likesCount);
  // setLikesGiven(post.data.likes);
  // setLiked(Object.keys(user).length && post.data.likes.filter(e => e.id === user.id).length)
  // if (like.data.includes('disliked')) {
  //   setLikesTotal(likesTotal - 1); return setLiked(false);
  // } else {
  //   setLikesTotal(likesTotal + 1); return setLiked(true)
  // }
  // } catch (e) {
  //   console.log(e)
  //   showMessage(e.response.data)
  // }

  return (
    <>
      <div id="parentContainer" className={origin === "publicProfile" ? s.post : s.postFullWidth}>
        <div className={s.firstRow}>
          <Link className={`${s.userInfoContainer} linkRR`} to={`/${owner.username}`}>
            <img className={s.profilePic} src={owner.profilepic} alt='User profile'></img>
            <span>{owner.fullname}</span>
          </Link>
          <IonIcon icon={ellipsisHorizontal} className={s.elipsis} onClick={() => setShowOptions(true)}></IonIcon>
        </div>
        <img className={s.image} src={img} alt={name} width="100%" />
        <IonIcon icon={Object.keys(user).length && likes.filter(e => e.id === user.id).length ? heart : heartOutline} className={Object.keys(user).length && likes.filter(e => e.id === user.id).length ? s.withLikes : s.withoutLikes} onClick={() => likeORdislike()}></IonIcon>
        <p className={s.likesTotal} onClick={() => setShowModal(true)}>{`${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}`}</p>
        <div className={s.lastRow}>
          <Link className={`${s.username} linkRR`} to={`/${owner.username}`}>{owner.username}</Link>
          <span>{`My dog's name is ${name}`}{origin === 'publicProfile' ? ['a', 'e', 'i', 'o', 'u'].includes(dog.name[0].toLowerCase()) ? ' and is an ' : ' and is a ' : ''}{origin === 'publicProfile' ? <Link to={`/detail/${dog.id}`} className={s.linkDetail}>{dog.name}</Link> : ''}</span>
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
              <Link className={`${i === 0 ? s.userInfoContainer : s.userInfoContainerModal} linkRR`} to={`/${e.username}`} key={i} onClick={() => setShowModal(false)}>
                <img className={s.profilePic} src={e.profilepic} alt='User profile'></img>
                <span>{e.fullname}</span>
              </Link>
            )
          }
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
                <div className={s.optionDelete} onClick={() => setShowDelete(true)}>Delete pet</div>
                <Link to={`/editPet/${id}`} className={`${s.option} linkRR`} >Edit pet</Link>
              </>
              : null
          }
          <div className={s.optionLast} onClick={() => {navigator.clipboard.writeText(`http://localhost:3000${location.pathname}`); setShowOptions(false); showMessage('Link copied to clipboard');}}>Copy link</div>
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
          <Modal.Title>Delete this pet?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this pet?
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

