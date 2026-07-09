import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Team.css";
import "../../styles/Challenge.css";
import API from "../../config";

export default function TeamList() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [allTeams, setAllTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAllTeams();
    fetchMyTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllTeams = async () => {
    try {
      const { data } = await axios.get(`${API}/api/teams`, { headers });
      setAllTeams(data.data);
    } catch (err) {
      setError("Failed to load teams");
    }
  };

  const fetchMyTeams = async () => {
    try {
      const { data } = await axios.get(`${API}/api/teams/my`, { headers });
      setMyTeams(data.data);
    } catch (err) {}
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    try {
      await axios.post(`${API}/api/teams/join`, { inviteCode }, { headers });
      setMessage("Joined team successfully!");
      setInviteCode("");
      fetchAllTeams();
      fetchMyTeams();
    } catch (err) {
      setError(err.response?.data?.message || "Join failed");
    }
  };

  const handleLeave = async (id) => {
    try {
      await axios.delete(`${API}/api/teams/${id}/leave`, { headers });
      setMessage("Left team successfully");
      fetchAllTeams();
      fetchMyTeams();
    } catch (err) {
      setError(err.response?.data?.message || "Leave failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await axios.delete(`${API}/api/teams/${id}`, { headers });
      setMessage("Team deleted");
      fetchAllTeams();
      fetchMyTeams();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const teams = activeTab === "my" ? myTeams : allTeams;

  return (
    <div className="team-container">
      <div className="team-header">
        <h2>Teams</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/teams/new")}>
            + Create Team
          </button>
        </div>
      </div>

      {error && <p className="error-msg" onClick={() => setError("")}>{error}</p>}
      {message && <p className="success-msg" onClick={() => setMessage("")}>{message}</p>}

      <div className="join-section">
        <div>
          <label style={{ fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "4px" }}>
            Join with Invite Code
          </label>
          <input
            placeholder="Enter invite code e.g. A1B2C3D4"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
        </div>
        <button className="btn btn-success" onClick={handleJoin}>Join Team</button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}>All Teams</button>
        <button className={`tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}>My Teams</button>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <p>No teams found</p>
        </div>
      ) : (
        <div className="team-grid">
          {teams.map((team) => (
            <div className="team-card" key={team._id}>
              <h3>{team.name}</h3>
              <p>Challenge: <strong>{team.challenge?.title}</strong></p>
              <p>Leader: {team.leader?.name}</p>
              <p>Members: {team.members?.length} / {team.maxSize}</p>

              <div>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>Invite Code:</p>
                <span className="invite-code">{team.inviteCode}</span>
              </div>

              <ul className="members-list">
                {team.members?.map((m) => (
                  <li key={m._id}>{m.name}</li>
                ))}
              </ul>

              <div className="card-actions">
                {team.leader?._id === user?.id ? (
                  <button className="btn btn-danger" onClick={() => handleDelete(team._id)}>
                    Delete Team
                  </button>
                ) : team.members?.some(m => m._id === user?.id) ? (
                  <button className="btn btn-warning" onClick={() => handleLeave(team._id)}>
                    Leave Team
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
