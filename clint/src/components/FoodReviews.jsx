// src/components/FoodReviews.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const FoodReviews = ({ foodId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!foodId) {
      setError("Invalid Food ID");
      return;
    }

    console.log("Fetching reviews for Food ID:", foodId); // Debugging
    axios
      .get(`http://localhost:5000/api/review/food-reviews/${foodId}`)
      .then((response) => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews.");
        setLoading(false);
      });
  }, [foodId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Reviews:</h3>
      {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((review) => (
        <div key={review._id} className="border p-2 rounded">
          <p>{review.review}</p>
          <small>Posted on {new Date(review.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default FoodReviews;
