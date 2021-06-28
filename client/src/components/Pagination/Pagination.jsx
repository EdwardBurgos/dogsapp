import s from './Pagination.module.css';
//import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react';
import { changePage } from '../../actions';


export default function Pagination() {
    // Dispatch
    const dispatch = useDispatch();

    // Global state of the result to show
    const finalResultRedux = useSelector(state => state.finalResult);

    // Buttons of the pagination 
    const [items, setItems] = useState([])


    useEffect(() => {
        dispatch(changePage(finalResultRedux.slice(0, 8)))

        function reRender(actualElement, direction) {
            let number;
            if (direction === 'right') {number = parseInt(actualElement.id.replace(/[^0-9]/g, '')) + 1;}
            else {number = parseInt(actualElement.id.replace(/[^0-9]/g, '')) - 5;}
            //let number = parseInt(actualElement.id.replace(/[^0-9]/g, '')) + 1;

            console.log(number)
            dispatch(changePage(finalResultRedux.slice((number - 1) * 8, number * 8)))
            //console.log( actualElement.nextSibling)
            //actualElement.nextSibling.className = s.active;

            // let number = parseInt(actualElement.id.replace(/[^0-9]/g, ''));
            //console.log(number)
            //console.log(actualElement.id)
            let newItems = [];
            const pages = Math.ceil(finalResultRedux.length / 8);
            let totalElements = pages + 3;
            /*  const pages = Math.ceil(finalResultRedux.length / 8);
              let points = false;
              let totalElements = pages + 3;
              if (pages >= 8) { points = true; }*/
              console.log(newItems)
            for (let i = 0; i <= totalElements; i++) {
                if (!i) { newItems.push(<button key="first" id="first" onClick={e => navigate(e, "first")}>&laquo;</button>); }
                else if (i === 1) { newItems.push(<button key="prev" id="prev" onClick={e => navigate(e, "prev")}>&lt;</button>); }
                else if (i === 2) { newItems.push(<button key="pointsInit" disabled id="reRenderLeft">...</button>) }
                else if (i === 3 && direction === "right") { newItems.push(<button key={number} id={`link${number}`} className={s.active} onClick={e => changePageFunction(e)}>{number}</button>); }
                else if (i === 7 && direction === "left") { newItems.push(<button key={number + 4} id={`link${number + 4}`} className={s.active} onClick={e => changePageFunction(e)}>{number + 4}</button>); }
                else if (i === totalElements - 2 && pages > number + 4) { newItems.push(<button key="pointsEnd" disabled id="reRenderRight">...</button>) }
                else if (i === totalElements - 1) { newItems.push(<button key="next" id="next" onClick={e => navigate(e, "next")}>&gt;</button>); }
                else if (i === totalElements) { newItems.push(<button key="last" id="last" onClick={e => navigate(e, "last")}>&raquo;</button>); }
                // else if (points && i === 5) { newItems.push(<button key="middle" disabled id="reRender">...</button>) }
                // else if (number + (i - 3) !== pages) {
                //     if (i === totalElements - 2) { newItems.push(<button key="pointsEnd" disabled id="reRenderTwo">...</button>) }

                    // i number pages


                // } 
                else if (i > 3 && i < 8 && number + (i - 3) <= pages) {
                    newItems.push(<button key={number + (i - 3)} id={`link${number + (i - 3)}`} onClick={e => changePageFunction(e)}>{number + (i - 3)}</button>);}
                //     if (i === totalElements - 2) { newItems.push(<button key="pointsEnd" disabled id="reRenderTwo">...</button>) }
        
                        // } 
            }
            setItems(newItems)
        }

        function changePageFunction(e, notEvent) {
            if (!notEvent) { e.preventDefault(); e = e.target }
            let siblings = e.parentNode.children;
            for (let i = 0; i < siblings.length; i++) {
                siblings[i].className = '';
            }
            let number = parseInt(e.id.replace(/[^0-9]/g, '')) * 8;
            if (!isNaN(number)) {
                if (number === 8) { document.getElementById('first').disabled = true; document.getElementById('prev').disabled = true; }
                else { document.getElementById('first').disabled = false; document.getElementById('prev').disabled = false; }
                if (number >= finalResultRedux.length) { document.getElementById('last').disabled = true; document.getElementById('next').disabled = true; }
                else { document.getElementById('last').disabled = false; document.getElementById('next').disabled = false; }
                dispatch(changePage(finalResultRedux.slice(number - 8, number)))
                e.className = s.active;
            }
        }

        function navigate(e, direction) {
            e.preventDefault();
            if (direction === 'next') {
                let actual = document.getElementsByClassName(s.active)[0];
                switch (actual.nextSibling.id) {
                    case 'reRender':
                    case 'reRenderRight':
                        return reRender(actual, 'right');
                    default:
                        changePageFunction(actual.nextSibling, true)
                }
            }
            if (direction === 'prev') {
                let actual = document.getElementsByClassName(s.active)[0];
                switch (actual.previousSibling.id) {
                    case 'reRender':
                    case 'reRenderLeft':
                        return reRender(actual, 'left');
                    default:
                        changePageFunction(actual.previousSibling, true)
                }
            }
            if (direction === 'first') { changePageFunction(e.target.parentNode.children[2], true); }
            if (direction === 'last') changePageFunction(e.target.parentNode.children[e.target.parentNode.children.length - 3], true)
        }

        // Operating logic
        let itemsFake = [];
        const pages = Math.ceil(finalResultRedux.length / 8);
        if (pages === 1) { return setItems(<button key='1' className={s.active} id='link1' disabled>1</button>) }
        let points = false;
        let totalElements = pages + 3;
        if (pages >= 8) { points = true; }
        for (let i = 0; i <= totalElements; i++) {
            if (!i) { itemsFake.push(<button key="first" id="first" onClick={e => navigate(e, "first")}>&laquo;</button>); }
            else if (i === 1) { itemsFake.push(<button key="prev" id="prev" onClick={e => navigate(e, "prev")}>&lt;</button>); }
            else if (i === 2) { itemsFake.push(<button key={i - 1} className={s.active} id={`link${i - 1}`} onClick={e => changePageFunction(e)}>{i - 1}</button>); }
            else if (i === totalElements - 1) { itemsFake.push(<button key="next" id="next" onClick={e => navigate(e, "next")}>&gt;</button>); }
            else if (i === totalElements) { itemsFake.push(<button key="last" id="last" onClick={e => navigate(e, "last")}>&raquo;</button>); }
            else if (points && i === 5) { itemsFake.push(<button key="middle" disabled id="reRender">...</button>) }
            else if (points && (i > 5 && i < totalElements - 4)) { }
            else {
                itemsFake.push(<button key={i - 1} id={`link${i - 1}`} onClick={e => changePageFunction(e)}>{i - 1}</button>);
            }
        }
        setItems(itemsFake);
    }, [finalResultRedux, dispatch])

    return (
        <div>
            <div className={s.pagination}>
                {items}
            </div>
        </div>

    );
}