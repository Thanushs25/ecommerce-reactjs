// src/pages/OrderDetails.jsx (assuming it's in a 'pages' directory)
import React, { useState, useEffect, useMemo } from 'react';
import { setOrderStatus, getAllOrdersForAdmin } from '../../api/api';
import OrderItemCard from './OrderItemCard'; // Updated path
import AdminSidebar from '../sideBar/AdminSidebar';// Import AdminSidebar
import useLogout from '../../Hooks/useLogout'; // Import useLogout hook
import { useSelector } from 'react-redux';
import { selectAdminId } from '../../redux/credentials/idSlice'; // Import selectAdminId
import { Spinner, Alert, Form, Button } from 'react-bootstrap'; // Import Bootstrap components
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons'; // For expand/collapse icon

import './OrderDetails.css'; // New CSS file for OrderDetails page

const OrderDetails = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [globalError, setGlobalError] = useState('');
    const [globalMessage, setGlobalMessage] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [updateStatusError, setUpdateStatusError] = useState('');
    const [updateStatusMessage, setUpdateStatusMessage] = useState('');
    const [localOrderStatuses, setLocalOrderStatuses] = useState({});
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [filterStatus, setFilterStatus] = useState('All');

    const adminId = useSelector(selectAdminId); // Get adminId from Redux
    const { logout } = useLogout(); // Initialize useLogout hook

    const handleLogout = () => {
        logout("admin");
    };

    const fetchAllOrders = async () => {
        setIsLoadingOrders(true);
        setGlobalError('');
        setGlobalMessage('');
        try {
            const response = await getAllOrdersForAdmin();
            console.log('API Response:', response.data); // Debugging log

            if (response.success && Array.isArray(response.data)) {
                setAllOrders(response.data);
                const initialStatuses = {};
                response.data.forEach(order => {
                    initialStatuses[order.orderId] = order.orderStatus;
                });
                setLocalOrderStatuses(initialStatuses);
                setGlobalMessage(`Successfully loaded ${response.data.length} orders.`);
            } else {
                setGlobalError(response.error ||'No Orders found.');
                setAllOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setGlobalError('An error occurred while fetching orders.');
            setAllOrders([]);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        
        fetchAllOrders();
    }, []); 

    const handleLocalStatusChange = (orderId, newStatus) => {
        setLocalOrderStatuses(prevStatuses => ({
            ...prevStatuses,
            [orderId]: newStatus,
        }));
    };

    const handleUpdateOrderStatus = async (orderId) => {
        setUpdatingOrderId(orderId);
        setUpdateStatusError('');
        setUpdateStatusMessage('');

        const selectedStatus = localOrderStatuses[orderId];
        if (!selectedStatus || selectedStatus === 'Select Status') { // Added check for default option
            setUpdateStatusError('Please select a valid status to update.');
            setUpdatingOrderId(null);
            return;
        }

        const response = await setOrderStatus(orderId, selectedStatus);
        if (response.success) {
            setUpdateStatusMessage(`Order ${orderId} status updated successfully.`);
            await fetchAllOrders(); // Re-fetch to reflect changes
        } else {
            setUpdateStatusError(response.error || `Failed to update status for order ${orderId}.`);
        }
        setUpdatingOrderId(null);
    };

    const toggleOrderItems = (orderId) => {
        setExpandedOrders(prevExpanded => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(orderId)) {
                newExpanded.delete(orderId);
            } else {
                newExpanded.add(orderId);
            }
            return newExpanded;
        });
    };

    console.log()

    // Filter orders based on the selected status
    const filteredOrders = useMemo(() => {
        if (filterStatus === 'All') {
            return allOrders;
        }
        const o =  allOrders.filter(order => order.orderStatus.toLowerCase() === filterStatus.toLowerCase());         
        console.log('Filtered orders:', o); // Debugging log
        return o;
    }, [allOrders, filterStatus]);

    return (
        <div className="admin-layout-wrapper">
            <AdminSidebar onLogout={handleLogout} />

            <main className="admin-layout-main-content">
                <div className="admin-content-inner p-4"> {/* Inner padding for content */}
                    <h1 className="admin-main-title mb-4 page-title">Manage Orders</h1>

                    {/* {(globalMessage || globalError) && (
                        <div className="mb-4">
                            {globalMessage && <Alert variant="success">{globalMessage}</Alert>}
                            {globalError && <Alert variant="danger">{globalError}</Alert>}
                        </div>
                    )} */}

                    <div className="order-filter-container">
                        <Form.Label htmlFor="status-filter" className="filter-label">Filter by Status:</Form.Label>
                        <Form.Select
                            id="status-filter"
                            className="filter-select shadow-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="yet to be delivered">Yet to be Delivered</option>
                            <option value="delivered">Delivered</option>
                        </Form.Select>
                    </div>

                    {isLoadingOrders ? (
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="visually-hidden">Loading orders...</span>
                            </Spinner>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        <div className="orders-table-responsive"> {/* Wrapper for responsive table */}
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th className="table-header">Order ID</th>
                                        <th className="table-header">User ID</th>
                                        <th className="table-header">Order Date</th>
                                        <th className="table-header">Total Price</th>
                                        <th className="table-header">Status</th>
                                        <th className="table-header">Actions</th>
                                        <th className="table-header">Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <React.Fragment key={order.orderId}>
                                            <tr className="table-row">
                                                <td className="table-data">{order.orderId}</td>
                                                <td className="table-data">{order.userId}</td>
                                                <td className="table-data">{new Date(order.orderDate).toLocaleDateString()}</td>
                                                <td className="table-data">₹{order.finalAmount ? order.finalAmount.toFixed(2) : 'N/A'}</td>
                                                <td className="table-data">{order.orderStatus}</td>
                                                <td className="table-data">
                                                    <div className="action-wrapper">
                                                        <Form.Select
                                                            value={localOrderStatuses[order.orderId] || order.orderStatus}
                                                            onChange={(e) => handleLocalStatusChange(order.orderId, e.target.value)}
                                                            disabled={updatingOrderId === order.orderId}
                                                            className="status-select"
                                                        >
                                                            <option value="Select Status">Select Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="paid">Paid</option>
                                                        </Form.Select>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            className="update-button"
                                                            onClick={() => handleUpdateOrderStatus(order.orderId)}
                                                            disabled={updatingOrderId === order.orderId || localOrderStatuses[order.orderId] === order.orderStatus}
                                                        >
                                                            {updatingOrderId === order.orderId ? (
                                                                <>
                                                                    <Spinner
                                                                        as="span"
                                                                        animation="border"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    />{' '}
                                                                    Updating...
                                                                </>
                                                            ) : (
                                                                'Update'
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td className="table-data text-center">
                                                    <Button
                                                        variant="link"
                                                        className="expand-button"
                                                        onClick={() => toggleOrderItems(order.orderId)}
                                                    >
                                                        {expandedOrders.has(order.orderId) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </Button>
                                                </td>
                                            </tr>
                                            {expandedOrders.has(order.orderId) && (
                                                <tr className="expanded-row">
                                                    <td colSpan="7" className="p-0">
                                                        {order.orderItems && order.orderItems.length > 0 ? (
                                                            <div className="order-items-container">
                                                                {order.orderItems.map((item) => (
                                                                    <OrderItemCard key={item.orderItemId} item={item} />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="no-items-message">
                                                                No items found for this order.
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-orders-message">
                            {filterStatus === 'All' ? 'No orders found.' : `No orders found with status "${filterStatus}".`}
                        </p>
                    )}

                    {(updateStatusMessage || updateStatusError) && (
                        <div className="mt-4">
                            {updateStatusMessage && <Alert variant="success">{updateStatusMessage}</Alert>}
                            {updateStatusError && <Alert variant="danger">{updateStatusError}</Alert>}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderDetails;