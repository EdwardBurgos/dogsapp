import './App.css';
import LandingPage from './components/LandingPage/LandingPage';
import Home from './components/Home/Home'
import Detail from './components/Detail/Detail';
import Create from './components/Create/Create';
import { Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LandingPage} />
      <Route path="/home" component={Home} />
      <Route path="/detail/:id" render={({ match }) => <Detail id={match.params.id} />} />
      <Route path="/create" component={Create} />
    </div>
  );
}

export default App;
