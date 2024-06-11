import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "./bookSlice";
import drawerSlice from "./drawerSlice";
import measurementBookSlice from "./measurementBookSlice";
import adminSlice from "./adminSlice";

export const store = configureStore({
  reducer: {
    bookSlice,
    measurementBookSlice,
    drawerSlice,
    adminSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
