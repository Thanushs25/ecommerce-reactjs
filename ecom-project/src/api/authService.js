import axios from "./axiosConfig.js";

// User Login
export const userLogin = (credentials) => axios.post('/user/login', credentials);

// User Signup
export const userSignup = (userData) => axios.post('/user/signup', userData);

// Admin Login
export const adminLogin = (credentials) => axios.post('/admin/login', credentials);

// Function to fetch user profile by user ID
export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`/user/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error; // Re-throw the error so the calling component can handle it
    }
};

// Function to update user profile by user ID
export const updateUserProfile = async (userId, profileData) => {
    try {
        const response = await axios.patch(`/user/profile/${userId}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};


export const addAddress = async (userId, addressData) => {
    try {
        const response = await axios.post(`/user/address/${userId}`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error adding address:', error);
        throw error;
    }
}

export const getAddress = async (userId) => {
    try {
        const response = await axios.get(`/user/address/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching address:', error);
        throw error;
    }
}