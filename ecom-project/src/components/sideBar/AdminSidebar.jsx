// src/components/sideBar/AdminSidebar.jsx
import React, { useState } from 'react'; // Import useState
import { Link, useLocation } from 'react-router-dom';
import { ListGroup, Button, Modal } from 'react-bootstrap';
import {
  HouseDoorFill,
  BoxSeamFill,
  PeopleFill,
  CartFill,
  PersonCircle,
  Power,
  List as ListIcon,
  PlusCircleFill, // Import List icon for hamburger
} from 'react-bootstrap-icons';
import './AdminSidebar.css';

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="admin-sidebar-toggle-button">
        <Button variant="dark" onClick={toggleSidebar} className="d-lg-none"> {/* Visible only on small screens */}
          <ListIcon size={24} />
        </Button>
      </div>

      <aside className={`admin-sidebar-new ${sidebarOpen ? 'open' : ''}`}> {/* Apply 'open' class when sidebar is visible */}
        <div className="sidebar-header-new">
          <Link to="/admin/dashboard" className="sidebar-brand-new">
            <PersonCircle className="me-2" /> Admin Panel
          </Link>
        </div>
        <ListGroup variant="flush" className="sidebar-nav-new flex-grow-1">
          <ListGroup.Item
            action
            as={Link}
            to="/admin/dashboard"
            className={`sidebar-item-new ${
              location.pathname === '/admin/dashboard' ? 'active' : ''
            }`}
            onClick={() => setSidebarOpen(false)} // Close sidebar on link click
          >
            <HouseDoorFill className="me-2" /> Dashboard
          </ListGroup.Item>
          <ListGroup.Item
            action
            as={Link}
            to="/admin/showProduct"
            className={`sidebar-item-new ${
              location.pathname === '/admin/showProduct' ? 'active' : ''
            }`}
            onClick={() => setSidebarOpen(false)} // Close sidebar on link click
          >
            <BoxSeamFill className="me-2" /> Manage Products
          </ListGroup.Item>
          <ListGroup.Item
            action
            as={Link}
            to="/admin/addProduct"
            className={`sidebar-item-new ${
              location.pathname === '/admin/addProduct' ? 'active' : ''
            }`}
            onClick={() => setSidebarOpen(false)} // Close sidebar on link click
          >
            <PlusCircleFill className="me-2" /> Add Product
          </ListGroup.Item>
          <ListGroup.Item
            action
            as={Link}
            to="/admin/order-details"
            className={`sidebar-item-new ${
              location.pathname.startsWith('/admin/order-details') ? 'active' : ''
            }`}
            onClick={() => setSidebarOpen(false)} // Close sidebar on link click
          >
            <CartFill className="me-2" /> Manage Orders
          </ListGroup.Item>
        </ListGroup>
        <div className="sidebar-footer-new">
          <Button
            variant="danger"
            className="w-100 sidebar-logout-btn-new"
            onClick={handleLogoutClick}
          >
            <Power className="me-2" /> Logout
          </Button>
        </div>
      </aside>

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

export default AdminSidebar;