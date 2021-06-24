import './App.css';
import {Link} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Henry Dogs</h1>
      <Link to="/home"><button>HOME</button></Link>
    </div>
  );
}

export default App;
