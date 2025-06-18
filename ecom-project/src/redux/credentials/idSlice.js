import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const storedToken = localStorage.getItem("token");
let initialUserId = null;
let initialAdminId = null;


if (storedToken) {
  try {
    const tokenData = jwtDecode(storedToken); // Decode the token
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (tokenData.exp && tokenData.exp > currentTime) {
      // Check if the token contains userId or adminId
      if (tokenData.userId) {
        initialUserId = tokenData.userId;
      }
      if (tokenData.adminId) {
        initialAdminId = tokenData.adminId;
      }
    } else {
      console.warn("Token has expired");
      localStorage.removeItem("token"); // Remove expired token
    }
  } catch (e) {
    console.error("Error decoding token:", e);
  }
}

const initialState = {
  userId: initialUserId,
  adminId: initialAdminId,
};

const idSlice = createSlice({
  name: 'ids',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      console.log("Setting userId:", action.payload);
      state.userId = action.payload;
      console.log("New userId:", state.userId);
    },
    setAdminId: (state, action) => {
      state.adminId = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;
    },
    clearAdminId: (state) => {
      state.adminId = null;
    },
  },
});

export const { setUserId, setAdminId, clearAdminId, clearUserId } = idSlice.actions; 
export default idSlice.reducer;
export const selectUserId = (state) => state.ids.userId;
export const selectAdminId = (state) => state.ids.adminId; 