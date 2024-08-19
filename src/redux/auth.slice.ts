import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import authRepository from "../repository/auth.repository";
import { USER_LOGIN_DTO } from "../models/user.model";
import { useNavigate } from "react-router-dom";
import { openNotificationWithIcon } from "../untils/operate/notify";

const initialState = {};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("accessToken", action.payload.data.accessToken);
      localStorage.setItem("userId", action.payload.data.userId);
      window.location.replace("/home");
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      window.location.replace("/login");
    });
    builder.addMatcher(isAnyOf(login.rejected), (state, action) => {
      console.log(action);
      openNotificationWithIcon("error", "Lỗi", "");
    });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
export const login = createAsyncThunk(
  "auth/login",
  async (userDto: USER_LOGIN_DTO, thunkApi) => {
    // try {
    const response = await authRepository.login(userDto);
    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }
    return response.data;
  }
);
export const logout = createAsyncThunk("auth/logout", async () => {
  // try {
  const response = await authRepository.logout();
  //   console.log(response);
  // } catch (error) {
  //   console.log(error);
  // }
});
