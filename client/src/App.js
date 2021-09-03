import s from './App.module.css';
import axios from './axiosInterceptor';
import { Route, Redirect, Switch } from 'react-router-dom';
import { getUserInfo } from './extras/globalFunctions';
import { useEffect } from 'react';
import { setUser } from './actions';
import { useDispatch, useSelector } from 'react-redux';
import loading from './img/loadingGif.gif';
import Home from './components/Home/Home';
import Detail from './components/Detail/Detail';
import About from './components/About/About';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Signup from './components/Signup/Signup';
import RegisterPet from './components/RegisterPet/RegisterPet';
import EditPet from './components/EditPet/EditPet';
import User from './components/User/User';
import NotFound from './components/NotFound/NotFound';




function App() {
  // Redux states
  const user = useSelector(state => state.user)

  // Variables
  const dispatch = useDispatch();

  // This hook is executed every time the page is reloaded
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    async function checkLog() {
      const user = await getUserInfo(source.token);
      if (user !== "Unmounted") {
        dispatch(setUser(user));
      }
    }
    checkLog();
    return () => source.cancel("Unmounted");
  }, [dispatch])

  return (
    <>
      {
        user ?
          <div>
            <NavBar />
            <div className={s.margin}>
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/detail/:id" render={({ match }) => <Detail id={match.params.id} />} />
                <Route path="/registerPet/breed/:id" render={({ match }) => <RegisterPet id={match.params.id} />} />
                <Route path="/registerPet" component={RegisterPet} />
                <Route path="/editPet/:id" render={({ match }) => Object.keys(user).length && user.pets.includes(parseInt(match.params.id))? <EditPet id={match.params.id} /> : <Redirect to="/home"/> }></Route>
                <Route path="/about" component={About} />
                <Route path="/profile">{Object.keys(user).length ? <Profile /> : <Redirect to="/login" />}</Route>
                <Route path="/login">{Object.keys(user).length ? <Redirect to="/profile" /> : <Login />}</Route>
                <Route path="/signup">{Object.keys(user).length ? <Redirect to="/profile" /> : <Signup />}</Route>
                <Route path="/:username" render={({ match }) => <User username={match.params.username} /> }/>
              </Switch>
            </div>
          </div>
          :
          <div className={s.container}>
            <div className={s.contentCenter}>
              <img className={s.loading} src={loading} alt='loadingGif'></img>
            </div>
          </div>
      }
    </>
  );
}

export default App;
