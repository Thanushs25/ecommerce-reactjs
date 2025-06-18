import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ViewMore.css'; // Your custom CSS for the button

const ViewMoreButton = ({ linkTo = '/products', text = 'View All Products' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/search');
    };

    return (
        <div className="view-more-button-container">
            <Button
                variant="primary" 
                className="view-more-btn"
                onClick={handleClick}
            >
                {text}  <i class="fa-solid fa-arrow-right"></i>
            </Button>
        </div>
    );
};

export default ViewMoreButton;