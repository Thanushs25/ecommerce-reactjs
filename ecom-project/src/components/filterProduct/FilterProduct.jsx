import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCustomButton from '../Others/Button'; // Import your custom button

const FilterProduct = ({ products, searchQuery }) => {
    const navigate = useNavigate();

    const handleProductData = (data) => {
        navigate('/product', { state: { message: data } });
    }

    if (!products) {
        return <p className="text-center mt-5">No products to display.</p>; // Added margin-top for spacing
    }

    return (
        <div className="container py-5">
            {searchQuery && products.length > 0 && (
                <div className="row justify-content-center mb-4">
                    <h2 className="text-center">Search Results for "{searchQuery}"</h2>
                </div>
            )}
            <div className="row">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4"> {/* Adjusted column classes for better responsiveness */}
                            <div className="card h-100 shadow-sm border-0 product-card-custom"> {/* Added h-100 for equal height, border-0, and custom class */}
                                <img
                                    src={product.imageUrl}
                                    className="card-img-top product-card-img"
                                    alt={product.name}
                                    style={{ objectFit: 'cover', height: '200px' }} // Ensured consistent image size
                                />
                                <div className="card-body d-flex flex-column"> {/* Flex column for better button positioning */}
                                    <h5 className="card-title text-dark mb-2">{product.name}</h5> {/* Darker text for readability */}
                                    <p className="card-text text-muted flex-grow-1">{product.desc}</p> {/* Flex-grow to push button down */}
                                    {/* Replaced Bootstrap button with MyCustomButton */}
                                    <MyCustomButton
                                        onClick={() => handleProductData(product)}
                                        style={{ width: '100%', marginTop: 'auto' }} // Added width and margin-top for consistent look
                                    >
                                        View
                                    </MyCustomButton>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-12">No products found matching your criteria.</p>
                )}
            </div>
            {/* Custom CSS for product cards (kept as is) */}
            <style jsx>{`
                .product-card-custom {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
                .product-card-custom:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                .product-card-img {
                    border-bottom: 1px solid #eee; /* Subtle separator for image and body */
                }
            `}</style>
        </div>
    );
};

export default FilterProduct;