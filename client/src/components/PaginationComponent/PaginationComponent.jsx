import React, { useEffect } from 'react';
import s from './PaginationComponent.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changePage } from '../../actions';
import { Alert, Button, Col, Form,Pagination, Row } from 'react-bootstrap';


export default function PaginationComponent(props) {

  const dispatch = useDispatch();
  const finalResultRedux = useSelector(state => state.finalResult);

  const [items, setItems] = useState([]);


  const [page, setPage] = useState({
    totalPages: null,
    dataStartingIndex: null,
    currentClickedNumber: 1,
    pageData: null,
    clickedOnNumber: null,
    currentClickedPage: null,
  })

  let { currentClickedNumber, pageData, totalPages } = page;

  useEffect(() => {
    let paginatedDataObject = {};
    let chunkArray = [];

    for (let index = 0; index < finalResultRedux.length; index += 8) {
      let end = index + 8
      let newChunk = finalResultRedux.slice(index, end);
      chunkArray.push(newChunk);
    }

    chunkArray.forEach((chunk, i) => {
      paginatedDataObject[i + 1] = chunk;
    });

    setPage({
      ...page,
      totalPages: (finalResultRedux.length > 0) ? Math.ceil(finalResultRedux.length / 8) : 0,
      dataStartingIndex: 1,
      pageData: paginatedDataObject,
      clickedOnNumber: 1
    });
  }, [finalResultRedux, dispatch])

  useEffect(() => {
    if (page.pageData) {
      dispatch(changePage(page.pageData[page.currentClickedNumber]));
    }
  }, [page.currentClickedNumber, page.pageData])

  const setCurrentClickedNumber = (e) => {
    setPage({
      ...page,
      currentClickedNumber: parseInt(e.target.innerText)
    })
  };

  const moveToLastPage = () => {
    setPage({
      ...page,
      currentClickedNumber: page.totalPages,
      currentClickedPage: page.totalPages
    });
  };

  const moveToFirstPage = () => {
    setPage({
      ...page,
      currentClickedNumber: 1,
      currentClickedPage: 1
    });
  };

  const moveOnePageForward = () => {
    const { dataStartingIndex, totalPages, currentClickedNumber } = page;

    if (dataStartingIndex) {
      setPage({
        ...page,
        dataStartingIndex: null,
        currentClickedNumber: 2
      });
    } else {
      setPage({
        ...page,
        currentClickedNumber:
          currentClickedNumber + 1 > totalPages
            ? totalPages
            : currentClickedNumber + 1
      });
    }
  };

  const moveOnePageBackward = () => {
    setPage({
      ...page,
      currentClickedNumber:
        page.currentClickedNumber - 1 < 1
          ? 1
          : page.currentClickedNumber - 1
    });
  };

  const pageNumberRender = () => {
    const { totalPages, currentClickedNumber } = page;
    let pages = [];

    for (let i = 1; i < totalPages + 1; i++) {
      pages.push(
        <Pagination.Item className={s.item} onClick={(e) => setCurrentClickedNumber(e)} key={i + 50}>
          {i}
        </Pagination.Item>
      );
    }
    let currentPage = (<Pagination.Item active activeLabel=""
      className={s.activo}
      onClick={(e) => { setCurrentClickedNumber(e); }}
      key={currentClickedNumber}>{currentClickedNumber} </Pagination.Item>)

    let pointsStart = <Pagination.Item className={s.item} key='pointsStart'> ... </Pagination.Item>
    let pointsEnd = <Pagination.Item  className={s.item} key='pointsEnd'> ... </Pagination.Item>
    return [pages[currentClickedNumber - 5] ? pointsStart : null, pages[currentClickedNumber - 4], pages[currentClickedNumber - 3], pages[currentClickedNumber - 2], currentPage, pages[currentClickedNumber], 
    pages[currentClickedNumber + 1], pages[currentClickedNumber + 2], pages[currentClickedNumber + 3] ? pointsEnd : null];
  };

  return (
    <Pagination className={s.pagination}>
        {currentClickedNumber > 1 ?
        <>
              <Pagination.Item className={s.item}
                onClick={() => moveToFirstPage()} key='first'>
                &lt;&lt;
              </Pagination.Item>
              <Pagination.Item onClick={() => moveOnePageBackward()} key='prev' className={s.item}>
                &lt;
              </Pagination.Item>
            </>
          :
          null
        }
      <>{pageNumberRender()}</>
      <>
        {currentClickedNumber !== totalPages ?
          <>
              <Pagination.Item className={s.item} onClick={() => moveOnePageForward()} key='next'>
                 &gt;
              </Pagination.Item>
              <Pagination.Item className={s.item} onClick={() => moveToLastPage()} key='last'>
                &gt;&gt;
              </Pagination.Item>
            
          </>
          :
          null
        }
      </>
    </Pagination>
  )
}
