import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css'; // Make sure this path is correct for your project

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <Container className="py-5">
        <Row className="justify-content-between">
          {/* Column 1: Brand Info & Social Icons */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0 footer-col-info">
            <h5 className="footer-brand-name">URBAN CART</h5>
            <p className="footer-text mb-4">
              Your ultimate destination for premium products. Explore our curated collection and redefine your style.
            </p>
            <div className="social-icons-container">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </Col>

          <Col lg={2} md={3} sm={6} xs={6} className="mb-4 mb-lg-0">
            <h6 className="footer-heading">Company</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="" className="footer-link-item">About Us</Link></li>
              <li><Link to="" className="footer-link-item">Contact Us</Link></li>
              <li><Link to="" className="footer-link-item">Careers</Link></li>
              <li><Link to="" className="footer-link-item">Blog</Link></li>
            </ul>
          </Col>

          {/* Column 3: Get Help Links */}
          <Col lg={2} md={3} sm={6} xs={6} className="mb-4 mb-lg-0">
            <h6 className="footer-heading">Get Help</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="" className="footer-link-item">FAQ</Link></li>
              <li><Link to="" className="footer-link-item">Shipping</Link></li>
              <li><Link to="" className="footer-link-item">Returns</Link></li>
              <li><Link to="" className="footer-link-item">Order Status</Link></li>
              <li><Link to="" className="footer-link-item">Payment Options</Link></li>
            </ul>
          </Col>

          {/* Column 4: Online Shop Links */}
          <Col lg={2} md={6} sm={6} xs={6} className="mb-4 mb-lg-0">
            <h6 className="footer-heading">Online Shop</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/" className="footer-link-item">Men's Fashion</Link></li>
              <li><Link to="/" className="footer-link-item">Women's Fashion</Link></li>
              <li><Link to="/" className="footer-link-item">Accessories</Link></li>
              <li><Link to="/" className="footer-link-item">New Arrivals</Link></li>
              <li><Link to="/" className="footer-link-item">Specials</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Bottom Section: Copyright & Payment Icons */}
      <div className="footer-bottom py-3">
        <Container className="d-flex justify-content-between align-items-center flex-column flex-md-row">
          <p className="mb-md-0 copyright-text">&copy; {currentYear} Urban Cart. All Rights Reserved.</p>
          <div className="payment-icons-container mt-3 mt-md-0">
            <i className="fab fa-cc-visa payment-icon"></i>
            <i className="fab fa-cc-mastercard payment-icon"></i>
            <i className="fab fa-cc-paypal payment-icon"></i>
            <i className="fab fa-cc-stripe payment-icon"></i>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;