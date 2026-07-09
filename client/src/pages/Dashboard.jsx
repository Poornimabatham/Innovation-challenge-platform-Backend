import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}!</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-info">
        <p>Role: <strong>{user?.role}</strong></p>
        <p>Email: {user?.email}</p>
      </div>
    </div>
  );
}
