// C:\food_deliveryapp - test\client\src\pages\FoodDetails.jsx

import React, { useEffect, useState } from 'react';
import axios from '../config/axios'; // using your axios setup
import { useParams } from 'react-router-dom';

const FoodDetails = () => {
    const { foodId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewsAndRating = async () => {
            try {
                const reviewsRes = await axios.get(`/review/food-reviews/${foodId}`);
                setReviews(reviewsRes.data.data);

                const ratingRes = await axios.get(`/review/average-rating/${foodId}`);
                setAverageRating(ratingRes.data.data);
            } catch (error) {
                console.error(error);
                setReviews([]); // fallback if no reviews
            } finally {
                setLoading(false);
            }
        };

        fetchReviewsAndRating();
    }, [foodId]);

    if (loading) return <div className="p-4">Loading reviews...</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Food Reviews</h2>

            {averageRating !== null ? (
                <div className="mb-6">
                    <span className="font-semibold">Average Rating:</span> 
                    <span className="ml-2 text-yellow-500">
                        {`⭐️ ${averageRating} / 5`}
                    </span>
                </div>
            ) : (
                <div className="mb-6 text-gray-500">No ratings yet</div>
            )}

            {reviews.length > 0 ? (
                <ul className="space-y-4">
                    {reviews.map((review) => (
                        <li key={review._id} className="border p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                                <img 
                                    src={review.userId.profilePicture} 
                                    alt={review.userId.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-semibold">{review.userId.name}</p>
                                    <p className="text-yellow-500">⭐️ {review.rating} / 5</p>
                                </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-gray-500">No reviews for this food item.</div>
            )}
        </div>
    );
};

export default FoodDetails;
