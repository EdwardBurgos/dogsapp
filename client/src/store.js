/*import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk' // Esta librería nos permitirá realizar request a los servidores desde las acciones de Redux

const middlewareEnhancer = applyMiddleware(thunkMiddleware)
const composedEnhancers = compose(middlewareEnhancer)

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  composedEnhancers // Con esto recién aplicaremos redux-thunk a nuestra aplicación
);

export default store;
*/


// ANTES

import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'


export default function configureStore(prealoadedState) {
  const middlewares = [thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(
    reducer,  
    prealoadedState,

    composedEnhancers)

  return store
}

// @flow

// import { createStore, compose, applyMiddleware } from 'redux';
// import reducer from './reducers';
// import { composeWithDevTools } from 'redux-devtools-extension';

// export default function configureStore(prealoadedState) {
//   const store = createStore(reducer, prealoadedState, composeWithDevTools());
//   return store;
// };
