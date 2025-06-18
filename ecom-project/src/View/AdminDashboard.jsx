// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData, fetchOrdersByDate } from '../api/api';
import Dashboard from '../components/dashboard/Dashboard'; // Assuming Dashboard component exists
import OrderListByDate from '../components/dashboard/OrderListByDate'; // Assuming OrderListByDate component exists
import useLogout from '../Hooks/useLogout';
import { selectAdminId } from '../redux/credentials/idSlice';
import AdminSidebar from '../components/sideBar/AdminSidebar';
import { Spinner, Alert } from 'react-bootstrap'; // Import Bootstrap components
import './AdminDashboard.css'; // New CSS file for the entire layout
import Footer from '../components/navigation/Footer';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtered, setFiltered] = useState(false); 
    const adminId = useSelector(selectAdminId);
    const { logout } = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout('admin'); // Use the useLogout hook
    };

    useEffect(() => {
        if (!adminId) {
            console.log('Admin ID not found, redirecting to login...');
            navigate('/admin/login');
            return;
        }

        const getDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchDashboardData(adminId);
                setDashboardData(data);
                // Initially set filteredOrders to all orderedItems if available
                setFilteredOrders(data?.orderedItems || []);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please try again.');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        getDashboardData();
    }, [adminId, navigate]);

    const handleFilterByDate = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }
        setLoading(true);
        setFiltered(true);
        setError(null);
        try {
            const orders = await fetchOrdersByDate(startDate, endDate);
            setFilteredOrders(orders);
        } catch (err) {
            setError('Failed to fetch orders by date. Please check your dates and try again.');
            console.error('Error fetching orders by date:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <Spinner animation="border" role="status" className='text-'>
                    <span className="visually-hidden">Loading dashboard...</span>
                </Spinner>
            </div>
        );
    }
    const isFiltered = filtered && startDate && endDate;
    const ordersToDisplay = isFiltered ? filteredOrders : dashboardData?.orderedItems || [];
    const orderListTitle =isFiltered ? filteredOrders.length > 0
        ? `Orders from ${startDate} to ${endDate}`
        : "No orders found "
        : 'All Orders (Recent)';

    return (
        <>
        <div className="admin-layout-wrapper"> {/* Main layout container */}
            <AdminSidebar onLogout={handleLogout} /> {/* Sidebar component */}

            <main className="admin-layout-main-content"> {/* Main content area */}
                <div className="admin-content-inner p-4"> {/* Inner padding for content */}
                    <h1 className="admin-main-title mb-4">Dashboard Overview</h1>

                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <section className="dashboard-overview mb-5">
                        {/* Your Dashboard component expects data */}
                        <Dashboard data={dashboardData} />
                    </section>

                    <section className="order-section">
                        {/* Your OrderListByDate component expects props */}
                        <OrderListByDate
                            orders={ordersToDisplay}
                            title={orderListTitle}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onFilter={handleFilterByDate}
                        />
                    </section>
                </div>
            </main>
        </div>
        <Footer />
        </>
    );
};

export default AdminDashboard;