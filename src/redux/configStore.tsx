import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "./bookSlice";

export const store=configureStore({
    reducer:{
        bookSlice
    }
})
export type RootState = ReturnType<typeof store.getState>