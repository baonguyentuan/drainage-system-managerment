import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roleRepository from "../repository/role.repository";
import { ROLE_DETAIL } from "../models/role.model";

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
  },
});

export const {} = roleSlice.actions;

export default roleSlice.reducer;
const getAllRole = createAsyncThunk("role/getAll", async () => {
  const response = await roleRepository.getAll();
  return response.data;
});
const getRoleDetail = createAsyncThunk(
  "role/getDetail",
  async (roleId: string) => {
    const response = await roleRepository.getRoleById(roleId);
    return response.data;
  }
);
