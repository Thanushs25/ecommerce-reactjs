import React from "react";
import { useNavigate } from "react-router-dom";
import "./UnAuthorized.css"; // Import the CSS file for styling
import Footer from "../components/navigation/Footer";

const UnAuthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
    <div className="unauthorized-wrapper">
      <div className="unauthorized-card shadow-lg">
        <h2 className="unauthorized-title text-center text-danger">Access Denied</h2>
        <p className="unauthorized-text text-center mt-3">
          You are not authorized to view this page.
        </p>
        <div className="text-center mt-4">
          <button className="unauthorized-btn btn btn-primary" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default UnAuthorized;