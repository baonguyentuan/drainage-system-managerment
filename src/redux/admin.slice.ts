import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { USER_LOGIN_DTO } from "../models/user.model";
import authRepository from "../repository/auth.repository";

const initialState = {
  menuBarStatus: "user" as string,
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    setMenuBarStatus(state, action: PayloadAction<{ status: string }>) {
      state.menuBarStatus = action.payload.status;
    },
  },
});

export const { setMenuBarStatus } = adminSlice.actions;

export default adminSlice.reducer;
