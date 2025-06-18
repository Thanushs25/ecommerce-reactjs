import React from 'react';
import './OrderListByDate.css'; // Add this line


const OrderListByDate = ({
  orders,
  title = 'Orders',
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onFilter,
}) => {
  // if (!orders || orders.length === 0) {
  //   return <p className="text-center">No orders to display.</p>;
  // }

  return (
    <div className="order-list-container container">
      <div className="order-header d-flex justify-content-between align-items-center mb-4">
        <h3 className="order-title">{title}</h3>
        <div className="date-filter-container d-flex align-items-center">
          <div className="me-2">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="me-2">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="btn btn-primary filter-button" onClick={onFilter}>
  Filter
</button>
        </div>
      </div>
      {orders.length === 0 ? (
        <p>No orders found for the selected date range.</p>
      ) : (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <tr key={item.orderItemId}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>₹{(item.quantity * item.price).toFixed(2)}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
   )}
    </div>
  );
};

export default OrderListByDate;
