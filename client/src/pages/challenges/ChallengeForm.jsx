import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Challenge.css";
import API from "../../config";

export default function ChallengeForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "", description: "", deadline: "",
    prizes: "", maxTeamSize: 4, tags: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      axios.get(`${API}/api/challenges/${id}`)
        .then(({ data }) => {
          const c = data.data;
          setForm({
            title: c.title,
            description: c.description,
            deadline: c.deadline?.split("T")[0],
            prizes: c.prizes || "",
            maxTeamSize: c.maxTeamSize,
            tags: c.tags?.join(", ") || ""
          });
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()) };

    try {
      if (isEdit) {
        await axios.put(`${API}/api/challenges/${id}`, payload, { headers });
      } else {
        await axios.post(`${API}/api/challenges`, payload, { headers });
      }
      navigate("/challenges");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? "Edit Challenge" : "Create Challenge"}</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-input" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-input" rows="4" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input className="form-input" type="date" value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Prizes</label>
          <input className="form-input" value={form.prizes}
            onChange={(e) => setForm({ ...form, prizes: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Max Team Size</label>
          <input className="form-input" type="number" value={form.maxTeamSize}
            onChange={(e) => setForm({ ...form, maxTeamSize: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input className="form-input" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-primary" type="submit">
            {isEdit ? "Update" : "Create"}
          </button>
          <button className="btn btn-secondary" type="button"
            onClick={() => navigate("/challenges")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
