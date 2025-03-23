import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register User
export const registerUser = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
        const response = await axios.post("/api/auth/register", userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Login User
export const loginUser = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        const response = await axios.post("/api/auth/login", userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: { userInfo: JSON.parse(localStorage.getItem("userInfo")) || null, loading: false, error: null },
    reducers: {
        logout: (state) => {
            localStorage.removeItem("userInfo");
            state.userInfo = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; })
            .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
