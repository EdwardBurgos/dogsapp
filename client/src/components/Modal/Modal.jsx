// <!-- The Modal -->
// <div id="myModal" class="modal">

//   <!-- Modal content -->
//   <div class="modal-content">
//     <span class="close">&times;</span>
//     <p>Some text in the Modal..</p>
//   </div>

// </div>
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from './Modal.module.css';
import { Link } from 'react-router-dom';
import {deleteCreationMessage}  from '../../actions'
import React from 'react';

export default function Modal({content}) {
//     // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
//   }
  
//   // When the user clicks anywhere outside of the modal, close it
//   window.onclick = function(event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//     }
//   }
    const [display, setDisplay] = useState('block');
    const modalStyle = {
        display: `${display}`
    }
    const dispatch = useDispatch();
    const creationMessageRedux = useSelector(state => state.creationMessage);
    return (
        <div id="myModal" className={s.modal} style={modalStyle}>
            <div className={s.modalContent}>
                <span className={s.close} onClick={e => setDisplay('none')}>&times;</span>
                <p>{creationMessageRedux.message}</p>
                <button className={s.marginRight} onClick={e => {e.preventDefault(); dispatch(deleteCreationMessage())}}>REGISTER A NEW BREED</button>
                <Link to={`/detail/${creationMessageRedux.id}`}><button>VIEW CREATED BREED</button></Link>
            </div>
        </div>
    );
}
