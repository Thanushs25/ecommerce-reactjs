import React, { useState, useEffect } from 'react';
import axiosConfig from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cartItems/CartItems';
import { useSelector } from 'react-redux';
import { selectUserId } from '../redux/credentials/idSlice';
import './CartPage.css';
import NavigationBar from '../components/navigation/NavigationBar';
import Footer from '../components/navigation/Footer';

const CartPage = () => {
    const userId = useSelector(selectUserId);
    console.log('User ID from params:', userId);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const fetchCartItems = async (userId) => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(`user/carts/cartItems/${userId}`);
            console.log(response.data);
            if (response.status === 200) {
                setCartItems(response.data);
                console.log('Cart items fetched successfully for user:', userId);
            } else {
                throw new Error('Failed to fetch cart items');
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError(error.message || 'Failed to fetch cart items');
        } finally {
            setLoading(false);
        }
    };

    // When cartItems state updates, this component re-renders,
    // and all calculations below will automatically use the new cartItems data.
    const handleQuantityUpdate = (cartItemId, newQuantity, price) => {
        console.log("new" + newQuantity + "price" + price)
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === cartItemId ? { ...item, quantity: newQuantity, amount: price } : item
            )
        );

        // No need to call calculateSubtotal() here, as the component will re-render
        // and all derived calculations (subtotal, gstAmount, totalPayable)
        // will automatically update with the new cartItems state.
    };

    console.log(cartItems)


    const handleRemoveItem = (cartItemId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
    };

    const handlePlaceOrder = async () => {
        setPlacingOrder(true);
        try {
            const getAddress = await axiosConfig.get(`/user/address/${userId}`);
            console.log('Fetched address:', getAddress);
            if (!getAddress.data.address || Object.keys(getAddress.data.address).length === 0) {
                navigate("/user/add-address");
            } else {
                console.log('Address found:', getAddress.address);
                // Pass the cartId to the address page for order processing
                navigate('/user/address', { state: { cartId: cartItems[0].cartId } });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setError(error.message || 'Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCartItems(userId);
        }
    }, [userId]);

    // --- Calculations for Order Summary (these run on every render) ---
    // Make sure 'amount' in your cartItems reflects (price * quantity)
    // from your backend or calculate it here if needed.
    const calculateSubtotal = () => {
        // Assuming item.amount already represents (price * quantity) for each item.
        // If not, you might need: item.price * item.quantity
        return cartItems.reduce((total, item) => total + item.amount, 0);
    };

    const subtotal = calculateSubtotal();
    console.log(subtotal);
    const GST_RATE = 0.05; // 5% GST
    const SHIPPING_CHARGE = 50.00; // Example fixed shipping charge

    const gstAmount = subtotal * GST_RATE;
    const totalPayable = subtotal + gstAmount + SHIPPING_CHARGE;

    // --- END Calculations ---

    if (loading) {
        return <div className="cart-page-container text-center">Loading cart...</div>;
    }

    // You might want to handle an empty cart message when no items are fetched initially due to an empty cart
    // or if all items are removed.
    if (!loading && cartItems.length === 0 && !error) {
        return (
            <>
                <NavigationBar />
                <div className="cart-page-container">
                    <h1>Your Shopping Cart</h1>
                    <p>Your cart is empty.</p>
                    <button className="btn shop-more w-25" onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
            </>
        );
    }

    return (
        <>
            <NavigationBar />
            <div className="cart-page-container">
                <h1>Your Shopping Cart</h1>
                {/* {error && <p className="text-danger text-center">Error: {error}</p>} */}
                {cartItems.length > 0 ? (
                    <>
                        <div className="cart-items-list d-flex flex-column justify-content-center align-items-center">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onQuantityUpdate={handleQuantityUpdate}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                            <button className='btn add-cart-btn w-50' onClick={()=>navigate('/search')}>Add More</button>
                        </div>


                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-item">
                                <span>Subtotal:</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-item">
                                <span>GST ({GST_RATE * 100}%):</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-item">
                                <span>Delivery Charges:</span>
                                <span>₹{SHIPPING_CHARGE.toFixed(2)}</span>
                            </div>
                            <div className="summary-total">
                                <h4>Total Payable:</h4>
                                <h4>₹{totalPayable.toFixed(2)}</h4>
                            </div>
                        </div>

                        <button
                            className="btn btn-success mt-4"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                        >
                            {placingOrder ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </>
                ) : (
                    // This block will be rendered if cartItems becomes empty after fetching
                    <p>Your cart is empty.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CartPage;