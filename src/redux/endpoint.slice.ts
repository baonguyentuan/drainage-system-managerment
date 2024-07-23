import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import endpointRepository from "../repository/endpoint.repository";
import { ENDPOINT_DETAIL, ENDPOINT_DTO } from "../models/endpoint.model";
import { OrderOptionDetail } from "../models/order.model";
import { openNotificationWithIcon } from "../untils/operate/notify";

const initialState = {
  endpointLst: [] as ENDPOINT_DETAIL[],
  currentEndpoint: null as null | ENDPOINT_DETAIL,
  endPointOption: {
    page: 1,
    sort: 1,
    value: "all",
  } as OrderOptionDetail,
};

const endpointSlice = createSlice({
  name: "endpointSlice",
  initialState,
  reducers: {
    setEndpoitOption: (
      state,
      action: PayloadAction<{ option: OrderOptionDetail }>
    ) => {
      state.endPointOption = action.payload.option;
    },
    editEndpointDetail: (
      state,
      action: PayloadAction<{ endpointDetail: ENDPOINT_DETAIL | null }>
    ) => {
      state.currentEndpoint = action.payload.endpointDetail;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllEndpointByOrderApi.fulfilled, (state, action) => {
      state.endpointLst = action.payload.data;
    });
    builder.addCase(createEndpointApi.fulfilled, () => {
      openNotificationWithIcon("success", "Tạo endpoint thành công", "");
    });
    builder.addCase(getEndpointDetailApi.fulfilled, (state, action) => {
      state.currentEndpoint = action.payload.data;
    });
    builder.addCase(deleteEndpointApi.fulfilled, () => {
      openNotificationWithIcon("success", "Xóa endpoint thành công", "");
    });
    builder.addCase(updateEndpointApi.fulfilled, (state) => {
      state.currentEndpoint = null;
      openNotificationWithIcon("success", "Cập nhật Endpoint thành công", "");
    });
  },
});

export const { setEndpoitOption, editEndpointDetail } = endpointSlice.actions;

export default endpointSlice.reducer;
export const getAllEndpointByOrderApi = createAsyncThunk(
  "endpoint/getAll",
  async (endPointOption: OrderOptionDetail) => {
    const response = await endpointRepository.getAllEndpointByOrder(
      endPointOption
    );
    return response.data;
  }
);
export const getEndpointDetailApi = createAsyncThunk(
  "endpoint/getDetail",
  async (endpointId: string) => {
    const response = await endpointRepository.getEndpointById(endpointId);
    return response.data;
  }
);
export const createEndpointApi = createAsyncThunk(
  "endpoint/create",
  async (endpointDto: ENDPOINT_DTO, thunkApi) => {
    const response = await endpointRepository.createEndpoint(endpointDto);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        setEndpoitOption({
          option: {
            value: "all",
            sort: 1,
            page: 1,
          },
        })
      );
    } else {
      console.log(response);
    }
    // return response.data;
  }
);

export const deleteEndpointApi = createAsyncThunk(
  "endpoint/delete",
  async (endpointId: string, thunkApi) => {
    const response = await endpointRepository.deleteEndpoint(endpointId);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        setEndpoitOption({
          option: {
            value: "all",
            sort: 1,
            page: 1,
          },
        })
      );
    }
    // return response.data;
  }
);
export const updateEndpointApi = createAsyncThunk(
  "endpoint/update",
  async (endpointDetail: ENDPOINT_DETAIL, thunkApi) => {
    const response = await endpointRepository.updateEndpoint(
      endpointDetail._id,
      {
        path: endpointDetail.path,
        description: endpointDetail.description,
        group: endpointDetail.group,
        method: endpointDetail.method,
      }
    );
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        getAllEndpointByOrderApi({
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
