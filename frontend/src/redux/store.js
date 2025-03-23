import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,  // This should match the name in your slice
  },
});

export default store;
