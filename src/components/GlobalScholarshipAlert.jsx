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

 const getCoverageIcons = (coverage) => {
     const lower = coverage.toLowerCase();
     const icons = [];
 
     if (lower.includes("university") || lower.includes("fee")) {
       icons.push(
         <div key="university" className="icons">
           <School size={24} className="custom-icons" />
           <span className="cover">University</span>
         </div>
       );
     }
 
     if (lower.includes("hostel")) {
       icons.push(
         <div key="hostel" className="icons">
           <Home size={24} className="custom-icons" />
           <span className="cover">Hostel</span>
         </div>
       );
     }
 
     if (lower.includes("stipend")) {
       icons.push(
         <div key="stipend" className="icons">
           <DollarSign size={24} className="custom-icons" />
           <span className="cover">Stipend</span>
         </div>
       );
     }
 
     return icons;
   };

  return (
    <div className="scholarship-alert-square show">
      <button className="close-btn" onClick={() => setShow(false)}>
        <X size={20} />
      </button>
      
        <AlertCircle size={44} className="custom-icons"/>
      
      <div className="text">
        <h2 className="alertdata">{alertData.type}</h2>
        <div className="icon">{iconsToShow}</div>
         <span className="icons-wrapper">{getCoverageIcons(alertData.coverage)}</span>
        <a href={alertData.registrationLink} target="_blank" rel="noopener noreferrer">Apply</a>
      </div>
    </div>
  );
};

export default GlobalScholarshipAlert;
