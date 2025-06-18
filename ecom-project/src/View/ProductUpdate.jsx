import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UpdateProductForm from '../components/productForm/UpdateProductForm';
import { useSelector } from 'react-redux';
import { selectAdminId } from '../redux/credentials/idSlice';
import useLogout from '../Hooks/useLogout';
import AdminSidebar from '../components/sideBar/AdminSidebar';

// Import the CSS here as well, although it's already imported in UpdateProductForm.
// It's good practice to ensure layout-related CSS is available at the layout level.
import '../components/productForm/UpdateProductForm.css'; // Ensure this path is correct
import Footer from '../components/navigation/Footer';

const ProductUpdate = () => {
  const location = useLocation();
  const { logout } = useLogout();
  const product = location.state || { product: [] };
  const { productId } = useParams(); // Destructure productId directly
  const adminId = useSelector(selectAdminId);

  console.log('Product ID:', productId);
  console.log('Admin ID:', adminId);
  console.log(product);

  const handleLogout = () => {
    logout("admin");
  };

  return (
    <>
    <div className="page-wrapper"> {/* This is the main wrapper for sidebar and content */}
      <AdminSidebar onLogout={handleLogout} /> {/* Your fixed sidebar */}
      <main className="main-content-area"> {/* This will hold your form and take remaining space */}
        {/* The UpdateProductForm is now inside the main-content-area */}
        <UpdateProductForm prevProduct={product} productId={productId} adminId={adminId} />
      </main>
    </div>
    <Footer />
    </>
  );
};

export default ProductUpdate;