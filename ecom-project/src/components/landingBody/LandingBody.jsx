import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProduct, selectError, selectLoading, selectProducts } from '../../redux/product/productSlice';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap'; // Removed Button from here
import MyCustomButton from '../Others/Button'; // Import your custom button
import './landingBody.css';

const LandingBody = () => {
    const dispatch = useDispatch();
    const [productData, setProductData] = useState(); // productData state isn't directly used after setting. Consider removing if not needed elsewhere.
    const navigate = useNavigate();

    const products = useSelector(selectProducts);
    const randomProducts = [...products].sort(() => Math.random() - 0.5) // Randomly shuffle products
    const productsToShow = randomProducts.slice(0, 20); 
    
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    const handleProductData = (data) => {
        setProductData(data); // This state update happens, but productData isn't used after this point.
        navigate('/product', { state: { message: data } });
    }

    useEffect(() => {
        dispatch(fetchProduct());
    }, [dispatch]);

    return (
        <Container className="my-5 py-4">
            <h2 className="text-center mb-5 text-dark fw-bold">Our Products</h2>
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" variant="warning" role="status">
                        <span className="visually-hidden">Loading products...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center my-5">
                    <p className="mb-0">{error}</p>
                    <p className="mb-0 mt-2">Please try again later.</p>
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} xl={4} className="g-4 justify-content-center">
                    {productsToShow.map((item, index) => (
                        <Col key={item.id || index}>
                            <Card className="h-100 product-card shadow-sm border-0">
                                <Card.Img variant="top" src={item.imageUrl} alt={item.name} className="card-img-custom" />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className=" fw-bold mb-2">{item.name}</Card.Title>
                                    <Card.Text className="text-muted flex-grow-1">{item.desc}</Card.Text>
                                    {/* Use your custom button here */}
                                    <MyCustomButton
                                        onClick={() => handleProductData(item)}
                                        // You might want to adjust the width of the custom button or its container if 100% width is desired
                                        // Consider adding a prop to your custom button for full width or apply CSS to its parent.
                                        style={{ width: '100%', marginTop: 'auto' }} // Added inline style as a quick fix, better to handle in CSS
                                    >
                                        View
                                    </MyCustomButton>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default LandingBody;