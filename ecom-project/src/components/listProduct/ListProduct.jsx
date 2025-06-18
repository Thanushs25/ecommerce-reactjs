// src/components/listProduct/ListProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../../api/axiosConfig';
import { Card, Button, Form, Badge, Row, Col, Spinner, Alert } from 'react-bootstrap'; // Import Bootstrap components
import './ListProduct.css'; // New CSS for ListProduct component
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListProduct = ({ products }) => {
    const [selectedOption, setSelectedOption] = useState('none');
    const navigate = useNavigate();

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const filteredProducts = products
        ?.map((product) => ({
            ...product,
            productVariants: product.productVariants?.filter((variant) =>
                selectedOption === 'none' ? true : variant.stockStatus === selectedOption
            ),
        }))
        .filter((product) => product.productVariants?.length > 0) || [];

    const handleUpdateProduct = (product) => {
        const originalProduct = products.find((p) => p.productId === product.productId);
        navigate(`/admin/updateProduct/${product.productId}`, { state: { product: originalProduct } });
    };

    const handleDeleteProduct = async (product) => {
        console.log("Deleting product:", product);
        try {
            // Assuming adminId is part of the product object or accessible here
            const response = await axiosConfig.delete(`/admin/manage/deleteProduct/${product.productId}/admin/${product.adminId}`);
            console.log("Product deleted successfully:", response.data);
            toast.success("Product deleted successfully!"); // Use toast for user feedback
            if (response.data) {
                // A better approach would be to dispatch an action to remove the product from Redux store
                window.location.reload(); // For now, simple reload as per original logic
            }
        } catch (error) {
            console.error("Error deleting product:", error.response?.data || error.message);
            alert(`Failed to delete product: ${error.response?.data || error.message}`); // Provide user feedback
        }
    };

    return (
        <div className="list-product-container">
            <Row className="justify-content-center mb-4">
                <Col md={6} lg={4}>
                    <Form.Select
                        className="shadow-sm product-filter-select"
                        aria-label="Filter by stock status"
                        value={selectedOption}
                        onChange={handleSelectChange}
                    >
                        <option value="none">All Products</option>
                        <option value="available">In Stock</option>
                        <option value="out of stock">Out of Stock</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="product-cards-grid"> {/* Grid for product cards */}
                <ProductList products={filteredProducts} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} />
            </Row>
        </div>
    );
};

const ProductList = ({ products, onUpdateProduct, onDeleteProduct }) => (
    <>
        {products?.length === 0 ? (
            <Col xs={12} className="text-center py-5">
                <p className="lead text-muted">No products found matching your criteria.</p>
            </Col>
        ) : (
            products.map((product) => (
                <Col key={product.productId} xs={12} md={6} lg={4} className="mb-4"> {/* Responsive columns for cards */}
                    <ProductCard product={product} onUpdateProduct={onUpdateProduct} onDeleteProduct={onDeleteProduct} />
                </Col>
            ))
        )}
    </>
);

const ProductCard = ({ product, onUpdateProduct, onDeleteProduct }) => (
    <Card className="h-100 product-management-card border-0 shadow-sm">
        <Row className="g-0 h-100"> {/* Ensure row inside card takes full height */}
            <Col md={4} className="d-flex align-items-center justify-content-center p-3 product-image-col">
                <Card.Img
                    src={product.imageUrl}
                    alt="Product"
                    className="product-card-img"
                />
            </Col>
            <Col md={8}>
                <Card.Body className="d-flex flex-column justify-content-between h-100"> {/* Ensure body fills height */}
                    <div>
                        <Card.Title className="text-primary fw-semibold mb-2 product-card-title">{product.name}</Card.Title>
                        <div className="d-flex flex-wrap gap-2 product-variants-badges">
                            {product.productVariants?.map((variant) => (
                                <Badge
                                    key={variant.productVariantId}
                                    pill
                                    bg={variant.stockStatus === 'available' ? 'success' : 'danger'}
                                    className="px-3 py-2 product-variant-badge"
                                >
                                    {variant.productVariantId}: {variant.stockStatus === 'available' ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    {/* Actions are now part of the card body for better alignment */}
                    <div className="product-card-actions d-flex justify-content-end gap-2 mt-3">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="product-action-btn"
                            onClick={() => onUpdateProduct(product)}
                        >
                            Update
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            className="product-action-btn"
                            onClick={() => onDeleteProduct(product)}
                        >
                            Delete
                        </Button>
                    </div>
                </Card.Body>
            </Col>
        </Row>
    </Card>
);

export default ListProduct;