import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Notifications from "../components/Notifications";
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Notifications />
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="dashboard-info">
        <p>Role: <strong>{user?.role}</strong></p>
        <p>Email: {user?.email}</p>
      </div>

      <div className="dashboard-nav">
        <button className="nav-card" onClick={() => navigate("/challenges")}>
          🏆 Challenges
        </button>
        {(user?.role === "organizer" || user?.role === "admin") && (
          <button className="nav-card" onClick={() => navigate("/challenges/new")}>
            ➕ Create Challenge
          </button>
        )}
        <button className="nav-card" onClick={() => navigate("/teams")}>
          👥 Teams
        </button>
        <button className="nav-card" onClick={() => navigate("/submissions")}>
          📄 Submissions
        </button>
        <button className="nav-card" onClick={() => navigate("/leaderboard")}>
          📊 Leaderboard
        </button>
        {(user?.role === "judge" || user?.role === "admin") && (
          <button className="nav-card" onClick={() => navigate("/judge")}>
            ⚖️ Judge Dashboard
          </button>
        )}
        {user?.role === "admin" && (
          <button className="nav-card" onClick={() => navigate("/admin")}>
            ⚙️ Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
