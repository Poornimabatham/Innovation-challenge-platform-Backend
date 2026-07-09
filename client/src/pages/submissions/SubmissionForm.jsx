import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Challenge.css";
import API from "../../config";

export default function SubmissionForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    team: "", challenge: "", githubLink: "", pdfUrl: "", videoUrl: "", note: ""
  });
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/teams/my`, { headers })
      .then(({ data }) => setTeams(data.data))
      .catch(() => setError("Failed to load teams"));

    if (isEdit) {
      axios.get(`${API}/api/submissions/${id}`, { headers })
        .then(({ data }) => {
          const s = data.data;
          setForm({
            team: s.team?._id,
            challenge: s.challenge?._id,
            githubLink: s.githubLink || "",
            pdfUrl: s.pdfUrl || "",
            videoUrl: s.videoUrl || "",
            note: ""
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTeamChange = (teamId) => {
    const selected = teams.find(t => t._id === teamId);
    setForm({ ...form, team: teamId, challenge: selected?.challenge?._id || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API}/api/submissions/${id}`, form, { headers });
      } else {
        await axios.post(`${API}/api/submissions`, form, { headers });
      }
      navigate("/submissions");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? "Update Submission" : "New Submission"}</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isEdit && (
          <div className="form-group">
            <label>Select Your Team</label>
            <select className="form-input" value={form.team}
              onChange={(e) => handleTeamChange(e.target.value)} required>
              <option value="">-- Select Team --</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} — {t.challenge?.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label>GitHub Link</label>
          <input className="form-input" placeholder="https://github.com/..." value={form.githubLink}
            onChange={(e) => setForm({ ...form, githubLink: e.target.value })} />
        </div>
        <div className="form-group">
          <label>PDF URL</label>
          <input className="form-input" placeholder="https://drive.google.com/..." value={form.pdfUrl}
            onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Video URL</label>
          <input className="form-input" placeholder="https://youtube.com/..." value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Note {isEdit && "(Version note)"}</label>
          <textarea className="form-input" rows="3" placeholder="Describe your changes..."
            value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-primary" type="submit">
            {isEdit ? "Update" : "Submit"}
          </button>
          <button className="btn btn-secondary" type="button"
            onClick={() => navigate("/submissions")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
