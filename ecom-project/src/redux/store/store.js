import {configureStore} from '@reduxjs/toolkit';
import productReducer from '../product/productSlice';
import adminProductReducer from '../product/adminProductSlice';
import filteredProductReducer from '../product/filterProductSlice';
import idReducer from '../credentials/idSlice';
import reviewReducer from '../review/reviewSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    adminProducts: adminProductReducer,
    filteredProducts:filteredProductReducer,
    ids: idReducer,
    reviews: reviewReducer,

  },
});