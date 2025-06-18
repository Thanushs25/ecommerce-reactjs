import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../api/axiosConfig";

const initialState = {
    products: [],
    loading: false,
    error: null,
};

const fetchProductAdmin = createAsyncThunk(
    "products/fetchProductAdmin",
    async (adminId, { rejectWithValue }) => {
        try {
            console.log("Fetching products...");
            const response = await axiosConfig.get(`admin/manage/allProducts/${adminId}`);
            console.log("Products fetched successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
export { fetchProductAdmin };
export const selectProducts = (state) => state.adminProducts.products;
export const selectLoading = (state) => state.adminProducts.loading;
export const selectError = (state) => state.adminProducts.error;



