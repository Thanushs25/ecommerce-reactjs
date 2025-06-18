// UserOrders.jsx
import React, { useEffect, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { deleteOrderItem, getOrdersByUserId } from "../../api/api";
import { selectUserId } from "../../redux/credentials/idSlice";
import NavigationBar from "../navigation/NavigationBar";


import "./UserOrders.css";

const UserOrders = () => {
  const [userOrderItems, setUserOrderItems] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderItemToDelete, setOrderItemToDelete] = useState(null); // State to hold the item to delete

  const currentUserId = useSelector(selectUserId);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleOpenCancelModal = (orderItem) => {
    setOrderItemToDelete(orderItem);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setOrderItemToDelete(null);
    setShowCancelModal(false);
  };

  const handleConfirmCancel = async () => {
    if (orderItemToDelete) {
      try {
        const response = await deleteOrderItem(orderItemToDelete.orderItemId);
        if (response.success) {
          setUserOrderItems((prevItems) =>
            prevItems.filter((item) => item.orderItemId !== orderItemToDelete.orderItemId)
          );
          setMessage("Order item deleted successfully.");
          setError("");
        } else {
          setError(response.error || "Failed to delete the order item.");
          setMessage("");
        }
      } catch (err) {
        console.error("Error deleting order item:", err);
        setError(
          err.message ||
            "An unexpected error occurred while deleting the order item."
        );
        setMessage("");
      } finally {
        handleCloseCancelModal();
      }
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      setMessage("");
      if (currentUserId) {
        try {
          const response = await getOrdersByUserId(currentUserId);
          console.log("Fetched orders:", response);

          if (response.success) {
            setUserOrderItems(response.data);
            setMessage(
              `Showing ${response.data.length} items from your past orders.`
            );
          } else {
            setError(response.error || "Failed to fetch your order items.");
            setUserOrderItems([]);
          }
        } catch (err) {
          console.error("Fetch Orders Error:", err);
          setError(
            err.message || "An unexpected error occurred while fetching orders."
          );
          setUserOrderItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setError("User ID not available. Please ensure you are logged in.");
        setUserOrderItems([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUserId]);

  return (
    <>
      <NavigationBar />
      <div className="user-orders-wrapper">
        <h1 className="order-page-title">MY ORDERS</h1>
        <div className="container">
          <div className="card shadow p-4">
            {loading && (
              <div className="text-center mt-3">
                Loading your order history...
              </div>
            )}

            {/* {message && !loading && (
              <div className="alert alert-success mt-3">{message}</div>
            )} */}
            {error && !loading && (
              <div className="alert alert-danger mt-3">{error}</div>
            )}

            {!loading && userOrderItems.length > 0 ? (
              <section className="order-items-list mt-4">
                <h3 className="order-items-heading">
                  All Items from Your Orders
                </h3>
                {userOrderItems.map((orderItem) => (
                  <div key={orderItem.orderItemId} className="order-item-card">
                    <div className="order-item-image-container">
                      <img
                        src={orderItem.imageUrl}
                        alt={orderItem.productName}
                        className="order-item-image"
                      />
                    </div>
                    <div className="order-item-details">
                      <p className="order-item-name">{orderItem.productName}</p>
                      <p className="order-item-quantity">
                        Quantity: {orderItem.quantity}
                      </p>
                      <p className="order-item-price">
                        Price: ₹{orderItem.price}
                      </p>
                      <p className="order-item-status">
                        Status: {orderItem.orderStatus}
                      </p>
                      <p className="order-item-date">
                        Ordered on:{" "}
                        {new Date(orderItem.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {/* Reverted to original Bootstrap button classes */}
                    {orderItem.orderStatus === "Confirmed" && (
                      <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => handleOpenCancelModal(orderItem)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </section>
            ) : (
              !loading &&
              !error &&
              userOrderItems.length === 0 && (
                <p className="no-orders-message mt-4">
                  No order items found for your account. Once you place an
                  order, it will appear here.
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this order item? This action cannot be undone.
          {orderItemToDelete && (
            <p className="mt-2">
              <strong>Item:</strong> {orderItemToDelete.productName}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCancelModal}>
            Keep Order
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Delete Order Item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserOrders;