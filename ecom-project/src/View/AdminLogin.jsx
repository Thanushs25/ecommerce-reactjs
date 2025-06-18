import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/authService';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUserId, setAdminId } from '../redux/credentials/idSlice'; // Adjust the import path as necessary
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'; // Import Bootstrap components
import { PersonCircle, LockFill } from 'react-bootstrap-icons'; // Icons for input fields
import './UserLogin.css'; // New CSS file for this component
import NavigationBar from '../components/navigation/NavigationBar'; // Assuming NavigationBar is available
import Footer from '../components/navigation/Footer';

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Renamed for clarity
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [credentialsError, setCredentialsError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
        // Clear errors as user types
        setUsernameError("");
        setPasswordError("");
        setCredentialsError("");
        setShowSuccessAlert(false); // Hide success alert if user starts typing again
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear all previous errors
        setUsernameError("");
        setPasswordError("");
        setCredentialsError("");
        setShowSuccessAlert(false);
        setIsLoading(true); // Start loading

        try {
            console.log({ username, password });
            const response = await adminLogin({ username, password });
            const token = response.data;
            localStorage.setItem('token', JSON.stringify({ token }));

            const tokenData = jwtDecode(token);
            if (tokenData.userId) { // Admins might also have a userId, depending on your JWT structure
                dispatch(setUserId(tokenData.userId));
            }
            if (tokenData.adminId) {
                dispatch(setAdminId(tokenData.adminId));
            } else {
                // Handle case where token might be valid but not contain adminId
                throw new Error("No admin ID found in token. Access denied.");
            }

            setShowSuccessAlert(true); // Show success alert
            setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/admin/dashboard'); // Redirect to admin dashboard on success
            }, 1500); // Shortened timeout for snappier experience
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message.toLowerCase();
                if (errorMessage.includes("password")) {
                    setPasswordError(error.response.data.message.replace("password:", "").trim());
                } else if (errorMessage.includes("username")) {
                    setUsernameError("Username not found.");
                } else if (errorMessage.includes("invalid credentials") || errorMessage.includes("bad credentials")) {
                    setCredentialsError("Invalid username or password.");
                } else {
                    setCredentialsError(error.response.data.message || "An unexpected error occurred.");
                }
            } else {
                setCredentialsError(error.message || "Login failed: An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
      <>
        <NavigationBar /> {/* Assuming NavigationBar is available */}
        <div className="admin-login-wrapper"> {/* Main wrapper for centering */}
            <Container className="my-5">
                <Card className="login-card shadow-lg"> {/* Reusing login-card style */}
                    <Card.Body className="p-4 p-md-5">
                        <h2 className="login-title text-center mb-4">Admin Login</h2> {/* Reusing login-title style */}
                        <Form onSubmit={handleSubmit}>
                            {/* Username Field */}
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label className="login-label"> {/* Reusing login-label style */}
                                    <PersonCircle className="me-2" /> Username <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={handleChange}
                                    placeholder="Enter admin username"
                                    isInvalid={!!usernameError || !!credentialsError}
                                    required
                                    className="login-input" 
                                />
                                {(usernameError || credentialsError) && (
                                    <Form.Control.Feedback type="invalid">
                                        {usernameError || credentialsError}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>

                            {/* Password Field */}
                            <Form.Group className="mb-4" controlId="password">
                                <Form.Label className="login-label"> {/* Reusing login-label style */}
                                    <LockFill className="me-2" /> Password <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    placeholder="Enter admin password"
                                    isInvalid={!!passwordError || !!credentialsError}
                                    required
                                    className="login-input" 
                                />
                                {(passwordError || credentialsError) && (
                                    <Form.Control.Feedback type="invalid">
                                        {passwordError || credentialsError}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                className="login-btn w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Logging In...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </Form>

                        {/* Success Alert */}
                        {showSuccessAlert && (
                            <Alert variant="success" className="login-alert mt-4 text-center"> {/* Reusing login-alert style */}
                                Login successful! Redirecting to dashboard...
                            </Alert>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
        <Footer />
      </>
    );
};

export default AdminLogin;