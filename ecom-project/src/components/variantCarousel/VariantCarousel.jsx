import React, { useState } from 'react';
import axiosConfig from '../../api/axiosConfig';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../redux/credentials/idSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap'; // Import Bootstrap components
import './VariantCarousel.css'; // Import custom styles for the variant carousel
import { useNavigate } from 'react-router-dom';
 
const VariantCarousel = ({ product, productVariants = [], productCategory }) => {
    const [selectedVariant, setSelectedVariant] = useState(productVariants[0]);
    const [quantities, setQuantities] = useState(
        productVariants.reduce((acc, variant) => {
            acc[variant.productVariantId] = 1; // Default quantity is 1 for each variant
            return acc;
        }, {})
    );
    const [error, setError] = useState(null);
    const productId = product.productId;
    const navigate = useNavigate();
    const userId = useSelector(selectUserId);
 
    // Carousel state
    const [startIndex, setStartIndex] = useState(0);
    const cardsPerPage = 4; // Number of cards to show per slide
 
    const handleVariantClick = (variant) => {
        setSelectedVariant(variant);
    };
 
    const handleQuantityChange = (variantId, quantity) => {
        const variant = productVariants.find(v => v.productVariantId === variantId);
        const maxStock = variant?.stock || 1; // Ensure stock is at least 1
        const newQuantity = Math.max(1, Math.min(quantity, maxStock)); // Quantity should be at least 1 and not exceed stock
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [variantId]: newQuantity,
        }));
    };
 
    const handleAddToCart = async (productId, variantId, userId, quantity) => {
        if (!userId) {
            toast.error('Please login to add items to cart.');
            return;
        }
        if (quantity < 1) {
            toast.error('Quantity must be at least 1.');
            return;
        }
 
        const variantInStock = productVariants.find(v => v.productVariantId === variantId);
        if (variantInStock && variantInStock.stockStatus !== 'available') {
            toast.error('This product variant is currently out of stock.');
            return;
        }
        if (variantInStock && quantity > variantInStock.stock) {
            toast.error(`Only ${variantInStock.stock} items available in stock.`);
            return;
        }
 
        try {
            const params = new URLSearchParams();
            params.append('quantity', quantity);
            const response = await axiosConfig.post(
                `user/carts/addCart/products/${productId}/variant/${variantId}/users/${userId}`,
                null,
                { params }
            );
            setQuantities((prevQuantities) => ({
                ...prevQuantities,
                [variantId]: 1, // Reset quantity for the variant after adding to cart
            }));
            toast.success('Product added to cart successfully!');
            setError(null);
            console.log('Add to cart response:', response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart.');
            setError(error.response?.data?.message || 'Failed to add to cart.');
        }
    };
 
    // Carousel navigation handlers
    const handlePrev = () => {
        setStartIndex((prevIndex) => Math.max(0, prevIndex - cardsPerPage));
    };
 
    const handleNext = () => {
        setStartIndex((prevIndex) =>
            Math.min(prevIndex + cardsPerPage, productVariants.length - cardsPerPage)
        );
    };
 
    const visibleVariants = productVariants.slice(
        startIndex,
        startIndex + cardsPerPage
    );
 
    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center text-dark fw-bold text-uppercase">
                {productCategory ? `${productCategory} Variants` : 'Product Variants'}
            </h2>
            {productVariants.length === 0 ? (
                <Row className="justify-content-center">
                    <Col xs={12} className="text-center">
                        <Alert variant="info">No variants available for this product.</Alert>
                    </Col>
                </Row>
            ) : (
                <div className="carousel-wrapper">
                    <Button
                        className="carousel-control prev"
                        onClick={handlePrev}
                        disabled={startIndex === 0}
                    >
                        &lt;
                    </Button>
                    <div className="variant-carousel-container">
                        <Row xs={1} md={2} lg={3} xl={4} className="g-4 flex-nowrap carousel-row">
                            {visibleVariants.map((variant) => (
                                <Col key={variant.productVariantId}>
                                    <Card className="h-100 variant-card shadow-sm">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="fw-bold mb-2 card-texts">
                                                {variant.attributes?.brand || "Brand: N/A"}
                                            </Card.Title>
                                            {productCategory?.toLowerCase() === "electronics" ? (
                                                <>
                                                    <p className="card-text text-secondary mb-1">Processor: <span className="fw-medium">{variant.attributes?.processor || "N/A"}</span></p>
                                                    <p className="card-text text-secondary mb-1">RAM: <span className="fw-medium">{variant.attributes?.ram || "N/A"}</span></p>
                                                    <p className="card-text text-secondary mb-3">Storage: <span className="fw-medium">{variant.attributes?.storage || "N/A"}</span></p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="card-text text-secondary mb-1">Colour: <span className="fw-medium">{variant.attributes?.colour || "N/A"}</span></p>
                                                    <p className="card-text text-secondary mb-3">Size: <span className="fw-medium">{variant.attributes?.size || "N/A"}</span></p>
                                                </>
                                            )}
 
                                            <p className="card-text fs-5 fw-bold text-success mt-auto">Price: ₹{variant.price ? variant.price.toFixed(2) : "N/A"}</p>
                                            <p className={`card-text fw-semibold ${variant.stockStatus === 'available' ? 'text-success' : 'text-danger'}`}>
                                                Status: {variant.stockStatus || "N/A"} ({variant.stock} in stock)
                                            </p>
 
                                            {userId ? (
                                                <>
                                                    <Form.Group controlId={`quantity-${variant.productVariantId}`} className="mb-3">
                                                        <Form.Label>Quantity:</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            max={variant.stock || 1}
                                                            value={quantities[variant.productVariantId] || 1}
                                                            onChange={(e) =>
                                                                handleQuantityChange(variant.productVariantId, Number(e.target.value))
                                                            }
                                                            disabled={variant.stockStatus !== 'available'}
                                                            className="quantity-input"
                                                        />
                                                    </Form.Group>
                                                    <button
                                                        variant="warning"
                                                        className="cart-log-btn text-center mt-3 mb-0"
                                                        disabled={variant.stockStatus !== 'available'}
                                                        onClick={() =>
                                                            handleAddToCart(productId, variant.productVariantId, userId, quantities[variant.productVariantId])
                                                        }
                                                    >
                                                        {variant.stockStatus === 'available' ? 'Add to Cart' : 'Out of Stock'}
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="cart-log-btn text-center mt-3 mb-0" onClick={() => navigate('/user/login')}>
                                                    Login to add to cart
                                                </button>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                    <Button
                        className="carousel-control next"
                        onClick={handleNext}
                        disabled={startIndex >= productVariants.length - cardsPerPage}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};
 
export default VariantCarousel;