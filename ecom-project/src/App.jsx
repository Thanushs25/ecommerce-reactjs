import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './View/Home'
import Product from './View/Product'
import ProductAdd from './View/ProductAdd'
import ProductUpdateList from './View/ProductUpdateList'
import ProductUpdate from './View/ProductUpdate'
import FilterProducts from './View/FilterProducts'
import CartPage from './View/CartPage'
import UserOrders from './components/orders/UserOrders'
import OrderDetails from './components/orders/OrderDetails'
import UnAuthorized from './View/UnAuthorized'
import AdminDashboard from './View/AdminDashboard'
import UserLogin from './View/UserLogin'
import AdminLogin from './View/AdminLogin'
import UserSignup from './View/UserSignup'
import PrivateRoute from './router/PrivateRoute'
import UserProfile from './View/UserProfile'
import AddressDisplay from './View/AddressDisplay'
import AddAddress from './View/AddAddress'
import PaymentMethods from './View/PaymentMethods'
import OrderSuccess from './View/OrderSuccess'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick k
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Home />} />

        <Route 
          path='/user/login' 
          element={
              <UserLogin />
          }
        />

        <Route 
          path='/user/signup' 
          element={
              <UserSignup />
          }
        />
  
        <Route
          path='/admin/login'
          element={
              <AdminLogin />
          }
        />

        <Route
          path='/user/profile'
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <UserProfile />
            </PrivateRoute>
          }
        />

        <Route
          path='/user/address'
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <AddressDisplay />
            </PrivateRoute>
          }
        />

        <Route path='/user/payment' element={
          <PrivateRoute allowedRoles={['USER']}>
            <PaymentMethods />
          </PrivateRoute>
        } />

        <Route
          path='/user/add-address'
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <AddAddress />
            </PrivateRoute>
          }
        />

        <Route
          path='/product'
          element={
            <Product />
          }
        />

        <Route
          path='/admin/addProduct'
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <ProductAdd />
            </PrivateRoute>
          }
        />

        <Route
          path='/admin/showProduct'
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <ProductUpdateList />
            </PrivateRoute>
          }
        />

        <Route
          path='/admin/updateProduct/:productId'
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <ProductUpdate />
            </PrivateRoute>
          }
        />

        <Route
          path='/search/:searchQuery?'
          element={
            <FilterProducts />
          }
        />


        <Route
          path='/user/cart'
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/orders"
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <UserOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/orderSuccess"
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <OrderSuccess />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/order-details"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <OrderDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <UnAuthorized />
          }
        />

        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
