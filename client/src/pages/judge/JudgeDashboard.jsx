import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Judge.css";
import "../../styles/Challenge.css";
import API from "../../config";

const defaultRubric = { innovation: 0, technical: 0, presentation: 0, impact: 0, feasibility: 0 };

export default function JudgeDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [done, setDone] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [forms, setForms] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data } = await axios.get(`${API}/api/evaluations/submissions`, { headers });
      setPending(data.data.pending);
      setDone(data.data.done);
    } catch (err) {
      setError("Failed to load submissions");
    }
  };

  const handleRubricChange = (submissionId, field, value) => {
    setForms(prev => ({
      ...prev,
      [submissionId]: {
        ...defaultRubric,
        ...prev[submissionId],
        [field]: Number(value)
      }
    }));
  };

  const getTotal = (submissionId) => {
    const rubric = forms[submissionId] || defaultRubric;
    return Object.values(rubric).reduce((a, b) => a + b, 0);
  };

  const handleSubmit = async (submission) => {
    const rubric = forms[submission._id] || defaultRubric;
    const feedback = forms[submission._id]?.feedback || "";
    try {
      await axios.post(`${API}/api/evaluations`, {
        submission: submission._id,
        challenge: submission.challenge?._id,
        rubric,
        feedback
      }, { headers });
      setMessage("Evaluation submitted!");
      fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.message || "Submit failed");
    }
  };

  const rubricFields = ["innovation", "technical", "presentation", "impact", "feasibility"];

  const renderCard = (s, isPending) => (
    <div className="judge-card" key={s._id}>
      <h3>{s.challenge?.title}</h3>
      <p>Team: <strong>{s.team?.name}</strong></p>
      <p>By: {s.submittedBy?.name}</p>

      {s.githubLink && (
        <p><a href={s.githubLink} target="_blank" rel="noreferrer">🔗 GitHub</a></p>
      )}
      {s.pdfUrl && (
        <p><a href={s.pdfUrl} target="_blank" rel="noreferrer">📄 PDF</a></p>
      )}
      {s.videoUrl && (
        <p><a href={s.videoUrl} target="_blank" rel="noreferrer">🎥 Video</a></p>
      )}

      {isPending && (
        <div className="rubric-form">
          <p style={{ fontWeight: "600", marginBottom: "8px" }}>Rubric (0-10 each)</p>
          {rubricFields.map(field => (
            <div className="rubric-row" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type="number" min="0" max="10"
                value={forms[s._id]?.[field] ?? 0}
                onChange={(e) => handleRubricChange(s._id, field, e.target.value)} />
            </div>
          ))}

          <div className="total-score">Total: {getTotal(s._id)} / 50</div>

          <textarea className="feedback-input" rows="3" placeholder="Write feedback..."
            value={forms[s._id]?.feedback || ""}
            onChange={(e) => setForms(prev => ({
              ...prev,
              [s._id]: { ...prev[s._id], feedback: e.target.value }
            }))} />

          <button className="btn btn-primary" style={{ width: "100%" }}
            onClick={() => handleSubmit(s)}>
            Submit Evaluation
          </button>
        </div>
      )}

      {!isPending && <span className="evaluated-badge">✅ Evaluated</span>}
    </div>
  );

  return (
    <div className="judge-container">
      <div className="judge-header">
        <h2>⚖️ Judge Dashboard</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>← Back</button>
      </div>

      {error && <p className="error-msg" onClick={() => setError("")}>{error}</p>}
      {message && <p className="success-msg" onClick={() => setMessage("")}>{message}</p>}

      <div className="tabs">
        <button className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}>
          Pending ({pending.length})
        </button>
        <button className={`tab ${activeTab === "done" ? "active" : ""}`}
          onClick={() => setActiveTab("done")}>
          Evaluated ({done.length})
        </button>
      </div>

      {activeTab === "pending" && (
        pending.length === 0
          ? <div className="empty-state"><p>No pending submissions</p></div>
          : <div className="judge-grid">{pending.map(s => renderCard(s, true))}</div>
      )}

      {activeTab === "done" && (
        done.length === 0
          ? <div className="empty-state"><p>No evaluated submissions</p></div>
          : <div className="judge-grid">{done.map(s => renderCard(s, false))}</div>
      )}
    </div>
  );
}
