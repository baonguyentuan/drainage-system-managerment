import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import endpointRepository from "../repository/endpoint.repository";
import { ENDPOINT_DETAIL, ENDPOINT_DTO } from "../models/endpoint.model";

const initialState = {
  endpointLst: [] as ENDPOINT_DETAIL[],
  currentEndpoint: null as null | ENDPOINT_DETAIL,
};

const endpointSlice = createSlice({
  name: "endpointSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllEndpoint.fulfilled, (state, action) => {
      state.endpointLst = action.payload.data;
    });
    builder.addCase(createEndpoint.fulfilled, (state, action) => {
      console.log("success create");
    });
    builder.addCase(deleteEndpoint.fulfilled, (state, action) => {
      console.log("success delete");
    });
  },
});

export const {} = endpointSlice.actions;

export default endpointSlice.reducer;
export const getAllEndpoint = createAsyncThunk("endpoint/getAll", async () => {
  const response = await endpointRepository.getAll();
  return response.data;
});
export const getEndpointDetail = createAsyncThunk(
  "endpoint/getDetail",
  async (endpointId: string) => {
    const response = await endpointRepository.getEndpointById(endpointId);
    return response.data;
  }
);
export const createEndpoint = createAsyncThunk(
  "endpoint/create",
  async (endpointDto: ENDPOINT_DTO, thunkApi) => {
    const response = await endpointRepository.createEndpoint(endpointDto);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(getAllEndpoint());
    } else {
      console.log(response);
    }
    // return response.data;
  }
);
export const deleteEndpoint = createAsyncThunk(
  "endpoint/delete",
  async (endpointId: string, thunkApi) => {
    const response = await endpointRepository.deleteEndpoint(endpointId);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(getAllEndpoint());
    }
    // return response.data;
  }
);
