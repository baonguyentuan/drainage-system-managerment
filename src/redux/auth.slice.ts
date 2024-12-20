import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import authRepository from "../repository/auth.repository";
import { USER_LOGIN_DTO } from "../models/user.model";
import { openNotificationWithIcon } from "../untils/operate/notify";

const initialState = {};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("accessToken", action.payload.data);
      window.location.replace("/home");
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      localStorage.removeItem("accessToken");
      window.location.replace("/login");
    });
    builder.addMatcher(isAnyOf(login.rejected), (state, action) => {
      console.log(action);
      openNotificationWithIcon("error", "Lỗi", "");
    });
  },
});

export default authSlice.reducer;
export const login = createAsyncThunk(
  "auth/login",
  async (userDto: USER_LOGIN_DTO, thunkApi) => {
    try {
      const response = await authRepository.login(userDto);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const logout = createAsyncThunk("auth/logout", async () => {
  return authRepository.logout();
});
