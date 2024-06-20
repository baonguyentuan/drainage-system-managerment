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
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      console.log(state);

      console.log(action);
    });
    builder.addMatcher(isAnyOf(login.rejected), (state, action) => {
      console.log(action);
    });
  },
});

export const { setMenuBarStatus } = adminSlice.actions;

export default adminSlice.reducer;

export const login = createAsyncThunk(
  "auth/login",
  async (userDto: USER_LOGIN_DTO, thunkApi) => {
    // try {
    const response = await authRepository.login(userDto);
    // } catch (error) {
    //   console.log(error);
    // }
    // return response.data;
  }
);
