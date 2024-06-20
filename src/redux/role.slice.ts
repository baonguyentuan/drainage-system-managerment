import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roleRepository from "../repository/role.repository";
import { ROLE_DETAIL, ROLE_DTO } from "../models/role.model";

const initialState = {
  roleLst: [] as ROLE_DETAIL[],
  currentRole: null as null | ROLE_DETAIL,
};

const roleSlice = createSlice({
  name: "roleSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllRole.fulfilled, (state, action) => {
      state.roleLst = action.payload.data;
    });
    builder.addCase(getRoleDetail.fulfilled, (state, action) => {
      state.roleLst = action.payload.data;
    });
    builder.addCase(createRole.fulfilled, (state, action) => {
      console.log("success");
    });
  },
});

export const {} = roleSlice.actions;

export default roleSlice.reducer;
export const getAllRole = createAsyncThunk("role/getAll", async () => {
  const response = await roleRepository.getAll();
  return response.data;
});
export const getRoleDetail = createAsyncThunk(
  "role/getDetail",
  async (roleId: string) => {
    const response = await roleRepository.getRoleById(roleId);
    return response.data;
  }
);
export const createRole = createAsyncThunk(
  "role/create",
  async (roleDto: ROLE_DTO, thunkApi) => {
    const response = await roleRepository.createRole(roleDto);
    if (response.status === 200) {
      thunkApi.dispatch(getAllRole());
    } else {
      console.log(response);
    }
    // return response.data;
  }
);
export const deleteRole = createAsyncThunk(
  "role/delete",
  async (roleId: string, thunkApi) => {
    const response = await roleRepository.deleteRole(roleId);
    if (response.status === 200) {
      thunkApi.dispatch(getAllRole());
    }
    // return response.data;
  }
);
