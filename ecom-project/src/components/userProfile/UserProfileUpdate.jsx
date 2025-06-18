// UserProfileUpdate.jsx
import React from "react";
import './UserProfileUpdate.css'; // Ensure this CSS file is linked

const UserProfileUpdate = ({
  updatedProfileData,
  validationErrors,
  backendErrors,
  onInputChange,
  onUpdateProfile,
  onCancel,
}) => {
  window.scrollTo(0, 0); // Scroll to top when component mounts
  
  const getErrorMessage = (fieldName) => {
    return validationErrors[fieldName] || backendErrors[fieldName];
  };

  return (
    <>
    <div className="user-profile-update">
      <form onSubmit={(e) => { e.preventDefault(); onUpdateProfile(); }}>
        <div className="form-group mb-4"> {/* Increased margin-bottom */}
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${
              getErrorMessage('name') ? "is-invalid" : ""
            }`}
            id="name"
            name="name"
            value={updatedProfileData.name}
            onChange={onInputChange}
            required
          />
          {getErrorMessage('name') && (
            <div className="invalid-feedback">{getErrorMessage('name')}</div>
          )}
        </div>

        <h5 className="address-section-title mb-4">Update Address</h5> {/* Centered and styled title */}
        
        <div className="row mb-3"> {/* Use Bootstrap row for layout */}
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address.flatNumber" className="form-label">
                Flat Number
              </label>
              <input
                type="text"
                className={`form-control ${
                  getErrorMessage('address.flatNumber') ? "is-invalid" : ""
                }`}
                id="address.flatNumber"
                name="address.flatNumber"
                value={updatedProfileData.address.flatNumber}
                onChange={onInputChange}
                required
              />
              {getErrorMessage('address.flatNumber') && (
                <div className="invalid-feedback">
                  {getErrorMessage('address.flatNumber')}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address.street" className="form-label">
                Street
              </label>
              <input
                type="text"
                className={`form-control ${
                  getErrorMessage('address.street') ? "is-invalid" : ""
                }`}
                id="address.street"
                name="address.street"
                value={updatedProfileData.address.street}
                onChange={onInputChange}
                required
              />
              {getErrorMessage('address.street') && (
                <div className="invalid-feedback">
                  {getErrorMessage('address.street')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address.city" className="form-label">
                City
              </label>
              <input
                type="text"
                className={`form-control ${
                  getErrorMessage('address.city') ? "is-invalid" : ""
                }`}
                id="address.city"
                name="address.city"
                value={updatedProfileData.address.city}
                onChange={onInputChange}
                required
              />
              {getErrorMessage('address.city') && (
                <div className="invalid-feedback">
                  {getErrorMessage('address.city')}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address.state" className="form-label">
                State
              </label>
              <input
                type="text"
                className={`form-control ${
                  getErrorMessage('address.state') ? "is-invalid" : ""
                }`}
                id="address.state"
                name="address.state"
                value={updatedProfileData.address.state}
                onChange={onInputChange}
                required
              />
              {getErrorMessage('address.state') && (
                <div className="invalid-feedback">
                  {getErrorMessage('address.state')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address.country" className="form-label">
                Country
              </label>
              <input
                type="text"
                className={`form-control ${
                  getErrorMessage('address.country') ? "is-invalid" : ""
                }`}
                id="address.country"
                name="address.country"
                value={updatedProfileData.address.country}
                onChange={onInputChange}
                required
              />
              {getErrorMessage('address.country') && (
                <div className="invalid-feedback">
                  {getErrorMessage('address.country')}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address.pincode" className="form-label">
                Pincode
              </label>
              <input
                type="text"
                className={`form-control ${
                  getErrorMessage('address.pincode') ? "is-invalid" : ""
                }`}
                id="address.pincode"
                name="address.pincode"
                value={updatedProfileData.address.pincode}
                onChange={onInputChange}
                required
              />
              {getErrorMessage('address.pincode') && (
                <div className="invalid-feedback">
                  {getErrorMessage('address.pincode')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 mt-4"> {/* Aligned to end, with gap */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default UserProfileUpdate;