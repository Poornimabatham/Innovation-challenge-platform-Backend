import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Challenge.css";
import API from "../../config";

export default function ChallengeList() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [message, setMessage] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data } = await axios.get(`${API}/api/challenges`);
      setChallenges(data.data);
    } catch (err) {
      setMessage("Failed to load challenges");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this challenge?")) return;
    try {
      await axios.delete(`${API}/api/challenges/${id}`, { headers });
      fetchChallenges();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.patch(`${API}/api/challenges/${id}/publish`, {}, { headers });
      fetchChallenges();
    } catch (err) {
      setMessage("Publish failed");
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.patch(`${API}/api/challenges/${id}/archive`, {}, { headers });
      fetchChallenges();
    } catch (err) {
      setMessage("Archive failed");
    }
  };

  const handleClone = async (id) => {
    try {
      await axios.post(`${API}/api/challenges/${id}/clone`, {}, { headers });
      fetchChallenges();
    } catch (err) {
      setMessage("Clone failed");
    }
  };

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <h2>Challenges</h2>
        {(user?.role === "organizer" || user?.role === "admin") && (
          <button className="btn btn-primary" onClick={() => navigate("/challenges/new")}>
            + Create Challenge
          </button>
        )}
      </div>

      {message && <p className="error-msg">{message}</p>}

      <div className="challenge-grid">
        {challenges.map((c) => (
          <div className="challenge-card" key={c._id}>
            <span className={`badge badge-${c.status}`}>{c.status}</span>
            <h3>{c.title}</h3>
            <p>{c.description.substring(0, 80)}...</p>
            <p>Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
            <p>Prize: {c.prizes}</p>

            <div className="card-actions">
              {(user?.role === "organizer" || user?.role === "admin") && (
                <>
                  <button className="btn btn-secondary"
                    onClick={() => navigate(`/challenges/edit/${c._id}`)}>Edit</button>
                  {c.status === "draft" && (
                    <button className="btn btn-success" onClick={() => handlePublish(c._id)}>Publish</button>
                  )}
                  {c.status === "published" && (
                    <button className="btn btn-warning" onClick={() => handleArchive(c._id)}>Archive</button>
                  )}
                  <button className="btn btn-primary" onClick={() => handleClone(c._id)}>Clone</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
