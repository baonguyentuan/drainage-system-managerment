import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { USER_DETAIL, USER_DTO, USER_SHOW } from "../models/user.model";
import userRepository from "../repository/user.repository";
import { log } from "console";
import { openNotificationWithIcon } from "../untils/operate/notify";
const initialState = {
  userDetail: null as null | USER_SHOW,
  userLst: [] as USER_DETAIL[],
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.userLst = action.payload?.data;
    });
    // builder.addCase(getRoleDetail.fulfilled, (state, action) => {
    //   state.roleLst = action.payload.data;
    // });
    builder.addCase(createUser.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Tạo người dùng thành công", "");
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Xóa người dùng thành công", "");
    });
    builder.addMatcher(
      isAnyOf(createUser.rejected, getAllUser.rejected, deleteUser.rejected),
      (state, action) => {
        openNotificationWithIcon("error", "Lỗi", "");

        console.log(action);
      }
    );
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
export const getAllUser = createAsyncThunk("user/getAll", async () => {
  // try {
  const response = await userRepository.getAll();
  console.log(response);
  return response.data;
  // } catch (error) {
  //   console.log(error);
  // }
});
export const createUser = createAsyncThunk(
  "user/create",
  async (userDto: USER_DTO, thunkApi) => {
    // try {
    const response = await userRepository.createUser(userDto);
    if (response.status === 200) {
      thunkApi.dispatch(getAllUser());
    } else {
      console.log(response);
    }
    // } catch (error) {
    //   console.log(error);
    // }
    // return response.data;
  }
);
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId: string, thunkApi) => {
    try {
      const response = await userRepository.deleteUser(userId);

      if (response.status === 200) {
        thunkApi.dispatch(getAllUser());
      }
    } catch (error) {
      console.log(error);
    }
    // return response.data;
  }
);
