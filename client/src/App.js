import s from './App.module.css';
import axios from './axiosInterceptor';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { getUserInfo, getExpiration, logout } from './extras/globalFunctions';
import { useEffect } from 'react';
import { setUser } from './actions';
import { useDispatch, useSelector } from 'react-redux';
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
import Pet from './components/Pet/Pet';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import Loading from './components/Loading/Loading';

function App() {
  // Redux states
  const user = useSelector(state => state.user)

  // Variables
  const dispatch = useDispatch();
  let query = new URLSearchParams(useLocation().search);

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
    return () => {
      logout();
      source.cancel("Unmounted");
    }
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
                <Route path="/registerPet" component={RegisterPet} />
                <Route path="/editPet/:id" render={({ match }) => Object.keys(user).length && user.pets.includes(parseInt(match.params.id))? <EditPet id={match.params.id} /> : <Redirect to="/home"/> }></Route>
                <Route path="/pet/:id" render={({ match }) => <Pet id={match.params.id} /> } />
                <Route path="/about" component={About} />
                <Route path="/profile">{Object.keys(user).length ? <Profile /> : <Redirect to="/login" />}</Route>
                <Route path="/login">{Object.keys(user).length ? <Redirect to="/profile" /> : <Login />}</Route>
                <Route path="/signup" >{Object.keys(user).length ? <Redirect to="/profile" /> : <Signup />}</Route>
                <Route path="/auto/:reason/:token" render={({ match }) => <VerifyEmail reason={match.params.reason} token={match.params.token} expires={query.get("expires")}/>} />
                {/* <Route path="/verifyEmail/:token" render={({ match }) =>  ? <EditPet id={match.params.id} /> : <Redirect to="/home"/> }></Route> */}
                <Route path="/:username" render={({ match }) => <User username={match.params.username} /> }/>
              </Switch>
            </div>
          </div>
          :
          <div className={s.container}>
            <Loading />
          </div>
      }
    </>
  );
}

export default App;
