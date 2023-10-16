import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import RegistrationForm from "./component/registration/Registration";
import HomePage from "./component/homePage/HomePage";
import UserList from "./component/userList/UserList";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/register-page" element={<RegistrationForm />} />
          <Route path="/userList" element={<UserList/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
