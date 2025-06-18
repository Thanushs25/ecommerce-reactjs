import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserId } from '../../redux/credentials/idSlice';
import { addReview as addReviewApi } from '../../api/api'; // Alias to avoid naming conflict
import './AddReviewForm.css'; // Create this CSS file for styling

const AddReviewForm = ({ productId, onReviewAdded }) => {
    const dispatch = useDispatch();
    const currentUserId = useSelector(selectUserId);

    // Removed the 'title' state as per your request
    const [reviewContent, setReviewContent] = useState('');
    const [rating, setRating] = useState(0); // For star rating, 0-5
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!currentUserId) {
            setError('User not logged in. Please log in to add a review.');
            setLoading(false);
            return;
        }

        // Updated validation: removed check for 'title'
        if (!reviewContent.trim() || rating === 0) {
            setError('Please fill in the review content and provide a rating.');
            setLoading(false);
            return;
        }

        const reviewData = {
            userId: currentUserId,
            productId: productId,
            review: reviewContent.trim(),
            rating: rating,
        };

        try {
            const response = await addReviewApi(reviewData);
            if (response.success) {
                setSuccess(true);
                setReviewContent('');
                setRating(0);
                onReviewAdded(); // Callback to refresh the review list in parent
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('An unexpected error occurred while submitting your review.');
            console.error('Error submitting review:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-review-form card p-4 shadow-sm mb-4">
            <h4 className="mb-4">Add Your Review</h4>
            <form onSubmit={handleSubmit}>
                {/* Removed the Review Title input field */}
                <div className="mb-3">
                    <label htmlFor="reviewContent" className="form-label">Your Review</label>
                    <textarea
                        className="form-control"
                        id="reviewContent"
                        rows="4"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Share your thoughts about the product..."
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating</label>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'filled' : ''}`}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer', fontSize: '1.5rem', color: star <= rating ? '#ffc107' : '#e4e5e9' }}
                            >
                                &#9733; {/* Unicode for a star character */}
                            </span>
                        ))}
                    </div>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">Review added successfully!</div>}
                <button type="submit" className="btn mt-3" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default AddReviewForm;
