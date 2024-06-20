import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "./bookSlice";
import drawerSlice from "./drawer.slice";
import measurementBookSlice from "./measurementBookSlice";
import adminSlice from "./admin.slice";
import roleSlice from "./role.slice";
import userSlice from "./user.slice";
import authSlice from "./auth.slice";

export const store = configureStore({
  reducer: {
    bookSlice,
    measurementBookSlice,
    drawerSlice,
    adminSlice,
    roleSlice,
    userSlice,
    authSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
