import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAddress } from "../api/authService";
import { selectUserId } from "../redux/credentials/idSlice";
import NavigationBar from "../components/navigation/NavigationBar"; // Assuming NavigationBar is in the same folder or adjust path
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import './Address.css'; // This CSS file will be updated
import Footer from "../components/navigation/Footer";

const AddressDisplay = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector(selectUserId);
  const { cartId } = useLocation().state || {};

  const handleConfirmOrder = () => {
    navigate('/user/payment', { state: { cartId: cartId } });
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const data = await getAddress(userId);
        if (!data || !data.address || Object.keys(data.address).length === 0) {
          navigate("/user/add-address", { state: { fromAddressDisplay: true, cartId: cartId } });
        } else {
          setAddress(data.address);
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        setError(err.message || "Failed to fetch address");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [navigate, userId, cartId]);

  return (
    <>
      <NavigationBar />
      <div className="address-container-wrapper"> {/* Updated wrapper class */}
        <Container className="my-5"> {/* Adjusted spacing */}
          <Card className="address-card shadow-sm"> {/* Updated card class */}
            <Card.Body className="p-4 p-md-5"> {/* Adjusted padding */}
              <h2 className="address-card-title text-center mb-4">Shipping Address</h2> {/* Updated title class */}

              {loading ? (
                <div className="d-flex justify-content-center my-4">
                  <Spinner animation="border" variant="primary" role="status"> {/* Primary spinner */}
                    <span className="visually-hidden">Loading shipping address...</span>
                  </Spinner>
                </div>
              ) : error ? (
                <Alert variant="danger" className="text-center my-4">
                  Error: {error}
                </Alert>
              ) : (
                <>
                  <div className="address-details-box mb-4 p-3 p-md-4"> {/* Adjusted spacing and padding */}
                    {address && (
                      <>
                      <p className="text-center mb-0 lead fw-normal"> {address.flatNumber}, {address.street}</p>
                       <p className="text-center mb-0 lead fw-normal">  {address.city}, {address.state},</p>
                       <p className="text-center mb-0 lead fw-normal"> {address.country} - <strong >{address.pincode}</strong> </p>
                       </>
                    )}
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-3"> {/* Centered buttons with gap */}
                    <button
                      variant="outline-primary"
                      className="address-btn-outline"
                      onClick={() => navigate("/user/add-address", { state: { fromAddressDisplay: true, cartId: cartId } })}
                    >
                      Update Address
                    </button>
                    <button
                      variant="primary"
                      className="address-btn" 
                      onClick={handleConfirmOrder}
                    >
                      Confirm Order
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

export default AddressDisplay;