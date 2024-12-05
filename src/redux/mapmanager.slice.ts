import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KmlPlacemarkModel, MapOtionModel } from "../models/ggearthModel";
import { LatLngExpression } from "leaflet";

const initialState = {
  mapOption: {
    mapType: 1,
    mapOpacity: 1,
  } as MapOtionModel,
  position: [0, 0] as LatLngExpression,
  kmlObject: [] as KmlPlacemarkModel[],
  curKmlObject: null as null | KmlPlacemarkModel,
};

const mapmanagerSlice = createSlice({
  name: "mapmanagerSlice",
  initialState,
  reducers: {
    setMapOtion(state, action: PayloadAction<MapOtionModel>) {
      state.mapOption = action.payload;
    },
    setMapPosition(state, action: PayloadAction<LatLngExpression>) {
      state.position = action.payload;
    },
    setKmlObject(state, action: PayloadAction<KmlPlacemarkModel[]>) {
      state.kmlObject = action.payload;
    },
    setCurKmlObject(state, action: PayloadAction<KmlPlacemarkModel>) {
      state.curKmlObject = action.payload;
    },
  },
});

export const { setKmlObject, setMapOtion, setMapPosition, setCurKmlObject } =
  mapmanagerSlice.actions;

export default mapmanagerSlice.reducer;
