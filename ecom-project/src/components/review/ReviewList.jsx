import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteReviewById, updateReviewById } from '../../api/api'; // Import API functions
import { selectUserId } from '../../redux/credentials/idSlice';
import './ReviewList.css'; // Optional CSS for styling

const ReviewList = ({ reviews, onUpdate }) => {
    console.log('ReviewList component rendered with reviews:', reviews);
    const currentUserId = useSelector(selectUserId);

    // State to manage which review is being edited and its content
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return; // User canceled the deletion
        }

        try {
            const response = await deleteReviewById(currentUserId, reviewId);
            if (response.success) {
                alert('Review deleted successfully.');
                onUpdate(); // Trigger a refresh or update of the review list
            } else {
                alert(response.error || 'Failed to delete the review.');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert(error.message || 'An unexpected error occurred while deleting the review.');
        }
    };

    const handleEditReview = (review) => {
        setEditingReviewId(review.reviewId);
        setEditedContent(review.review); // Initialize textarea with current review content
    };

    const handleSaveEdit = async (reviewId) => {
        try {
            const response = await updateReviewById(currentUserId, reviewId, { review: editedContent });
            if (response.success) {
                alert('Review updated successfully.');
                setEditingReviewId(null); // Exit editing mode
                setEditedContent(''); // Clear edited content state
                onUpdate(); // Trigger a refresh or update of the review list
            } else {
                alert(response.error || 'Failed to update the review.');
            }
        } catch (error) {
            console.error('Error updating review:', error);
            alert(error.message || 'An unexpected error occurred while updating the review.');
        }
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null); // Exit editing mode
        setEditedContent(''); // Clear edited content state
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? 'text-warning' : 'text-muted'}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="review-list">
            {reviews.length === 0 ? (
                <p className="text-center text-muted">No reviews available for this product.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.reviewId} className="review-card shadow-sm p-3 mb-3">
                        {editingReviewId === review.reviewId ? (
                            <textarea
                                className="form-control mb-2"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                rows="3"
                            />
                        ) : (
                            <p className="review-content">{review.review}</p>
                        )}

                        <p className="review-rating">{renderStars(review.rating)}</p>
                        <p className="review-author text-muted">By User: {review.userName}</p>
                        {/* <p className="review-date text-muted">
                            Reviewed on: {new Date(review.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p> */}
                        {currentUserId === review.userId && (
                            <div className="review-actions mt-3">
                                {editingReviewId === review.reviewId ? (
                                    <>
                                        <button
                                            className="btn btn-successs btn-sm me-2"
                                            onClick={() => handleSaveEdit(review.reviewId)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-primaryy btn-sm me-2"
                                            onClick={() => handleEditReview(review)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteReview(review.reviewId)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;