import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  MeasurementBookModel,
  MeasurementDtoModel,
} from "../models/measurement.model";
import { OrderOptionDetail } from "../models/order.model";
import measurementRepository from "../repository/measurement.repository";
import { openNotificationWithIcon } from "../untils/operate/notify";

const initialState = {
  measurmentBook: null as null | MeasurementBookModel,
  measurementLst: [] as MeasurementBookModel[],
  measurementOption: {
    page: 1,
    sort: 1,
    value: "",
  } as OrderOptionDetail,
};

const measurementBookSlice = createSlice({
  name: "measurementBookSlice",
  initialState,
  reducers: {
    setMeasurementBook: (
      state,
      action: PayloadAction<{ book: MeasurementBookModel }>
    ) => {
      state.measurmentBook = action.payload.book;
      localStorage.setItem("measurebook", JSON.stringify(state.measurmentBook));
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllMeasurementByOrderApi.fulfilled, (state, action) => {
      state.measurementLst = action.payload.data;
    });
    builder.addCase(createMeasurementApi.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Tạo sổ đo thành công", "");
    });
    builder.addCase(getMeasurementDetailApi.fulfilled, (state, action) => {
      console.log(action);

      state.measurmentBook = action.payload.data;
    });
    builder.addMatcher(
      isAnyOf(getAllMeasurementByOrderApi.rejected),
      (state, action) => {
        openNotificationWithIcon("error", "Lỗi", "");
      }
    );
  },
});

export const { setMeasurementBook } = measurementBookSlice.actions;

export default measurementBookSlice.reducer;
export const getAllMeasurementByOrderApi = createAsyncThunk(
  "measurement/get",
  async (orderOption: OrderOptionDetail) => {
    const response = await measurementRepository.getMeasurementByOrder(
      orderOption
    );
    return response.data;
  }
);
export const createMeasurementApi = createAsyncThunk(
  "measurement/create",
  async (measurementDto: MeasurementDtoModel, thunkApi) => {
    const response = await measurementRepository.createMeasurement(
      measurementDto
    );
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        getAllMeasurementByOrderApi({
          page: 1,
          sort: 1,
          value: "",
        })
      );
    }
  }
);
export const getMeasurementDetailApi = createAsyncThunk(
  "measurement/detail",
  async (measurementId: string) => {
    const response = await measurementRepository.getMeasurementById(
      measurementId
    );
    console.log(response);

    return response.data;
  }
);
