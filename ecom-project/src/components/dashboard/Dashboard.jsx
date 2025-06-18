import React from 'react';
import './Dashboard.css';

const Dashboard = ({ data }) => {
  if (!data) {
    return <div className="text-center">Loading summary...</div>;
  }

  return (
    <div className="dashboard-summary container my-4">
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title page-title">Total Orders</h5>
              <p className="card-text">{data.orderCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title page-title">Total Order Items</h5>
              <p className="card-text">{data.orderItemsCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title page-title">Total Products</h5>
              <p className="card-text">{data.productCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body ">
              <h5 className="card-title page-title">Total Revenue</h5>
              <p className="card-text">₹ {data.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
