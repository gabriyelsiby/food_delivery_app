import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { useParams } from "react-router-dom";

const ReviewPage = () => {
  const { foodId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all reviews for this food item
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/review/food-reviews/${foodId}`);
      setReviews(res.data.data || []); // Ensure reviews is an array
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to load reviews.";
      if (errorMessage === "No reviews found for this food item") {
        setReviews([]); // Set reviews to an empty array if no reviews are found
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [foodId]);

  // Add or update a review
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingReview) {
        // Delete old review first (since your backend prevents duplicates)
        await axios.delete(`/review/delete-review/${editingReview._id}`);
      }

      await axios.post("/review/add-review", {
        foodId,
        rating,
        comment
      });

      setRating(5);
      setComment("");
      setEditingReview(null);
      fetchReviews();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };

  // Delete a review
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`/review/delete-review/${reviewId}`);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };

  // Set the form for editing
  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReview(review);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Food Reviews</h1>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded-xl shadow">
        <div>
          <label className="block font-medium mb-1">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {editingReview ? "Update Review" : "Submit Review"}
        </button>
      </form>

      {/* Display Reviews */}
      <h2 className="text-xl font-semibold mt-8 mb-3">All Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet for this food.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 border rounded-xl shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Rating: {review.rating} ⭐</span>
                {review.userId?.name && (
                  <span className="text-sm text-gray-600">by {review.userId.name}</span>
                )}
              </div>
              <p className="mt-2 text-gray-800">{review.comment}</p>
              <div className="flex space-x-2 mt-3">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEdit(review)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
