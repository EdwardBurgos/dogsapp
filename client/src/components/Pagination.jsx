import s from '../styles/Pagination.module.css';
//import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react';
import { changePage } from '../actions';


export default function Pagination() {
    /*const items = [];
    for (let i = 0; i < pages; i++) {
        if (!i) return items.push(<a href="#">&laquo;</a>)
        if (i === pages - 1) return items.push(<a href="#">&raquo;</a>)
        items.push(<a href="#">{i}</a>)
    }
    console.log(pages)*/
    const dispatch = useDispatch();
    const finalResultRedux = useSelector(state => state.finalResult);
    const [items, setItems] = useState([])
  
    
    useEffect(() => {
        dispatch(changePage(finalResultRedux.slice(0, 8)))

        function changePageFunction(e) {
            e.preventDefault();
            let number = parseInt(e.target.id.replace(/[^0-9]/g, '')) * 8;
            console.log(number);
            dispatch(changePage(finalResultRedux.slice(number - 8, number)))
        }
        function navigate(e, direction) {
            e.preventDefault();
            console.log(direction);
        }


        let itemsFake = [];
        const pages = Math.ceil(finalResultRedux.length / 8);
        console.log(finalResultRedux.length);
        console.log('p', pages);
        
        let add = true;
        for (let i = 0; i < pages + 2; i++) {
            console.log(i)
            if (!i) {itemsFake.push(<button key="left" onClick={e => navigate(e, "prev")}>&laquo;</button>);} 
            else if (i === pages + 1) {itemsFake.push(<button key="right" onClick={e => navigate(e, "next")}>&raquo;</button>);}
            else if (4 > i || i > pages - 3)  {itemsFake.push(<button key={i} id={`link${i}`} onClick={e => changePageFunction(e)}>{i}</button>);}
            else if (add) {itemsFake.push(<button key="middle">...</button>); add = false}
        }
        console.log(itemsFake)
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