import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Challenge.css";

const API = "https://innovation-challenge-platform-backend.onrender.com";

export default function TeamForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [form, setForm] = useState({ name: "", challenge: "" });
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/challenges`)
      .then(({ data }) => setChallenges(data.data.filter(c => c.status === "published")))
      .catch(() => setError("Failed to load challenges"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/teams`, form, { headers });
      navigate("/teams");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h2>Create Team</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Team Name</label>
          <input className="form-input" placeholder="Enter team name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Select Challenge</label>
          <select className="form-input" value={form.challenge}
            onChange={(e) => setForm({ ...form, challenge: e.target.value })} required>
            <option value="">-- Select Challenge --</option>
            {challenges.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-primary" type="submit">Create Team</button>
          <button className="btn btn-secondary" type="button"
            onClick={() => navigate("/teams")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
