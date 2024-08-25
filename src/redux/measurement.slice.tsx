import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  MeasurementBookModel,
  MeasurementDtoModel,
  MeasurementOrientationDtoModel,
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
    },
    editMeasurementOption: (
      state,
      action: PayloadAction<{ option: OrderOptionDetail }>
    ) => {
      state.measurementOption = action.payload.option;
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
      state.measurmentBook = action.payload.data[0];
    });
    builder.addCase(deleteMeasurementApi.fulfilled, () => {
      openNotificationWithIcon("success", "Xóa sổ đo thành công", "");
    });
    builder.addCase(deleteOrientationMeasurementApi.fulfilled, () => {
      openNotificationWithIcon("success", "Xóa thành công", "");
    });
    builder.addCase(updateNameMeasurementApi.fulfilled, () => {
      openNotificationWithIcon("success", "Đổi tên thành công", "");
    });
    builder.addCase(swapOrientationMeasurementApi.fulfilled, () => {
      openNotificationWithIcon("success", "Sắp xếp thành công", "");
    });
    builder.addCase(updateOrientationMeasurementApi.fulfilled, () => {
      openNotificationWithIcon("success", "Cập nhật thành công", "");
    });
    builder.addMatcher(
      isAnyOf(
        getAllMeasurementByOrderApi.rejected,
        swapOrientationMeasurementApi.rejected
      ),
      (state, action) => {
        openNotificationWithIcon("error", "Lỗi", "");
      }
    );
  },
});

export const { setMeasurementBook, editMeasurementOption } =
  measurementBookSlice.actions;

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
        editMeasurementOption({
          option: { page: 1, sort: 1, value: "" },
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
    return response.data;
  }
);
export const updateNameMeasurementApi = createAsyncThunk(
  "measurement/name",
  async (
    measurement: {
      measurementId: string;
      name: string;
    },
    thunkApi
  ) => {
    const response = await measurementRepository.updateNameMeasurement(
      measurement.measurementId,
      measurement.name
    );
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editMeasurementOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const createOrientationApi = createAsyncThunk(
  "measurement/orientation/create",
  async (
    measurement: {
      measurementId: string;
      orientDto: MeasurementOrientationDtoModel[];
    },
    thunkApi
  ) => {
    const response = await measurementRepository.createOrientation(
      measurement.measurementId,
      measurement.orientDto
    );
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(getMeasurementDetailApi(measurement.measurementId));
    }
  }
);
export const deleteMeasurementApi = createAsyncThunk(
  "measurement/delete",
  async (measurementId: string, thunkApi) => {
    const response = await measurementRepository.deleteMeasurement(
      measurementId
    );
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editMeasurementOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const deleteOrientationMeasurementApi = createAsyncThunk(
  "measurement/orientation/delete",
  async (
    measurement: {
      measurementId: string;
      orientationId: string;
    },
    thunkApi
  ) => {
    const response = await measurementRepository.deleteOrientation(
      measurement.measurementId,
      measurement.orientationId
    );
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editMeasurementOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const swapOrientationMeasurementApi = createAsyncThunk(
  "measurement/swap",
  async (
    measurement: {
      measurementId: string;
      orientationId: string;
      status: boolean;
    },
    thunkApi
  ) => {
    const response = await measurementRepository.swapOrientation(
      measurement.measurementId,
      measurement.orientationId,
      measurement.status
    );
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editMeasurementOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const updateOrientationMeasurementApi = createAsyncThunk(
  "measurement/orientation/update",
  async (
    orient: { orientId: string; orientDto: MeasurementOrientationDtoModel },
    thunkApi
  ) => {
    const response = await measurementRepository.updateOrientation(
      orient.orientId,
      orient.orientDto
    );
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editMeasurementOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
