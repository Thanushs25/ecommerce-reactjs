import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../Hooks/useLogout";
import { getUserProfile, updateUserProfile } from "../api/authService";
import UserProfileDisplay from "../components/userProfile/UserProfileDisplay";
import UserProfileUpdate from "../components/userProfile/UserProfileUpdate";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/credentials/idSlice";
import NavigationBar from "../components/navigation/NavigationBar";
import './UserProfile.css'; // Import the new CSS file for the wrapper
import Footer from "../components/navigation/Footer";

const UserProfile = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfileData, setUpdatedProfileData] = useState({
    name: "",
    address: {
      flatNumber: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [generalUpdateError, setGeneralUpdateError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const userId = useSelector(selectUserId);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const data = await getUserProfile(userId);
          setUserProfile(data);
          setUpdatedProfileData({
            name: data.name || "",
            address: {
              flatNumber: data.address?.flatNumber || "",
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              country: data.address?.country || "",
              pincode: data.address?.pincode || "",
            },
          });
          setLoading(false);
        } else {
          setError("Could not retrieve user ID. Please log in again.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch Profile Error:", err);
        setError(err.message || "Failed to fetch user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleLogout = () => {
    logout("user");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateSuccess(false);
    setGeneralUpdateError(null);
    setBackendErrors({});
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfileData((prevData) => {
      if (name.startsWith("address.")) {
        const addressField = name.substring(8);
        return {
          ...prevData,
          address: {
            ...prevData.address,
            [addressField]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setBackendErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[name]) {
        delete newErrors[name];
      }
      if (name.startsWith("address.") && newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleUpdateProfile = async () => {
    const errors = {};
    if (!updatedProfileData.name) {
      errors.name = "Name is required";
    }
    if (!updatedProfileData.address.flatNumber) {
      errors["address.flatNumber"] = "Flat number is required";
    }
    if (!updatedProfileData.address.street) {
      errors["address.street"] = "Street is required";
    }
    if (!updatedProfileData.address.city) {
      errors["address.city"] = "City is required";
    }
    if (!updatedProfileData.address.state) {
      errors["address.state"] = "State is required";
    }
    if (!updatedProfileData.address.country) {
      errors["address.country"] = "Country is required";
    }
    if (!updatedProfileData.address.pincode) {
      errors["address.pincode"] = "Pincode is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setUpdateSuccess(false);
    setGeneralUpdateError(null);
    setBackendErrors({});
    try {
      if (userId) {
        const response = await updateUserProfile(userId, updatedProfileData);
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          ...updatedProfileData,
        }));
        setIsEditing(false);
        setUpdateSuccess(true);
        setLoading(false);
      } else {
        setError("Could not retrieve user ID. Please log in again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Update Profile Error:", err);
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = err.response.data.message;
        if (errorMessage.startsWith("address.pincode:")) {
          setBackendErrors({
            "address.pincode": errorMessage.substring(
              "address.pincode:".length
            ).trim(),
          });
        } else {
          setGeneralUpdateError(errorMessage);
        }
      } else {
        setGeneralUpdateError(err.message || "Failed to update profile");
      }
    }
  };

  // Conditional rendering for loading/error messages within the wrapper
  if (loading) {
    return (
      <>
        <NavigationBar />
        <div className="user-profile-wrapper">
          <div className="text-center mt-5">Loading user profile...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationBar />
        <div className="user-profile-wrapper">
          <div className="text-danger text-center mt-5">Error: {error}</div>
        </div>
      </>
    );
  }

  if (!userProfile) {
    return (
      <>
        <NavigationBar />
        <div className="user-profile-wrapper">
          <div className="text-center mt-5">No user profile data available.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="user-profile-wrapper"> {/* Apply the new wrapper class */}
        <div className="container">
          <div className="card shadow p-4">
            <h2 className="text-center">User Profile</h2>
            {updateSuccess && (
              <div className="alert alert-success">
                Profile updated successfully!
              </div>
            )}
            {generalUpdateError && (
              <div className="alert alert-danger">Error: {generalUpdateError}</div>
            )}

            {!isEditing ? (
              <UserProfileDisplay
                userProfile={userProfile}
                onEditClick={handleEditClick}
              />
            ) : (
              <UserProfileUpdate
                updatedProfileData={updatedProfileData}
                validationErrors={validationErrors}
                backendErrors={backendErrors}
                onInputChange={handleInputChange}
                onUpdateProfile={handleUpdateProfile}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;