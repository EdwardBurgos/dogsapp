import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LandingPage from './components/LandingPage';
import Home from './components/Home'
import Detail from './components/Detail';
import Create from './components/Create';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route } from 'react-router-dom';
import storeConfig from './store.js';
import { Provider } from 'react-redux';
// import App from './App';
// import redux from 'redux';

const store = storeConfig();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <Route exact path="/" component={LandingPage} />
        <Route path="/home" component={Home} />
        <Route path="/detail/:id" render={({ match }) => <Detail id={match.params.id} />} />
        <Route path="/create" component={Create}/>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
