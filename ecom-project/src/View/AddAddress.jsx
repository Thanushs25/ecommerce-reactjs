import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addAddress, getAddress } from "../api/authService";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/credentials/idSlice";
import NavigationBar from "../components/navigation/NavigationBar"; // Assuming NavigationBar is in the same folder or adjust path
import { Container, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import './Address.css'; // This CSS file will be updated
import Footer from "../components/navigation/Footer";

const AddAddress = () => {
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const location = useLocation();
  const { fromAddressDisplay, cartId } = location.state || {};

  const [addressData, setAddressData] = useState({
    address: {
      flatNumber: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchExistingAddress = async () => {
      try {
        const data = await getAddress(userId);
        if (data && data.address && Object.keys(data.address).length > 0) {
          setAddressData({ address: data.address });
        }
      } catch (err) {
        console.error("Error fetching address for pre-fill:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingAddress();
  }, [userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setBackendErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setGeneralError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    Object.keys(addressData.address).forEach((field) => {
      if (!addressData.address[field]) {
        validationErrors[field] = `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setBackendErrors({});
      setGeneralError(null);
      return;
    }

    setLoading(true);
    setGeneralError(null);
    setBackendErrors({});
    setErrors({});

    try {
      await addAddress(userId, addressData);
      if (fromAddressDisplay) {
        navigate("/user/address", { state: { cartId: cartId } });
      } else {
        navigate("/user/cart");
      }
    } catch (err) {
      console.error("Error adding address:", err);
      if (err.response && err.response.data && err.response.data.message) {
        const backendMessage = err.response.data.message;
        const match = backendMessage.match(/address\.(\w+):\s*(.+)/);
        if (match) {
          const field = match[1];
          const message = match[2];
          setBackendErrors({ [field]: message });
        } else {
          setGeneralError(backendMessage);
        }
      } else {
        setGeneralError(err.message || "Failed to add address");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="address-container-wrapper"> {/* Updated wrapper class */}
        <Container className="my-5"> {/* Adjusted spacing */}
          <Card className="address-card shadow-sm"> {/* Updated card class */}
            <Card.Body className="p-4 p-md-5"> {/* Adjusted padding */}
              <h2 className="address-card-title text-center mb-4">Add Address</h2> {/* Updated title class */}

              {loading ? (
                <div className="d-flex justify-content-center my-4">
                  <Spinner animation="border" variant="primary" role="status"> {/* Primary spinner */}
                    <span className="visually-hidden">Loading address data...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  {generalError && (
                    <Alert variant="danger" className="text-center my-3">
                      Error: {generalError}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    {["flatNumber", "street", "city", "state", "country", "pincode"].map(
                      (field) => (
                        <Form.Group className="mb-3" controlId={field} key={field}>
                          <Form.Label className="form-label text-capitalize">
                            {field.replace(/([A-Z])/g, " $1")}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name={field}
                            value={addressData.address[field] || ""}
                            onChange={handleInputChange}
                            isInvalid={!!errors[field] || !!backendErrors[field]}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[field] || backendErrors[field]}
                          </Form.Control.Feedback>
                        </Form.Group>
                      )
                    )}
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4"> {/* Centered buttons with gap */}
                      <button type="submit" variant="primary" className="address-btn" disabled={loading}> {/* Primary save button */}
                        {loading ? 'Saving...' : 'Save Address'}
                      </button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="address-btn-outline" 
                        onClick={() => {
                          if (fromAddressDisplay) {
                            navigate("/user/address", { state: { cartId: cartId } });
                          } else {
                            navigate("/user/cart");
                          }
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
      <Footer/>
    </>
  );
};

export default AddAddress;