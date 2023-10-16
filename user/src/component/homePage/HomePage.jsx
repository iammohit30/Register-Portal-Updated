import "./homePage.css"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="home">
        <div className="home-wrapper">
            <div className="title">
                Register Portal
            </div>
            <div className="link-button">
                <Link to="/register-page">
                    <button>Register User</button>
                </Link>
                <Link to="/userList">
                    <button>View Registered User</button>
                </Link>
            </div>
        </div>
    </div>
  )
}
