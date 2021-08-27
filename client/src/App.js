import s from './App.module.css';
import Home from './components/Home/Home'
import Detail from './components/Detail/Detail';
import Create from './components/Create/Create';
import About from './components/About/About';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Signup from './components/Signup/Signup';
import { Route, Redirect, Switch } from 'react-router-dom';
import { logout, getUserInfo } from './extras/globalFunctions';
import NotFound from './components/NotFound/NotFound';
import { useEffect } from 'react';
import { setUser } from './actions';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  // Redux states
  const user = useSelector(state => state.user)

  // Variables
  const dispatch = useDispatch();

  // This hook is executed every time the page is reloaded
  useEffect(() => {
    async function checkLog() {
      const user = await getUserInfo();
      if (!Object.keys(user).length) logout();
      dispatch(setUser(user))
    }
    checkLog();
  }, [])

  return (
    <div className="App">
      <NavBar />
      <div className={s.margin}>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/detail/:id" render={({ match }) => <Detail id={match.params.id} />} />
          <Route path="/create" component={Create} />
          <Route path="/about" component={About} />
          <Route path="/profile">{Object.keys(user).length ? <Profile /> : <Redirect to="/login" />}</Route>
          <Route path="/login">{Object.keys(user).length ? <Redirect to="/profile" /> : <Login />}</Route>
          <Route path="/signup">{Object.keys(user).length ? <Redirect to="/profile" /> : <Signup />}</Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
