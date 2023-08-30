import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const herbDataSlice = createSlice({
  name: "herbdata",
  initialState: {
    herbdata: [],
    match: "",
    herbsUses: "",
    image: "",
  },
  reducers: {
    herbDataHandler(state, action) {
      state.herbdata = action.payload;
    },
    herbBestMatchHandler(state, action) {
      state.match = action.payload;
    },
    herbUsesHandler(state, action) {
      state.herbsUses = action.payload;
    },
    herbImageHandler(state, action) {
      state.image = action.payload;
    },
  },
});

export const {
  herbBestMatchHandler,
  herbDataHandler,
  herbImageHandler,
  herbUsesHandler,
} = herbDataSlice.actions;

export default herbDataSlice.reducer;
