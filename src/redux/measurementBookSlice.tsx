import { createSlice } from "@reduxjs/toolkit";
import { MeasurementStationInfoModel } from "../models/bookModels";

const initialState = {
  structureName: "",
  measurmentBook: [] as MeasurementStationInfoModel[],
};

const measurementBookSlice = createSlice({
  name: "measurementBookSlice",
  initialState,
  reducers: {
    setStructureName: (state, action) => {
      state.structureName = action.payload.structureName;
    },
    setLstBookItem: (state, action) => {
      state.measurmentBook = action.payload.measurmentBook;
      localStorage.setItem("measurebook", JSON.stringify(state.measurmentBook));
    },
  },
});

export const { setLstBookItem, setStructureName } =
  measurementBookSlice.actions;

export default measurementBookSlice.reducer;
