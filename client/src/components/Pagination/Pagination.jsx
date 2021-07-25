import s from './Pagination.module.css';
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react';
import { changePage } from '../../actions';

export default function Pagination() {
    // Dispatch
    const dispatch = useDispatch();

    // Global state of the result to show
    const finalResultRedux = useSelector(state => state.finalResult);

    // Buttons of the pagination 
    const [items, setItems] = useState([]);    
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        // fUNCTION reRedenr 
        function reRenderOne(e) {
            e.preventDefault();
            let siblings = e.target.parentNode.children;
            for (let i = 0; i < siblings.length; i++) {
                siblings[i].className = '';
            }
            dispatch(changePage(finalResultRedux.slice(24, 32)))
            let buttons = [];
            for (let i = 0; i < 11; i++) {
                if (!i) { buttons.push(<button key="first" id="first" onClick={e => navigate(e, "first")}>&laquo;</button>); }
                else if (i === 1) { buttons.push(<button key="prev" id="prev" onClick={e => navigate(e, "prev")}>&lt;</button>); }
                else if (i === 5) { buttons.push(<button key="4" id="link4" className={s.active} onClick={e => changePageFunction(e)}>4</button>); }
                else if (i === 8) { buttons.push(<button key="pointsEnd" disabled id="reRenderRight">...</button>) }
                else if (i === 9) { buttons.push(<button key="next" id="next" onClick={e => navigate(e, "next")}>&gt;</button>); }
                else if (i === 10) { buttons.push(<button key="last" id="last" onClick={e => navigate(e, "last")}>&raquo;</button>); }
                else {
                    buttons.push(<button key={i - 1} id={`link${i - 1}`} onClick={e => changePageFunction(e)}>{i - 1}</button>);
                }
            }
            setItems(buttons);
        }

        // Function to change the pagination  
        function reRender(actualElement, direction) {
            let number;
            if (direction === 'right') { number = parseInt(actualElement.id.replace(/[^0-9]/g, '')) + 1; }
            else { number = parseInt(actualElement.id.replace(/[^0-9]/g, '')) - 5; }
            dispatch(changePage(finalResultRedux.slice((number - 1) * 8, number * 8)))
            let buttons = [];
            const pages = Math.ceil(finalResultRedux.length / 8);
            for (let i = 0; i < 11; i++) {
                if (!i) { buttons.push(<button key="first" id="first" onClick={e => navigate(e, "first")}>&laquo;</button>); }
                else if (i === 1) { buttons.push(<button key="prev" id="prev" onClick={e => navigate(e, "prev")}>&lt;</button>); }
                else if (i === 2 && number - 1 > 0) { 
                    if (number - 1 === 1) {buttons.push(<button key="1" id="link1" onClick={e => changePageFunction(e)}>1</button>);}
                    else {buttons.push(<button key="pointsInit" disabled id="reRenderLeft">...</button>)}
                }
                else if (i === 3 && direction === "right") { buttons.push(<button key={number} id={`link${number}`} className={s.active} onClick={e => changePageFunction(e)}>{number}</button>); }
                else if (i === 7 && direction === "left") { buttons.push(<button key={number + 4} id={`link${number + 4}`} className={s.active} onClick={e => changePageFunction(e)}>{number + 4}</button>); }
                else if (i === 8 && number + 5 <= pages) { buttons.push(<button key="pointsEnd" disabled id="reRenderRight">...</button>) }
                else if (i === 9) { 
                    if (number === 22) {buttons.push(<button key="next" id="next" onClick={e => navigate(e, "next")} disabled>&gt;</button>); }
                    else {buttons.push(<button key="next" id="next" onClick={e => navigate(e, "next")}>&gt;</button>); }
                }
                else if (i === 10) { 
                    if (number === 22) {buttons.push(<button key="last" id="last" onClick={e => navigate(e, "last")} disabled>&raquo;</button>); }
                    else {buttons.push(<button key="last" id="last" onClick={e => navigate(e, "last")}>&raquo;</button>); }
                }
                else if (i > 2 && i < 8 && number + (i - 3) <= pages && number + (i - 3) > 0) { // The last comparison doesn't allow to show more than actual the pages just to fill the 5 spaces
                    buttons.push(<button key={number + (i - 3)} id={`link${number + (i - 3)}`} onClick={e => changePageFunction(e)}>{number + (i - 3)}</button>);
                    
                }
            }
            setItems(buttons);
        }

        // Function to change the page 
        function changePageFunction(e, notEvent) {
            setDisabled(false);
            if (!notEvent) { e.preventDefault(); e = e.target }
            let siblings = e.parentNode.children;
            for (let i = 0; i < siblings.length; i++) {
                siblings[i].className = '';
            }
            let number = parseInt(e.id.replace(/[^0-9]/g, '')) * 8; // number is the number of the button and define which records to show
            if (!isNaN(number)) {
                if (number === 8) { document.getElementById('first').disabled = true; document.getElementById('prev').disabled = true; }
                else { document.getElementById('first').disabled = false; document.getElementById('prev').disabled = false; }
                if (number >= finalResultRedux.length) { document.getElementById('last').disabled = true; document.getElementById('next').disabled = true; }
                else { document.getElementById('last').disabled = false; document.getElementById('next').disabled = false; }
                
                dispatch(changePage(finalResultRedux.slice(number - 8, number)))
                e.className = s.active;
            }
        }

        // Function to go first, prev, next or last
        function navigate(e, direction) {
            e.preventDefault();
            let actual = document.getElementsByClassName(s.active)[0];
            let children = e.target.parentNode.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].className = '';
                }
            switch (direction) {
                case "next":
                    switch (actual.nextSibling.id) {
                        case 'reRender':
                            return reRenderOne(e);
                        case 'reRenderRight':
                            return reRender(actual, 'right');
                        default:
                            changePageFunction(actual.nextSibling, true);
                    }
                    break;
                case "prev":
                    switch (actual.previousSibling.id) {
                        case 'reRender':
                        case 'reRenderLeft':
                            return reRender(actual, 'left');
                        default:
                            changePageFunction(actual.previousSibling, true);
                    }
                    break;
                case "first":
                    document.getElementById('first').disabled = true;
                    document.getElementById('prev').disabled = true;
                    if (document.getElementById('reRender')) return changePageFunction(e.target.parentNode.children[2], true);
                    firstRender("first");
                    break;
                case "last":
                    document.getElementById('last').disabled = true;
                    document.getElementById('next').disabled = true;
                    if (document.getElementById('reRender')) return changePageFunction(e.target.parentNode.children[8], true);
                    firstRender("last");
                    break;
                default:
                    return firstRender(direction);
            }
        }

        // Operating logic
        function firstRender(direction) {
            dispatch(changePage(finalResultRedux.slice(0, 8))) // It is executed when finalResultRedux change or firstRender is executed
            /* let siblings = document.getElementById('first').parentNode.children;
             for (let i = 0; i < siblings.length; i++) {
                 siblings[i].className = '';
             }*/
            if (!direction) direction = "first";
            const pages = Math.ceil(finalResultRedux.length / 8);
            if (pages === 1) { return setItems(<button key='1' className={s.active} id='link1' disabled>1</button>) }
            let buttons = [];
            let ellipsis = false;
            let elements = pages + 4;
            if (pages > 7) { ellipsis = true; elements = 11; }
            for (let i = 0; i < elements; i++) {
                if (!i) { buttons.push(<button key="first" id="first" onClick={e => navigate(e, "first")} >&laquo;</button>); }
                else if (i === 1) { buttons.push(<button key="prev" id="prev" onClick={e => navigate(e, "prev")} >&lt;</button>); }
                else if (i === 2 && direction === "first") { buttons.push(<button key="1" id="link1" className={s.active} onClick={e => changePageFunction(e)}>1</button>); }
                else if (i === elements - 3 && direction === "last") { buttons.push(<button key={pages} id={`link${pages}`} className={s.active} onClick={e => changePageFunction(e)}>{pages}</button>); }
                else if (i === elements - 2) { buttons.push(<button key="next" id="next" onClick={e => navigate(e, "next")}>&gt;</button>); }
                else if (i === elements - 1) { buttons.push(<button key="last" id="last" onClick={e => navigate(e, "last")}>&raquo;</button>); }
                else if (ellipsis) { 
                    if (i < 5) { buttons.push(<button key={i - 1} id={`link${i - 1}`} onClick={e => changePageFunction(e)}>{i - 1}</button>); }
                    if (i > 5) { buttons.push(<button key={pages + (i - 8)} id={`link${pages + (i - 8)}`} onClick={e => changePageFunction(e)}>{pages + (i - 8)}</button>); }
                    if (i === 5) {buttons.push(<button key="middle" disabled id="reRender">...</button>) }
                }
                else {buttons.push(<button key={i - 1} id={`link${i - 1}`} onClick={e => changePageFunction(e)}>{i - 1}</button>); }
            }
            setItems(buttons);
        }
        firstRender();
    }, [finalResultRedux, dispatch])


    useEffect(() => {
        if (disabled) {
            if (document.getElementById('first')) document.getElementById('first').disabled = true;
            if (document.getElementById('prev')) document.getElementById('prev').disabled = true;
        } 
     }, [items, disabled])

    return (
        <div>
            <div className={s.pagination}>
                {items}
            </div>
        </div>

    );
}