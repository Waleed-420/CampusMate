import { useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    coverage: "",
    registrationLink: "",
    validTill: ""
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("scholarship");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/scholarships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Scholarship added successfully!");
      setIsError(false);
      setForm({
        name: "",
        type: "",
        coverage: "",
        registrationLink: "",
        validTill: ""
      });
    } else {
      setMessage(data.error || "Error adding scholarship");
      setIsError(true);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button className={activeTab === "scholarship" ? "active" : ""} onClick={() => setActiveTab("scholarship")}>
          Add Scholarship
        </button>
        <button className={activeTab === "hostel" ? "active" : ""} onClick={() => setActiveTab("hostel")}>
          Approve Hostel
        </button>
      </div>

      {activeTab === "scholarship" && (
        <form className="admin-form" onSubmit={handleSubmit}>
         {message && (
  <div className={`custom-alert ${isError ? "error" : "success"}`}>
    <div className="alert-content">
      <span className="alert-icon">
        {isError ? <XCircle size={20} /> : <CheckCircle size={20} />}
      </span>
      <span className="alert-text">{message}</span>
    </div>
    <span className="alert-close" onClick={() => setMessage("")}>
      <X size={18} />
    </span>
  </div>
)}


          <label>Scholarship Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Scholarship Type:</label>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Merit Based">Merit Based</option>
            <option value="Need Based">Need Based</option>
            <option value="Gov Allocated">Gov Allocated</option>
          </select>

          <label>Coverage:</label>
          <select name="coverage" value={form.coverage} onChange={handleChange} required>
            <option value="">Select Coverage</option>
            <option value="Fee">Fee</option>
            <option value="University + Hostel">University + Hostel</option>
            <option value="University + Hostel + Stipend">University + Hostel + Stipend</option>
          </select>

          <label>Registration Link:</label>
          <input
            type="url"
            name="registrationLink"
            value={form.registrationLink}
            onChange={handleChange}
            required
          />

          <label>Last Date to Apply:</label>
          <input
            type="date"
            name="validTill"
            value={form.validTill}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Scholarship</button>
        </form>
      )}

      {activeTab === "hostel" && (
        <div className="placeholder-tab">
          <p>Hostel approval feature coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
