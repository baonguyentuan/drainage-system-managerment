import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "./bookSlice";
import drawerSlice from "./drawerSlice";

export const store = configureStore({
    reducer: {
        bookSlice,
        drawerSlice
    }
})
export type RootState = ReturnType<typeof store.getState>