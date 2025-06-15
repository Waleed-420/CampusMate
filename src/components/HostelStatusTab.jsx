import React, { useEffect, useState } from "react";

const HostelStatusTab = () => {
  const [user, setUser] = useState(null);
  const [appliedHostelDetails, setAppliedHostelDetails] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok && data.hasAppliedHostel) {
      setUser(data);
      fetchHostel(data.appliedHostel.hostelId);
    }
  };

  const fetchHostel = async (id) => {
    const res = await fetch(`http://localhost:5000/api/hostels/${id}`);
    const data = await res.json();
    setAppliedHostelDetails(data);
  };

  if (!user || !appliedHostelDetails) return <p>Loading...</p>;

  return (
    <div className="applied-hostel-card">
      <h2>Hostel Application Status</h2>
      <h3>{appliedHostelDetails.name}</h3>
      <p><strong>Owner:</strong> {appliedHostelDetails.owner?.username} ({appliedHostelDetails.owner?.email})</p>
      {user.appliedHostel.status === 'approved' ? (
        <p><strong>Owner Phone:</strong> {appliedHostelDetails.ownerPhone}</p>
      ) : (
        <p><em>Owner phone number will be available after approval.</em></p>
      )}
      <p><strong>Room Type:</strong> {user.appliedHostel.roomType}</p>
      <p><strong>Status:</strong> {user.appliedHostel.status}</p>
    </div>
  );
};

export default HostelStatusTab;
