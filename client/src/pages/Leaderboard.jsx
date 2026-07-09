import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Leaderboard.css";
import "../styles/Challenge.css";

const API = "https://innovation-challenge-platform-backend.onrender.com";

export default function Leaderboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/challenges`)
      .then(({ data }) => setChallenges(data.data.filter(c => c.status === "published")))
      .catch(() => setError("Failed to load challenges"));
  }, []);

  useEffect(() => {
    if (!selectedChallenge) return;
    axios.get(`${API}/api/leaderboard/${selectedChallenge}`, { headers })
      .then(({ data }) => setLeaderboard(data.data))
      .catch(() => setError("Failed to load leaderboard"));
  }, [selectedChallenge]);

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>📊 Leaderboard</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>← Back</button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <select className="challenge-select" value={selectedChallenge}
        onChange={(e) => setSelectedChallenge(e.target.value)}>
        <option value="">-- Select Challenge --</option>
        {challenges.map((c) => (
          <option key={c._id} value={c._id}>{c.title}</option>
        ))}
      </select>

      {selectedChallenge && leaderboard.length === 0 && (
        <div className="empty-state"><p>No evaluations yet for this challenge</p></div>
      )}

      {leaderboard.length > 0 && (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Avg Score</th>
              <th>Evaluations</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.submissionId} className={`rank-${index + 1}`}>
                <td><span className="rank-badge">{getRankEmoji(index)}</span></td>
                <td>{entry.team}</td>
                <td><strong>{entry.avgScore} / 50</strong></td>
                <td>{entry.evaluationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
