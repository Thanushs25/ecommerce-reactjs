import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; // Removed useSelector as it's not used directly
import { useNavigate, Link } from 'react-router-dom';
import { userLogin } from '../api/authService';
import { jwtDecode } from 'jwt-decode';
import { setUserId, setAdminId } from '../redux/credentials/idSlice'; // Adjust the import path as necessary
import NavigationBar from '../components/navigation/NavigationBar'; // Assuming NavigationBar is available
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'; // Import Bootstrap components
import { PersonCircle, LockFill } from 'react-bootstrap-icons'; // Icons for input fields
import './UserLogin.css'; // New CSS file for this component
import Footer from '../components/navigation/Footer';

const UserLogin = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Renamed for clarity
    const [passwordError, setPasswordError] = useState('');
    const [credentialsError, setCredentialsError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'userName') {
            setUserName(value);
        } else if (name === 'password') {
            setPassword(value);
        }
        // Clear errors as user types
        setPasswordError('');
        setCredentialsError('');
        setShowSuccessAlert(false); // Hide success alert if user starts typing again
    };

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            navigate('/home'); // Redirect to home if already logged in
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear all previous errors
        setPasswordError('');
        setCredentialsError('');
        setShowSuccessAlert(false);
        setIsLoading(true); // Start loading

        try {
            const response = await userLogin({ userName, password });
            const token = response.data;
            localStorage.setItem('token', JSON.stringify({ token }));

            const tokenData = jwtDecode(token);
            if (tokenData.userId) {
                dispatch(setUserId(tokenData.userId));
            }
            if (tokenData.adminId) {
                dispatch(setAdminId(tokenData.adminId));
            }

            setShowSuccessAlert(true); // Show success alert
            setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/home'); // Redirect to home on success
            }, 1500);
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message.toLowerCase();
                if (errorMessage.includes('password')) {
                    // Extract specific password error if available
                    setPasswordError(error.response.data.message.replace('password:', '').trim());
                } else if (errorMessage.includes('invalid credentials') || errorMessage.includes('bad credentials')) {
                    setCredentialsError('Invalid username or password.'); // Generic message for security
                } else {
                    setCredentialsError('Login failed: ' + error.response.data.message); // Catch-all for other errors
                }
            } else {
                setCredentialsError('Login failed: An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <>
            <NavigationBar />
            <div className="login-wrapper"> {/* Main wrapper for centering */}
                <Container className="my-5">
                    <Card className="login-card shadow-lg"> {/* Slightly stronger shadow for login */}
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="login-title text-center mb-4">User Login</h2>
                            <Form onSubmit={handleSubmit}>
                                {/* Username Field */}
                                <Form.Group className="mb-3" controlId="userName">
                                    <Form.Label className="login-label">
                                        <PersonCircle className="me-2" /> Username <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userName"
                                        value={userName}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        isInvalid={!!credentialsError} // Mark as invalid if credentials error exists
                                        required
                                        className="login-input"
                                    />
                                    {credentialsError && (
                                        <Form.Control.Feedback type="invalid">
                                            {credentialsError}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                {/* Password Field */}
                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label className="login-label">
                                        <LockFill className="me-2" /> Password <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        isInvalid={!!credentialsError || !!passwordError} // Mark as invalid for either error
                                        required
                                        className="login-input"
                                    />
                                    {(credentialsError || passwordError) && (
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
                                <Alert variant="success" className="login-alert mt-4 text-center">
                                    Login successful! Redirecting...
                                </Alert>
                            )}

                            {/* Link to Signup Page */}
                            <div className="text-center mt-4">
                                <p className="login-signup-text mb-0">
                                    Don't have an account?{' '}
                                    <Link to="/user/signup" className="login-signup-link">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default UserLogin;