import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../../api/axiosConfig';

const initialState = {
    products: [],
    loading: false,
    error: null,
};

export const fetchFilteredProduct = createAsyncThunk(
    "products/fetchFilteredProductAdmin",
    async ({ category, subcategory, lowPrice, maxPrice }, { rejectWithValue }) => {
        try {
            let response;

            if (category && subcategory && lowPrice && maxPrice) {
                console.log("Fetching products by category, subcategory, and price range:", category, subcategory, lowPrice, maxPrice);
                response = await axiosConfig.get(`/products/category/${category}/subCategory/${subcategory}/priceRange/${lowPrice}/${maxPrice}`);
                console.log("Response data:", response.data);
            } else if (category && subcategory && !lowPrice && !maxPrice) {
                console.log("Fetching products by category and subcategory:", category, subcategory);
                response = await axiosConfig.get(`/products/category/${category}/subCategory/${subcategory}`);
                console.log("Response data:", response.data);
            } else if (category && lowPrice && maxPrice && !subcategory) {
                console.log("Fetching products by category and price range:", category, lowPrice, maxPrice);
                response = await axiosConfig.get(`/products/category/${category}/priceRange/${lowPrice}/${maxPrice}`);
                console.log("Response data:", response.data);
            } else if (category && !subcategory && !lowPrice && !maxPrice) {
                console.log("Fetching products by category:", category);
                response = await axiosConfig.get(`/products/category/${category}`);
                console.log("Response data:", response.data);
            } else {
                console.log("Fetching all products");
                response = await axiosConfig.get(`/home`);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const filterProductSlice = createSlice({
    name: "filteredProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilteredProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchFilteredProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default filterProductSlice.reducer;

export const selectFilteredProducts = (state) => state.filteredProducts.products;
export const selectFilteredLoading = (state) => state.filteredProducts.loading;
export const selectFilteredError = (state) => state.filteredProducts.error;