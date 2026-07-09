import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Submission.css";
import "../../styles/Challenge.css";
import API from "../../config";

export default function SubmissionList() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("my");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchSubmissions = async () => {
    try {
      const url = activeTab === "my"
        ? `${API}/api/submissions/my`
        : `${API}/api/submissions`;
      const { data } = await axios.get(url, { headers });
      setSubmissions(data.data);
    } catch (err) {
      setError("Failed to load submissions");
    }
  };

  const handleLock = async (id) => {
    if (!window.confirm("Lock this submission? This cannot be undone.")) return;
    try {
      await axios.patch(`${API}/api/submissions/${id}/lock`, {}, { headers });
      setMessage("Submission locked successfully");
      fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.message || "Lock failed");
    }
  };

  return (
    <div className="submission-container">
      <div className="submission-header">
        <h2>Submissions</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/submissions/new")}>
            + New Submission
          </button>
        </div>
      </div>

      {error && <p className="error-msg" onClick={() => setError("")}>{error}</p>}
      {message && <p className="success-msg" onClick={() => setMessage("")}>{message}</p>}

      <div className="tabs" style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button className={`tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}>My Submissions</button>
        {(user?.role === "admin" || user?.role === "judge" || user?.role === "organizer") && (
          <button className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}>All Submissions</button>
        )}
      </div>

      {submissions.length === 0 ? (
        <div className="empty-state">
          <p>No submissions found</p>
        </div>
      ) : (
        <div className="submission-grid">
          {submissions.map((s) => (
            <div className="submission-card" key={s._id}>
              <span className={s.isLocked ? "locked-badge" : "unlocked-badge"}>
                {s.isLocked ? "🔒 Locked" : "🔓 Open"}
              </span>
              <h3>{s.challenge?.title}</h3>
              <p>Team: <strong>{s.team?.name}</strong></p>
              <p>By: {s.submittedBy?.name}</p>

              {s.githubLink && (
                <p>GitHub: <a href={s.githubLink} target="_blank" rel="noreferrer">{s.githubLink}</a></p>
              )}
              {s.pdfUrl && (
                <p>PDF: <a href={s.pdfUrl} target="_blank" rel="noreferrer">View PDF</a></p>
              )}
              {s.videoUrl && (
                <p>Video: <a href={s.videoUrl} target="_blank" rel="noreferrer">Watch Video</a></p>
              )}

              {s.versions?.length > 0 && (
                <div className="version-history">
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>
                    Version History ({s.versions.length})
                  </p>
                  {s.versions.map((v, i) => (
                    <div className="version-item" key={i}>
                      v{i + 1} — {new Date(v.submittedAt).toLocaleDateString()} {v.note && `— ${v.note}`}
                    </div>
                  ))}
                </div>
              )}

              <div className="card-actions">
                {!s.isLocked && (
                  <>
                    <button className="btn btn-secondary"
                      onClick={() => navigate(`/submissions/edit/${s._id}`)}>
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={() => handleLock(s._id)}>
                      Lock Final
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
