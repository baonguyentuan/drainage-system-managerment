import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerStatus: "",
  pageTitle: "Sổ đo thủy chuẩn",
  isOpen: false,
};

const drawerSlice = createSlice({
  name: "drawerSlice",
  initialState,
  reducers: {
    showDrawer: (state, action) => {
      state.isOpen = true;
      state.pageTitle = action.payload.pageTitle;
      state.drawerStatus = action.payload.drawerStatus;
    },
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload.pageTitle;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showDrawer, closeDrawer, setPageTitle } = drawerSlice.actions;

export default drawerSlice.reducer;
