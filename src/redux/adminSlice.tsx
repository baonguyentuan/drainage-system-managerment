import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuBarStatus: "user" as string,
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    setMenuBarStatus(state, action: PayloadAction<{ status: string }>) {
      state.menuBarStatus = action.payload.status;
    },
  },
});

export const { setMenuBarStatus } = adminSlice.actions;

export default adminSlice.reducer;
