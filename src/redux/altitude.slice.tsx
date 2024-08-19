import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  AltitudeBookModel,
  AltitudeDtoModel,
  AltitudeOrientationDtoModel,
  AltitudePointModel,
} from "../models/altitude.models";
import { OrderOptionDetail } from "../models/order.model";
import altitudeRepository from "../repository/altitude.repository";
import { openNotificationWithIcon } from "../untils/operate/notify";

const initialState = {
  altitudeBook: null as null | AltitudeBookModel,
  altitudeLst: [] as AltitudeBookModel[],
  calculationAltitude: [] as AltitudePointModel[],
  altitudeOption: {
    page: 1,
    sort: 1,
    value: "",
  } as OrderOptionDetail,
};

const altitudeSlice = createSlice({
  name: "altitudeSlice",
  initialState,
  reducers: {
    setAltitudeBook: (
      state,
      action: PayloadAction<{ book: AltitudeBookModel }>
    ) => {
      state.altitudeBook = action.payload.book;
      localStorage.setItem("measurebook", JSON.stringify(state.altitudeBook));
    },
    editAltitudeOption: (
      state,
      action: PayloadAction<{ option: OrderOptionDetail }>
    ) => {
      state.altitudeOption = action.payload.option;
    },
    editCalculationAltitude(
      state,
      action: PayloadAction<{ pointLst: AltitudePointModel[] }>
    ) {
      state.calculationAltitude = action.payload.pointLst;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllAltitudeByOrderApi.fulfilled, (state, action) => {
      state.altitudeLst = action.payload.data;
    });
    builder.addCase(createAltitudeApi.fulfilled, (state, action) => {
      openNotificationWithIcon("success", "Tạo sổ đo thành công", "");
    });

    builder.addCase(getAltitudeDetailApi.fulfilled, (state, action) => {
      state.altitudeBook = action.payload.data[0];
    });
    builder.addCase(deleteAltitudeApi.fulfilled, () => {
      openNotificationWithIcon("success", "Xóa sổ đo thành công", "");
    });
    builder.addCase(deleteOrientationAltitudeApi.fulfilled, () => {
      openNotificationWithIcon("success", "Xóa thành công", "");
    });
    builder.addCase(updateNameAltitudeApi.fulfilled, () => {
      openNotificationWithIcon("success", "Đổi tên thành công", "");
    });
    builder.addCase(swapOrientationAltitudeApi.fulfilled, () => {
      openNotificationWithIcon("success", "Sắp xếp thành công", "");
    });
    builder.addCase(updateOrientationAltitudeApi.fulfilled, () => {
      openNotificationWithIcon("success", "Cập nhật thành công", "");
    });
    builder.addMatcher(
      isAnyOf(getAllAltitudeByOrderApi.rejected),
      (state, action) => {
        openNotificationWithIcon("error", "Lỗi", "");
      }
    );
  },
});

export const { setAltitudeBook, editAltitudeOption, editCalculationAltitude } =
  altitudeSlice.actions;

export default altitudeSlice.reducer;
export const getAllAltitudeByOrderApi = createAsyncThunk(
  "altitude/get",
  async (orderOption: OrderOptionDetail) => {
    const response = await altitudeRepository.getAltitudeByOrder(orderOption);
    return response.data;
  }
);
export const createAltitudeApi = createAsyncThunk(
  "altitude/create",
  async (altitudeDto: AltitudeDtoModel, thunkApi) => {
    const response = await altitudeRepository.createAltitude(altitudeDto);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editAltitudeOption({
          option: { page: 1, sort: 1, value: "" },
        })
      );
    }
  }
);
export const getAltitudeDetailApi = createAsyncThunk(
  "altitude/detail",
  async (altitudeId: string) => {
    const response = await altitudeRepository.getAltitudeById(altitudeId);
    return response.data;
  }
);
export const updateNameAltitudeApi = createAsyncThunk(
  "altitude/name",
  async (
    altitude: {
      altitudeId: string;
      name: string;
    },
    thunkApi
  ) => {
    const response = await altitudeRepository.updateNameAltitude(
      altitude.altitudeId,
      altitude.name
    );
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editAltitudeOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const createOrientationApi = createAsyncThunk(
  "altitude/orientation/create",
  async (
    altitude: {
      altitudeId: string;
      orientDtoLst: AltitudeOrientationDtoModel[];
    },
    thunkApi
  ) => {
    const response = await altitudeRepository.createOrientation(
      altitude.altitudeId,
      altitude.orientDtoLst
    );
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(getAltitudeDetailApi(altitude.altitudeId));
    }
  }
);
export const deleteAltitudeApi = createAsyncThunk(
  "altitude/delete",
  async (altitudeId: string, thunkApi) => {
    const response = await altitudeRepository.deleteAltitude(altitudeId);
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editAltitudeOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const deleteOrientationAltitudeApi = createAsyncThunk(
  "altitude/orientation/delete",
  async (
    altitude: {
      altitudeId: string;
      orientationId: string;
    },
    thunkApi
  ) => {
    const response = await altitudeRepository.deleteOrientation(
      altitude.altitudeId,
      altitude.orientationId
    );
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editAltitudeOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const swapOrientationAltitudeApi = createAsyncThunk(
  "altitude/swap",
  async (
    altitude: {
      altitudeId: string;
      orientationId1: string;
      orientationId2: string;
    },
    thunkApi
  ) => {
    const response = await altitudeRepository.swapOrientation(
      altitude.altitudeId,
      altitude.orientationId1,
      altitude.orientationId2
    );
    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editAltitudeOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
export const updateOrientationAltitudeApi = createAsyncThunk(
  "altitude/orientation/update",
  async (
    orient: { orientId: string; orientDto: AltitudeOrientationDtoModel },
    thunkApi
  ) => {
    const response = await altitudeRepository.updateOrientation(
      orient.orientId,
      orient.orientDto
    );
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      thunkApi.dispatch(
        editAltitudeOption({ option: { page: 1, sort: 1, value: "" } })
      );
    }
  }
);
