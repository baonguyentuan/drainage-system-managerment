import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "./bookSlice";
import drawerSlice from "./drawerSlice";
import measurementBookSlice from "./measurementBookSlice";

export const store = configureStore({
  reducer: {
    bookSlice,
    measurementBookSlice,
    drawerSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
