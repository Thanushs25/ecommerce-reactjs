import axios from "./axiosConfig"; 


// Function to fetch all order items for a specific user ID
export const getOrdersByUserId = async (userId) => {
    try {
        const response = await axios.get(`/user/orders/getOrdersByUserId/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching orders by user ID:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
    }
};

// Function to create an order (this would typically be called from your cart page)
export const createOrder = async (cartId) => {
    try {
        const response = await axios.post(`/user/orders/${cartId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
    }
};

// Function to fetch a specific order's items by order ID
export const getOrdersByOrderId = async (orderId) => {
    try {
        const response = await axios.get(`/admin/orders/getOrdersByOrderId/${orderId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching order by order ID:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
    }
};

// NEW FUNCTION: To set the status of an order for Admin
export const setOrderStatus = async (orderId, status) => {
    try {
        // The backend expects status as a request parameter, not part of the body
        const response = await axios.post(`/admin/orders/setStatus/${orderId}?status=${status}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error setting status for order ${orderId}:`, error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
    }
};

export const fetchDashboardData = async (adminId) => {
    try {
      // Axios will automatically add the Authorization header if setAuthToken was called
      const response = await axios.get(`/admin/dashboard/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };
  
  export const fetchOrdersByDate = async (startDate, endDate) => {
    try {
      // Axios will automatically add the Authorization header if setAuthToken was called
      const response = await axios.get(`/admin/getByDate`, {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders by date:', error);
      throw error;
    }
  };

  export const getAllOrdersForAdmin = async () => {
    try {
        const response = await axios.get(`/admin/orders/getAllOrders`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching all orders for admin:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
    }};

    export const deleteOrderItem = async (orderItemId) => {
      try{
        const response = await axios.delete(`/user/orders/deleteOrderItemById/${orderItemId}`);
        return { success: true, data: response.data };
      }catch (error) {
        console.error('Error deleting order item:', error.response ? error.response.data : error.message);
        return { success: false, error: error.response ? error.response.data : error.message };
      }
    };


export const deleteReviewById = async (userId, reviewId) => {
    try {
        const response = await axios.delete(`/user/review/${userId}/deleteReviewById/${reviewId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error deleting review:', error);
        return { success: false, error: error.response?.data || 'Failed to delete review' };
    }
};

export const updateReviewById = async (userId, reviewId, updatedData) => {
    try {
      console.log('Updating review with data:', updatedData);
        const response = await axios.patch(`/user/review/${userId}/updateReviewById/${reviewId}`, updatedData);
        console.log('Update Review Response:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating review:', error);
        return { success: false, error: error.response?.data || 'Failed to update review' };
    }
};

export const addReview = async (reviewData) => {
  try {
      const response = await axios.post(`/user/review/add`, reviewData);
      return { success: true, data: response.data };
  } catch (error) {
      console.error('Error adding review:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to add review.' };
  }
};