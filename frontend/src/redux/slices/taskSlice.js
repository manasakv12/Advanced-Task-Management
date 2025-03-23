// src/redux/slices/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await fetch('/api/tasks'); // Replace with your API endpoint
    const data = await response.json();
    return data;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    taskList: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add Task
    addTask: (state, action) => {
      state.taskList.push(action.payload);
    },
    // Update Task
    updateTask: (state, action) => {
      const index = state.taskList.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.taskList[index] = action.payload;
      }
    },
    // Delete Task
    deleteTask: (state, action) => {
      state.taskList = state.taskList.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.taskList = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions
export const { addTask, updateTask, deleteTask } = taskSlice.actions;

// Export the reducer
export default taskSlice.reducer;
