import { useEffect, useState } from "react";
import { AlertCircle, X, School, Home, DollarSign } from "lucide-react"; 
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
            setTimeout(() => setShow(false), 100000000); 
          }
        })
        .catch((err) => console.error("Scholarship alert error:", err));
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (!alertData || !show) return null;

  const iconsToShow = [];
  const coverage = alertData.coverage?.toLowerCase() || "";

  if (coverage.includes("university")) iconsToShow.push(<School key="school" className="alert-icon" size={28} />);
  if (coverage.includes("hostel")) iconsToShow.push(<Home key="hostel" className="alert-icon" size={28} />);
  if (coverage.includes("stipend")) iconsToShow.push(<DollarSign key="stipend" className="alert-icon" size={28} />);

  return (
    <div className="scholarship-alert-square show">
      <button className="close-btn" onClick={() => setShow(false)}>
        <X size={20} />
      </button>
      
      <div className="text">
        <h2>{alertData.type}</h2>
        <div className="icon">{iconsToShow}</div>
        <p>{alertData.coverage}</p>
        <a href={alertData.registrationLink} target="_blank" rel="noopener noreferrer">Apply</a>
      </div>
    </div>
  );
};

export default GlobalScholarshipAlert;
