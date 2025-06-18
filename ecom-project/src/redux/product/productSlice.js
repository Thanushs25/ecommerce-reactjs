import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../api/axiosConfig";

const initialState = {
    products: [],
    loading: false,
    error: null,
};

export const fetchProduct = createAsyncThunk(
    "products/fetchProduct",

    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching products...")
            const response = await axiosConfig.get("/home");
            console.log("Products fetched successfully:", response.data);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});

export default productSlice.reducer;

export const selectProducts = (state) => state.products.products;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
