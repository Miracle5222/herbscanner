import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const cameraSlice = createSlice({
  name: "camera",
  initialState: {
    herbImage: "",
  },
  reducers: {
    camerahandler(state, action) {
      state.herbImage = action.payload;
    },
  },
});

export const { camerahandler } = cameraSlice.actions;

export default cameraSlice.reducer;
