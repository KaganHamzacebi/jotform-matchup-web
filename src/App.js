import './App.css';
import Login from './components/Login/Login';
import Sidebar from './components/Home/Home';
import Submissions from './components/Submissions/Submissions';
import Matchup from './components/Matchup/Matchup';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/home" component={Sidebar} />
          <Route path="/submissions/:id" component={Submissions} />
          <Route path="/matchup/:id" component={Matchup} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
