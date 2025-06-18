// src/pages/Product.jsx
import React, { useEffect } from 'react';
import Navbar from '../components/navigation/NavigationBar';
import FixedCarousel from '../components/imageCarousel/FixedCarousel';
import { useLocation } from 'react-router-dom';
import VariantCarousel from '../components/variantCarousel/VariantCarousel';
import ReviewList from '../components/review/ReviewList';
import AddReviewForm from '../components/review/AddReviewForm'; // Import the new component
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsByProductId } from '../redux/review/reviewSlice';
import { selectUserId } from '../redux/credentials/idSlice'; // Import selector for current user ID
import Footer from '../components/navigation/Footer';
 // Adjust path if you save it elsewhere

const Product = () => {
    const location = useLocation();
    const product = location.state || { message: {} };
    const productData = product.message || {};
    console.log('Product Data:', productData);

    const dispatch = useDispatch();
    const { reviews, loading, error } = useSelector((state) => state.reviews);
    const currentUserId = useSelector(selectUserId); // Get the current user ID

    const refreshReviews = () => {
        if (productData.productId) {
            console.log('Refreshing reviews for product ID:', productData.productId);
            dispatch(fetchReviewsByProductId(productData.productId));
        }
    };

    useEffect(() => {
        refreshReviews();
        window.scrollTo(0, 0); 
    }, [dispatch, productData.productId]);

    // Check if the current user has already submitted a review
    const hasUserReviewed = reviews.some((review) => review.userId === currentUserId);

    return (
        <>
            <Navbar />
            <div className="container-fluid mt-5 pt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-6 mt-2">
                        <FixedCarousel product={productData} />
                    </div>
                    <div className="col-lg-6 mt-2">
                    <div className="p-4 bg-light rounded shadow-sm h-100 d-flex flex-column justify-content-between">
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Added inline style here */}
        <h1 className="display-5 fw-bold text-dark mb-3">{productData.name || 'Product Name'}</h1>
        <p className="lead text-muted mb-4">{productData.desc || 'Product description goes here.'}</p>
        <p className="text-secondary">Category: <span className="fw-semibold">{productData.category || 'N/A'}</span></p>
        <p className="text-secondary">Subcategory: <span className="fw-semibold">{productData.subCategory || 'N/A'}</span></p>
    </div>
</div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <VariantCarousel
                            product={productData}
                            productCategory={productData.category}
                            productVariants={productData.productVariants}
                        />
                    </div>
                </div>

                {/* Add Review Form */}
                {!hasUserReviewed && ( // Only show the form if the user hasn't reviewed yet
                    <div className="row">
                        <div className="col-12 col-md-8 offset-md-2"> {/* Centered and narrower column */}
                        <h3 className="text-center mb-4">Share Your Thoughts...</h3>

                            <AddReviewForm
                                productId={productData.productId}
                                onReviewAdded={refreshReviews} // Pass the refresh function
                            />
                        </div>
                    </div>
                )}

                {/* Review List */}
                <div className="row mt-3">
                    <div className="col-12">
                        <h3 className="text-center mb-4">Customer Reviews</h3>
                        {loading && <p className="text-center text-muted">Loading reviews...</p>}
                        {error && <p className="text-center text-danger">{error}</p>}
                        {!loading && !error && (
                            <ReviewList reviews={reviews} onUpdate={refreshReviews} />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;