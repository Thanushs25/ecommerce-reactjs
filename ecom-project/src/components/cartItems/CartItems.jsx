import React, { useEffect, useState } from 'react';
import './CartItem.css';
import axiosConfig from '../../api/axiosConfig';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../redux/credentials/idSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartItem = ({ item, onQuantityUpdate, onRemove }) => {
    console.log(item)
    const [quantity, setQuantity] = useState(item.quantity);
    const [loading, setLoading] = useState(false);
    const[price, setPrice] = useState(item.amount);
    const [removing, setRemoving] = useState(false);

    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        setQuantity(newQuantity);
    };

    const userId = useSelector(selectUserId);

    // useEffect(() => {
    //     setPrice(quantity*item.amount);
    // },[quantity]);


    const handleUpdateClick = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('quantity', quantity);
            const response = await axiosConfig.put(
                `/user/carts/updateCart/user/${userId}/cart/${item.id}`,
                null,
                { params }
            );
            setPrice(item.indPrice * quantity);
            console.log('Quantity updated successfully:', response.data);
            if (onQuantityUpdate) {
                // console.log("+++"+item.indPrice * quantity)
                onQuantityUpdate(item.id, quantity, item.indPrice * quantity);
            }
            toast.success('Quantity updated successfully', quantity);
        } catch (error) {
            console.error('Error updating quantity:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
            setQuantity(item.quantity);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveClick = async () => {
        setRemoving(true);
        try {
            const response = await axiosConfig.delete(
                `/user/carts/deleteCartItem/user/${userId}/cart/${item.id}`
            );
            console.log('Item removed successfully:', response.data);
            if (onRemove) {
                onRemove(item.id);
            }
            toast.success('Item removed from cart!'); // Added a toast notification for removal
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error(error.response?.data?.message || 'Failed to remove item'); // Added error toast
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="cart-item w-100">
            <div className="cart-item-image">
                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.productName} />
            </div>
            <div className="cart-item-details">
                <h3 className="cart-item-name">{item.productName}</h3>
                <p className="cart-item-price">Price: ₹{price}</p>
                <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${item.cartItemId}`}>Quantity:</label>
                    <input
                        type="number"
                        id={`quantity-${item.cartItemId}`}
                        value={quantity}
                        min="1"
                        onChange={handleQuantityChange}
                        disabled={loading || removing}
                    />
                </div>
                <div className="cart-item-actions d-flex mt-3"> {/* Added a div for buttons and flex for alignment */}
                    <button
                        className="btn btn-primary me-2" // Added me-2 for margin-right
                        onClick={handleUpdateClick}
                        disabled={loading || removing}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleRemoveClick}
                        disabled={removing}
                    >
                        {removing ? 'Removing...' : 'Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;