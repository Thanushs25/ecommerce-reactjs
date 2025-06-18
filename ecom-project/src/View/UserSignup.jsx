import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userSignup } from "../api/authService";
import NavigationBar from "../components/navigation/NavigationBar";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { PersonCircle, LockFill, EnvelopeFill } from "react-bootstrap-icons";
import "./UserSignup.css";
import Footer from "../components/navigation/Footer";

const UserSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        window.scrollTo(0, 0);
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            navigate("/home");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        console.log("Form Data:", formData);
        e.preventDefault();
        setErrors({})
        setIsLoading(true);
        setShowSuccessAlert(false);

        try {
            await userSignup(formData);
            setTimeout(() => {
                setShowSuccessAlert(true);
                navigate("/user/login");
            }, 1500);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                if (errorMessage.startsWith("password:")) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password: errorMessage.substring("password:".length).trim(),
                    }));
                } else if (errorMessage.startsWith("name:")) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: errorMessage.substring("name:".length).trim(),
                    }));
                } else if (errorMessage.startsWith("email:")) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: errorMessage.substring("email:".length).trim(),
                    }));
                } else if (errorMessage.startsWith("userName:")) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        userName: errorMessage.substring("userName:".length).trim(),
                    }));
                } else if (errorMessage.startsWith("confirmPassword:")) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        confirmPassword: errorMessage.substring("confirmPassword:".length).trim(),
                    }));
                } else {
                    alert("Signup failed: " + errorMessage);
                }
            } else {
                alert("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <NavigationBar />
            <div className="signup-wrapper">
                <Container className="my-5">
                    <Card className="signup-card shadow-lg">
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="signup-title text-center mb-4">User Signup</h2>

                            <Form onSubmit={handleSubmit}>
                                {/* Name Field */}
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label className="signup-label">
                                        <PersonCircle className="me-2" /> Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        isInvalid={!!errors.name}
                                        required
                                        className="signup-input"
                                    />
                                    {errors.name && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                {/* Email Field */}
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="signup-label">
                                        <EnvelopeFill className="me-2" /> Email <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        isInvalid={!!errors.email}
                                        required
                                        className="signup-input"
                                    />
                                    {errors.email && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                {/* Username Field */}
                                <Form.Group className="mb-3" controlId="userName">
                                    <Form.Label className="signup-label">
                                        <PersonCircle className="me-2" /> Username <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        isInvalid={!!errors.userName}
                                        required
                                        className="signup-input"
                                    />
                                    {errors.userName && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.userName}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                {/* Password Field */}
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label className="signup-label">
                                        <LockFill className="me-2" /> Password <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        isInvalid={!!errors.password}
                                        required
                                        className="signup-input"
                                    />
                                    {errors.password && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                {/* Confirm Password Field */}
                                <Form.Group className="mb-4" controlId="confirmPassword">
                                    <Form.Label className="signup-label">
                                        <LockFill className="me-2" /> Confirm Password <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        isInvalid={!!errors.confirmPassword}
                                        required
                                        className="signup-input"
                                    />
                                    {errors.confirmPassword && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirmPassword}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="signup-btn w-100"
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
                                            Signing Up...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </Form>

                            {/* Success Alert */}
                            {showSuccessAlert && (
                                <Alert variant="success" className="login-alert mt-4 text-center">
                                    Login successful! Redirecting...
                                </Alert>
                            )}

                            {/* Link to Login Page */}
                            <div className="text-center mt-4">
                                <p className="signup-login-text mb-0">
                                    Already have an account?{" "}
                                    <Link to="/user/login" className="signup-login-link">
                                        Login here
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

export default UserSignup;