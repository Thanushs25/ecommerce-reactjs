import React from 'react';
import ProductForm from '../components/productForm/ProductForm';
import AdminSidebar from '../components/sideBar/AdminSidebar';
import useLogout from '../Hooks/useLogout';
import Footer from '../components/navigation/Footer';

const ProductAdd = () => {
  const { logout } = useLogout();
  const handleLogout = () => {
    logout("admin");
  };

  return (
    <>
    <div className="d-flex"> {/* Use flexbox to align sidebar and content */}
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-grow-1 p-4"> {/* Main content area takes remaining space, with padding */}
        <ProductForm />
      </main>
    </div>
    <Footer />
    </>
  );
};

export default ProductAdd;