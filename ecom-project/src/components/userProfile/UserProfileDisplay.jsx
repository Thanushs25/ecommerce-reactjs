// UserProfileDisplay.jsx
import React from "react";
import './UserProfileDisplay.css'; // Ensure this CSS file is linked

const UserProfileDisplay = ({ userProfile, onEditClick, onLogout }) => {
  window.scrollTo(0, 0); // Scroll to top when component mounts
  
  const defaultProfileTemplate = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor" // Changed to currentColor for easier CSS control
      className="profile-avatar" // Custom class for avatar styling
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" />
    </svg>
  );

  return (
    <>
    <div className="user-profile-display">
      <div className="profile-header">
        <div className="profile-avatar-container">
          {defaultProfileTemplate}
        </div>
        <h2 className="profile-welcome">Welcome, {userProfile.name}!</h2>
      </div>

      <div className="profile-info-section">
        <h4 className="profile-section-title">Account Details</h4>
        {userProfile.username && <p><strong>Username:</strong> {userProfile.username}</p>}
        {userProfile.email && <p><strong>Email:</strong> {userProfile.email}</p>}
      </div>

      <div className="profile-info-section">
        <h4 className="profile-section-title">Delivery Address</h4>
        {userProfile.address ? (
          <>
            <p><strong>Flat:</strong> {userProfile.address.flatNumber}</p>
            <p><strong>Street:</strong> {userProfile.address.street}</p>
            <p><strong>City:</strong> {userProfile.address.city}</p>
            <p><strong>State:</strong> {userProfile.address.state}</p>
            <p><strong>Country:</strong> {userProfile.address.country}</p>
            <p><strong>Pincode:</strong> {userProfile.address.pincode}</p>
          </>
        ) : (
          <p className="no-address-message">No address information available. Please add your address.</p>
        )}
      </div>

      <div className="profile-actions mt-4">
        <button className="btn btn-primary" onClick={onEditClick}>
          Edit Profile
        </button>
        <button className="btn btn-info" onClick={() => window.location.href = '/user/orders'}>
          View Orders
        </button>
      </div>
    </div>
    </>
  );
};

export default UserProfileDisplay;