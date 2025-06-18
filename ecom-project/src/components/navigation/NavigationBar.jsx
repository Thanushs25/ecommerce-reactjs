import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Modal,
  Button,
  Form,
  FormControl,
  Button as BootstrapButton,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUserId, selectAdminId } from '../../redux/credentials/idSlice';
import useLogout from '../../Hooks/useLogout';
import { useNavigate } from 'react-router-dom';

// Import the CSS file
import './NavigationBar.css'; // Make sure the path is correct

const NavigationBar = () => {
  const { logout } = useLogout();

  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userId = useSelector(selectUserId);
  console.log('User ID:', userId);
  const adminId = useSelector(selectAdminId);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout('user');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = `/search`;
    }
  };

  return (
    <>
      <Navbar
        variant="light"
        expand="lg"
        fixed="top"
        className={`py-4 custom-navbar ${scrolled ? 'scrolled-navbar' : ''}`}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-15 custom-brand-logo"
          >
            {/* UC text, initially hidden, shown on scroll */}
            <span className="brand-text-uc">UC</span>
            {/* Urban Cart text, initially visible, hidden on scroll */}
            <span className="brand-text-name">Urban Cart</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarNav" />

          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto align-items-lg-center">
              <Form
                className="d-flex ms-lg-3 mt-3 mt-lg-0"
                onSubmit={handleSearchSubmit}
              >
                <FormControl
                  type="search"
                  placeholder="Search products..."
                  className="me-2 rounded-pill border custom-search-input"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <BootstrapButton
                  variant="outline-secondary"
                  type="submit"
                  className="rounded-pill px-4 custom-search-button"
                >
                  Search
                </BootstrapButton>
              </Form>
              <Nav.Link as={Link} to="/" className="mx-2 nav-link-custom">
                <i className="fa fa-home" aria-hidden="true"></i> &nbsp; Home
              </Nav.Link>

              {userId ? (
                <>
                  <Nav.Link
                    as={Link}
                    to={`/user/cart`}
                    className="mx-2 nav-link-custom"
                  >
                    <i className="fa fa-shopping-cart" aria-hidden="true"></i>{' '}
                    &nbsp; Cart
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={`/user/profile`}
                    className="mx-2 nav-link-custom profile-icon"
                  >
                    <i className="fa fa-user" aria-hidden="true"></i> &nbsp;
                    Profile
                  </Nav.Link>
                  <Nav.Link
                    className="mx-2 nav-link-custom"
                    onClick={handleLogoutClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i>{' '}
                    &nbsp; Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/user/login"
                    className="mx-2 nav-link-custom"
                  >
                    <i className="fa fa-sign-in" aria-hidden="true"></i> &nbsp;
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/user/signup"
                    className="mx-2 nav-link-custom"
                  >
                    <i className="fa fa-user-plus" aria-hidden="true"></i>{' '}
                    &nbsp; Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLogoutModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavigationBar;