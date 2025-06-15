import { useParams } from "react-router-dom";
import universities from "/public/data/universities.json";
import { useState } from "react";

export default function UniversityDetail() {
  const { id } = useParams();
  const uni = universities.find(u => u.id === id);
  const [reviewed, setReviewed] = useState(localStorage.getItem(id));
  const [review, setReview] = useState({ stars: 0, comment: "" });

  const handleReview = () => {
    if (review.stars && review.comment) {
      uni.ratings.push({ username: "You", ...review });
      localStorage.setItem(id, "true");
      setReviewed(true);
    }
  };

  return (
    <div>
      <div className="carousel" style={{ height: "300px", width: "100%", overflow: "hidden" }}>
        {uni.images.map((img, i) => (
          <img key={i} src={img} alt={uni.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
        ))}
      </div>

      <h1>{uni.name}</h1>
      <p>{uni.about}</p>
      <p><a href={uni.enrollmentLink} target="_blank">Apply Here</a></p>

      <h3>Reviews</h3>
      {uni.ratings.map((r, i) => (
        <div key={i} className="review">
          <strong>{r.username}</strong> - {r.stars}★
          <p>{r.comment}</p>
        </div>
      ))}

      {!reviewed && (
        <div className="add-review">
          <input type="number" placeholder="Stars (1-5)" value={review.stars} onChange={e => setReview({ ...review, stars: e.target.value })} />
          <textarea placeholder="Comment" value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })}></textarea>
          <button onClick={handleReview}>Submit Review</button>
        </div>
      )}

      <h3>Location</h3>
      <div style={{ height: "300px", width: "100%" }}>
        
        <iframe
          width="100%"
          height="300"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${uni.latitude},${uni.longitude}&z=15&output=embed`}
        ></iframe>
      </div>

      <h3>Nearby Hostels</h3>
      {uni.hostels.map(h => (
        <div key={h.id} className="hostel-card" onClick={() => window.location.href = `/hostel/${h.id}`}>
          <img src={h.image} alt={h.name} />
          <h4>{h.name}</h4>
          <p>Sharing: {h.roomSharing}</p>
          <p>Price: {h.price}</p>
          <p>Distance: {h.distance}</p>
        </div>
      ))}
    </div>
  );
}
