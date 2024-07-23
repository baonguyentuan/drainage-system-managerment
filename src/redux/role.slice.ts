import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import roleRepository from "../repository/role.repository";
import { ROLE_DETAIL, ROLE_DTO } from "../models/role.model";
import { openNotificationWithIcon } from "../untils/operate/notify";
import { OrderOptionDetail } from "../models/order.model";

const initialState = {
  roleLst: [] as ROLE_DETAIL[],
  currentRole: null as null | ROLE_DETAIL,
  roleOption: {
    page: 1,
    sort: 1,
    value: "",
  } as OrderOptionDetail,
};

const roleSlice = createSlice({
  name: "roleSlice",
  initialState,
  reducers: {
    editRole: (state, action: PayloadAction<{ roleDetail: ROLE_DETAIL }>) => {
      state.currentRole = action.payload.roleDetail;
    },
    resetCurrentRole: (state) => {
      state.currentRole = null;
    },
    setRoleOption: (
      state,
      action: PayloadAction<{ option: OrderOptionDetail }>
    ) => {
      state.roleOption = action.payload.option;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllRoleByOrderApi.fulfilled, (state, action) => {
      state.roleLst = action.payload.data.data;
    });
    builder.addCase(getRoleDetailApi.fulfilled, (state, action) => {
      state.currentRole = action.payload.data.data;
    });
    builder.addCase(createRoleApi.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Tạo Role thành công", "");
    });
    builder.addCase(updateRoleApi.fulfilled, (state, action) => {
      state.currentRole = null;
      openNotificationWithIcon("success", "Cập nhật Role thành công", "");
    });
    builder.addCase(deleteRoleApi.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Xóa Role thành công", "");
    });
    builder.addMatcher(isAnyOf(updateRoleApi.rejected), (state, action) => {
      openNotificationWithIcon("error", "Lỗi", "");
    });
  },
});

export const { editRole, resetCurrentRole, setRoleOption } = roleSlice.actions;

export default roleSlice.reducer;
export const getAllRoleByOrderApi = createAsyncThunk(
  "role/get",
  async (orderOption: OrderOptionDetail) => {
    const response = await roleRepository.getAllRoleByOrder(orderOption);
    return response.data;
  }
);
export const getRoleDetailApi = createAsyncThunk(
  "role/getDetail",
  async (roleId: string) => {
    const response = await roleRepository.getRoleById(roleId);
    return response.data;
  }
);
export const createRoleApi = createAsyncThunk(
  "role/create",
  async (roleDto: ROLE_DTO, thunkApi) => {
    const response = await roleRepository.createRole(roleDto);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        getAllRoleByOrderApi({
          value: "",
          sort: 1,
          page: 1,
        })
      );
    } else {
      console.log(response);
    }
    // return response.data;
  }
);
export const deleteRoleApi = createAsyncThunk(
  "role/delete",
  async (roleId: string, thunkApi) => {
    const response = await roleRepository.deleteRole(roleId);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        getAllRoleByOrderApi({
          value: "",
          sort: 1,
          page: 1,
        })
      );
    }
    // return response.data;
  }
);
export const updateRoleApi = createAsyncThunk(
  "role/update",
  async (roleDetail: ROLE_DETAIL, thunkApi) => {
    const response = await roleRepository.updateRole(roleDetail._id, {
      name: roleDetail.name,
      description: roleDetail.description,
      endpointIds: roleDetail.endpointIds,
    });
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        getAllRoleByOrderApi({
          value: "",
          sort: 1,
          page: 1,
        })
      );
    } else {
      console.log(response);
    }
    // return response.data;
  }
);
