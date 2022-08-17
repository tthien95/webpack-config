import { configureStore } from '@reduxjs/toolkit';
import toastSlice from './toast-slice';

const store = configureStore({
  reducer: toastSlice,
});

export default store;
