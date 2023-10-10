import { BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import RegistrationForm from "./component/registration/Registration";


function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route exact path="/" element={<RegistrationForm/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
