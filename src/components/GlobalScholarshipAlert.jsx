import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react"; 
import "./GlobalScholarshipAlert.css";

const GlobalScholarshipAlert = () => {
  const [alertData, setAlertData] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch("http://localhost:5000/api/scholarships/latest")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setAlertData(data);
            setShow(true);
            setTimeout(() => setShow(false), 10000); 
          }
        })
        .catch((err) => console.error("Scholarship alert error:", err));
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (!alertData || !show) return null;

  return (
    <div className="scholarship-alert-square show">
      <button className="close-btn" onClick={() => setShow(false)}>
        <X size={20} />
      </button>
      <AlertCircle className="icon" size={32} />
      <div className="text">
        <p><strong>{alertData.type}</strong></p>
        <p>{alertData.coverage}</p>
        <a href={alertData.registrationLink} target="_blank" rel="noopener noreferrer">Apply</a>
      </div>
    </div>
  );
};

export default GlobalScholarshipAlert;
