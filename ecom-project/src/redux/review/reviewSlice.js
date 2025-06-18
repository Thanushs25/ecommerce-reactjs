import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../../api/axiosConfig';

export const fetchReviewsByProductId = createAsyncThunk(
    'reviews/fetchReviewsByProductId',
    async (productId, { rejectWithValue }) => {
        try {
            console.log('Fetching reviews for product ID:', productId);
            const response = await axiosConfig.get(`/review/getReviewByProductId/${productId}`);
            console.log('Fetched reviews:', response);

            return response.data; 
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.error = null;
        },
        setReviews: (state, action) => {
            state.reviews = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewsByProductId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviewsByProductId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;