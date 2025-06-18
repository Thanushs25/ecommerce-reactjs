// src/components/PaymentMethods.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';
import NavigationBar from '../components/navigation/NavigationBar'; // Assuming NavigationBar is in the same folder or adjust path
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap'; // Import Bootstrap components
import './PaymentMethods.css'; // New CSS file for this component
import Footer from '../components/navigation/Footer';

const PaymentMethods = () => {
    const navigate = useNavigate();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { cartId } = useLocation().state || {}; // Safely destructure cartId

    // Define payment options with clear disabled status and helper text
    const paymentOptions = [
        { value: '', label: 'Select a payment method', disabled: true },
        { value: 'GPay', label: 'GPay (Unavailable)', disabled: true },
        { value: 'Paytm', label: 'Paytm (Unavailable)', disabled: true },
        { value: 'PhonePe', label: 'PhonePe (Unavailable)', disabled: true },
        { value: 'BHIM', label: 'BHIM (Unavailable)', disabled: true },
        { value: 'Amazon Pay', label: 'Amazon Pay (Unavailable)', disabled: true },
        { value: 'COD', label: 'Cash On Delivery', disabled: false },
    ];

    // Effect to close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleOptionClick = (optionValue, isDisabled) => {
        if (isDisabled) return;
        console.log(`Selected payment method: ${optionValue}`);

        setSelectedPaymentMethod(optionValue);
        setIsDropdownOpen(false);
        setErrorMessage(''); // Clear error message on selection
    };

    const handleProceedToSuccess = async () => {
        if (!selectedPaymentMethod) {
            setErrorMessage('Please select a payment method to proceed.');
            return;
        }

        if (selectedPaymentMethod !== 'COD') {
            setErrorMessage('Only Cash On Delivery is currently available. Please select COD.');
            // Optionally reset selection if it's not COD
            setSelectedPaymentMethod('');
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage(''); // Clear previous error
            
            // Check if cartId is available before making the API call
            if (!cartId) {
                throw new Error("Cart ID is missing. Cannot place order.");
            }

            const response = await axiosConfig.post(`/user/orders/${cartId}`);
            if (response.status === 201) {
                console.log("Order placed successfully:", response.data);
                navigate('/user/orderSuccess');
            } else {
                throw new Error("Failed to place order.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setErrorMessage(error.response?.data?.message || error.message || "Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Determine the label to display in the dropdown
    const displayLabel = selectedPaymentMethod
        ? paymentOptions.find(opt => opt.value === selectedPaymentMethod)?.label
        : 'Select a payment method';

    return (
        <>
            <NavigationBar /> {/* Include the navigation bar */}
            <div className="payment-methods-wrapper"> {/* Overall page wrapper */}
                <Container className="my-5"> {/* Bootstrap container for responsiveness and spacing */}
                    <Card className="payment-card shadow-sm"> {/* Card styling */}
                        <Card.Body className="p-4 p-md-5"> {/* Padding inside the card */}
                            <h2 className="payment-card-title text-center mb-4">Choose Payment Method</h2> {/* Heading style */}

                            {isLoading ? (
                                <div className="d-flex justify-content-center my-5">
                                    <Spinner animation="border" variant="primary" role="status">
                                        <span className="visually-hidden">Placing order...</span>
                                    </Spinner>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4" ref={dropdownRef}>
                                        <div
                                            className={`payment-dropdown-toggle form-control d-flex justify-content-between align-items-center ${isDropdownOpen ? 'active' : ''}`}
                                            onClick={handleDropdownToggle}
                                            tabIndex="0"
                                            role="button"
                                            aria-haspopup="listbox"
                                            aria-expanded={isDropdownOpen}
                                        >
                                            <span className={selectedPaymentMethod === '' ? 'text-muted' : ''}>
                                                {displayLabel}
                                            </span>
                                            <span className={`payment-dropdown-caret ms-2 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                                &#9660; {/* Unicode down arrow */}
                                            </span>
                                        </div>
                                        {isDropdownOpen && (
                                            <ul
                                                className="payment-dropdown-menu list-group position-relative w-100 mt-1 shadow-sm"
                                                role="listbox"
                                            >
                                                {paymentOptions.map((option) => (
                                                    <li
                                                        key={option.value || 'default'}
                                                        className={`list-group-item payment-dropdown-item ${option.disabled ? 'disabled-option' : ''} ${
                                                            selectedPaymentMethod === option.value ? 'selected-option' : ''
                                                        }`}
                                                        onClick={() => handleOptionClick(option.value, option.disabled)}
                                                        role="option"
                                                        aria-selected={selectedPaymentMethod === option.value}
                                                        tabIndex={option.disabled ? -1 : 0} // Make disabled options not tabbable
                                                    >
                                                        {option.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    {errorMessage && (
                                        <Alert variant="danger" className="text-center mt-3">
                                            {errorMessage}
                                        </Alert>
                                    )}
                                    <div className="d-grid mt-4"> {/* Use d-grid for full-width button */}
                                        <button
                                        
                                            className="payment-btn-filled" // Reusing Address component's button styling
                                            onClick={handleProceedToSuccess}
                                            disabled={isLoading || !selectedPaymentMethod || selectedPaymentMethod !== 'COD'}
                                        >
                                            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default PaymentMethods;