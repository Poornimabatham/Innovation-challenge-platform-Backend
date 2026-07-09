import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Admin.css";
import "../../styles/Challenge.css";
import API from "../../config";

export default function AdminDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/analytics`, { headers });
      setAnalytics(data.data);
    } catch (err) {
      setError("Failed to load analytics");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/users`, { headers });
      setUsers(data.data);
    } catch (err) {}
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/api/admin/users/${id}`, { headers });
      setMessage("User deleted");
      fetchUsers();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const getMaxCount = (arr) => Math.max(...arr.map(i => i.count), 1);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>⚙️ Admin Dashboard</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>← Back</button>
      </div>

      {error && <p className="error-msg" onClick={() => setError("")}>{error}</p>}
      {message && <p className="success-msg" onClick={() => setMessage("")}>{message}</p>}

      <div className="tabs">
        <button className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}>Overview</button>
        <button className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}>Users</button>
        <button className={`tab ${activeTab === "recent" ? "active" : ""}`}
          onClick={() => setActiveTab("recent")}>Recent Activity</button>
      </div>

      {activeTab === "overview" && analytics && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{analytics.counts.users}</div>
              <div className="stat-label">👤 Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.counts.challenges}</div>
              <div className="stat-label">🏆 Challenges</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.counts.teams}</div>
              <div className="stat-label">👥 Teams</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.counts.submissions}</div>
              <div className="stat-label">📄 Submissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.counts.evaluations}</div>
              <div className="stat-label">⚖️ Evaluations</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h4>Users by Role</h4>
              {analytics.usersByRole.map((r) => (
                <div className="bar-row" key={r._id}>
                  <span className="bar-label">{r._id}</span>
                  <div className="bar-fill"
                    style={{ width: `${(r.count / getMaxCount(analytics.usersByRole)) * 200}px` }}>
                    {r.count}
                  </div>
                </div>
              ))}
            </div>

            <div className="chart-card">
              <h4>Challenges by Status</h4>
              {analytics.challengesByStatus.map((c) => (
                <div className="bar-row" key={c._id}>
                  <span className="bar-label">{c._id}</span>
                  <div className="bar-fill"
                    style={{
                      width: `${(c.count / getMaxCount(analytics.challengesByStatus)) * 200}px`,
                      background: c._id === "published" ? "#10b981" : c._id === "archived" ? "#6b7280" : "#f59e0b"
                    }}>
                    {c.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "users" && (
        <>
          <p className="section-title">All Users ({users.length})</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger"
                      onClick={() => handleDeleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "recent" && analytics && (
        <>
          <p className="section-title">Recent Users</p>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {analytics.recentUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="section-title">Recent Challenges</p>
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>Created</th></tr>
            </thead>
            <tbody>
              {analytics.recentChallenges.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
