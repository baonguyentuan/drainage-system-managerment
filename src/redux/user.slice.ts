import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  USER_ADMIN,
  USER_ADMIN_SHOW,
  USER_DETAIL,
  USER_DTO,
  USER_SHOW,
} from "../models/user.model";
import userRepository from "../repository/user.repository";
import { log } from "console";
import { openNotificationWithIcon } from "../untils/operate/notify";
import { UserOrderOptionDetail } from "../models/order.model";
const initialState = {
  userDetail: null as null | USER_SHOW,
  currentUserAdmin: null as null | USER_ADMIN_SHOW,
  userLst: [] as USER_DETAIL[],
  userOption: {
    role: "all",
    status: 0,
    searchValue: "",
    sort: 1,
    page: 1,
  },
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserOption: (
      state,
      action: PayloadAction<{ option: UserOrderOptionDetail }>
    ) => {
      state.userOption = action.payload.option;
    },
    resetCurrentUserAdmin: (state) => {
      state.currentUserAdmin = null;
    },
    editCurrentUserAdmin: (
      state,
      action: PayloadAction<{ detail: USER_ADMIN_SHOW }>
    ) => {
      state.currentUserAdmin = action.payload.detail;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllUserByOrderApi.fulfilled, (state, action) => {
      state.userLst = action.payload.data;
    });
    builder.addCase(getUserDetail.fulfilled, (state, action) => {
      state.userDetail = action.payload.data;
    });
    builder.addCase(getUserByIdApi.fulfilled, (state, action) => {
      state.currentUserAdmin = action.payload.data;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Tạo người dùng thành công", "");
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Xóa người dùng thành công", "");
    });
    builder.addCase(updateUserAdminApi.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Cập nhật thành công", "");
    });
    builder.addMatcher(
      isAnyOf(
        createUser.rejected,
        getAllUserByOrderApi.rejected,
        deleteUser.rejected,
        updateUserAdminApi.rejected
      ),
      (state, action) => {
        openNotificationWithIcon("error", "Lỗi", "");

        console.log(action);
      }
    );
  },
});

export const { setUserOption, resetCurrentUserAdmin, editCurrentUserAdmin } =
  userSlice.actions;

export default userSlice.reducer;
export const getAllUserByOrderApi = createAsyncThunk(
  "user/getAll",
  async (orderOption: UserOrderOptionDetail) => {
    const response = await userRepository.getAllByOrder(orderOption);
    return response.data;
  }
);
export const createUser = createAsyncThunk(
  "user/create",
  async (userDto: USER_DTO, thunkApi) => {
    const response = await userRepository.createUser(userDto);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        getAllUserByOrderApi({
          role: "all",
          status: 0,
          searchValue: "",
          sort: 1,
          page: 1,
        })
      );
    } else {
      console.log(response);
    }
  }
);
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId: string, thunkApi) => {
    try {
      const response = await userRepository.deleteUser(userId);
      if (response.status === 200) {
        thunkApi.dispatch(
          getAllUserByOrderApi({
            role: "all",
            status: 0,
            searchValue: "",
            sort: 1,
            page: 1,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
);
export const getUserDetail = createAsyncThunk("user/getDetail", async () => {
  const response = await userRepository.getUserDetail();
  return response.data;
});
export const getUserByIdApi = createAsyncThunk(
  "user/getUserById",
  async (userId: string) => {
    const response = await userRepository.getUserById(userId);
    return response.data;
  }
);
export const updateUserAdminApi = createAsyncThunk(
  "user/updateUserAdmin",
  async (userDetail: USER_ADMIN) => {
    const response = await userRepository.updateUserAdmin(userDetail);
    // return response;
  }
);
