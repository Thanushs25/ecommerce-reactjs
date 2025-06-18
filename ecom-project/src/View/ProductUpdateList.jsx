// src/pages/ProductUpdateList.jsx (assuming it's in a 'pages' directory)
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListProduct from '../components/listProduct/ListProduct';
import AdminSidebar from '../components/sideBar/AdminSidebar';
import useLogout from '../Hooks/useLogout';
import { selectAdminId } from '../redux/credentials/idSlice';
import { Spinner, Alert } from 'react-bootstrap'; // Import Bootstrap components
import {
    fetchProductAdmin,
    selectError,
    selectLoading,
    selectProducts
} from '../redux/product/adminProductSlice';

import './ProductUpdateList.css'; // New CSS for this page and layout imports
import Footer from '../components/navigation/Footer';

const ProductUpdateList = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const adminId = useSelector(selectAdminId);
    const { logout } = useLogout();

    useEffect(() => {
        if (adminId) {
            dispatch(fetchProductAdmin(adminId));
        }
    }, [dispatch, adminId]);

    const handleLogout = () => {
        logout("admin");
    };

    console.log("Admin ID:", adminId);
    console.log("Products:", products);

    return (
        <>
        <div className="admin-layout-wrapper"> {/* Use the consistent layout wrapper */}
            <AdminSidebar onLogout={handleLogout} /> {/* Admin Sidebar */}

            <main className="admin-layout-main-content"> {/* Main content area */}
                <div className="admin-content-inner p-4"> {/* Inner padding for content */}
                <h1 className="admin-main-title mb-4 page-title">Manage Products</h1>

                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="visually-hidden">Loading products...</span>
                            </Spinner>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    ) : (
                        <ListProduct products={products} />
                    )}
                </div>
            </main>
        </div>
        <Footer />
        </>
    );
};

export default ProductUpdateList;