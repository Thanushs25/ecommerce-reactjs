// src/components/orders/OrderItemCard.jsx (assuming it's in a 'components/orders' directory)
import React from 'react';
import { Card, Image, Badge } from 'react-bootstrap'; // Import Bootstrap components

const OrderItemCard = ({ item }) => {
    console.log('OrderItemCard item:', item);
    return (
        <Card className="order-item-card shadow-sm border-0">
            {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.productName} className="order-item-image" />
            )}
            <Card.Body className="order-item-details">
                <Card.Title className="order-item-title">{item.productName}</Card.Title>
                <Card.Text className="order-item-text">
                    <strong>Quantity:</strong> {item.quantity}
                </Card.Text>
                <Card.Text className="order-item-text">
                    <strong>Price:</strong> <span className="order-item-price">₹{item.price ? item.price.toFixed(2) : 'N/A'}</span>
                </Card.Text>
                {item.variantId && (
                    <Card.Text className="order-item-text">
                        <strong>Variant ID:</strong> {item.variantId}
                    </Card.Text>
                )}
                {item.stockStatus && (
                    <Badge
                        pill
                        bg={item.stockStatus === 'available' ? 'success' : 'danger'}
                        className="order-item-status-badge"
                    >
                        {item.stockStatus === 'available' ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                )}
                <Card.Text className="order-item-date-text">
                    Ordered on: {new Date(item.date).toLocaleDateString()}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default OrderItemCard;