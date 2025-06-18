import React from 'react';
import './FixedCarousel.css'; // Assuming you have a CSS file for styles

const FixedCarousel = ({ product }) => {
    return (
        // Adjusted width, added mx-auto and subtle shadow for a distinct look
        <div className="fixed-carousel-container shadow-lg rounded overflow-hidden">
            <img 
                src={product.imageUrl} 
                className="d-block w-100 fixed-carousel-img" 
                alt={product.name || "Product Image"} 
            />
        </div>
    );
};

export default FixedCarousel;