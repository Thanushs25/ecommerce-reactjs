// src/components/OrderSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/navigation/NavigationBar'; // Assuming NavigationBar is in the same folder or adjust path
import { Container, Card, Button } from 'react-bootstrap'; // Import Bootstrap components
import { CheckCircleFill } from 'react-bootstrap-icons'; // For a success icon
import './OrderSuccess.css'; // New CSS file for this component
import Footer from '../components/navigation/Footer';

const OrderSuccess = () => {
    const navigate = useNavigate();

    // Simulating a random number of days for delivery
    const daysArray = [2, 4, 6, 8];
    const days = daysArray[Math.floor(Math.random() * daysArray.length)];

    const handleViewOrders = () => {
        navigate('/user/orders');
    };

    return (
        <>
            <NavigationBar /> {/* Include the navigation bar */}
            <div className="order-success-wrapper"> {/* Overall page wrapper */}
                <Container className="my-5"> {/* Bootstrap container for responsiveness and spacing */}
                    <Card className="order-success-card shadow-sm text-center"> {/* Card styling with centered text */}
                        <Card.Body className="p-4 p-md-5"> {/* Padding inside the card */}
                            <CheckCircleFill className="order-success-icon mb-4" /> {/* Success icon */}
                            <h1 className="order-success-title mb-3">Order Placed Successfully!</h1> {/* Main success message */}
                            <p className="order-success-message mb-3">Thank you for your purchase.</p>
                            <p className="order-success-delivery mb-4">
                                Your order is estimated to be delivered in **{days} business days**.
                            </p>
                            <Button
                                variant="primary"
                                className="order-success-btn" // Reusing button styling concept
                                onClick={handleViewOrders}
                            >
                                View Orders
                            </Button>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default OrderSuccess;