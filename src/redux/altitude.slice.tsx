import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AltitudeBookModel,
  AltitudeDtoModel,
  AltitudeOrientationDtoModel,
} from "../models/altitude.models";
import { OrderOptionDetail } from "../models/order.model";
import altitudeRepository from "../repository/altitude.repository";

const initialState = {
  altitudeBook: null as null | AltitudeBookModel,
  altitudeLst: [] as AltitudeBookModel[],
  altitudeOption: {
    page: 1,
    sort: 1,
    value: "",
  } as OrderOptionDetail,
};

const bookSlice = createSlice({
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
  },
});

export const { setAltitudeBook, editAltitudeOption } = bookSlice.actions;

export default bookSlice.reducer;
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
  async (measurementId: string) => {
    const response = await altitudeRepository.getAltitudeById(measurementId);
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
      orientDto: AltitudeOrientationDtoModel;
    },
    thunkApi
  ) => {
    const response = await altitudeRepository.createOrientation(
      altitude.altitudeId,
      altitude.orientDto
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
