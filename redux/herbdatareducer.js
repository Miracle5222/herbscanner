import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const herbDataSlice = createSlice({
  name: "herbdata",
  initialState: {
    herbdata: [],
    match: "",
    herbsUses: "",
    image: "",
    savedHerbsData: [],
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
    savedHerbHandler(state, action) {
      state.savedHerbsData = action.payload;
    },
  },
});

export const {
  herbBestMatchHandler,
  savedHerbHandler,
  herbDataHandler,
  herbImageHandler,
  herbUsesHandler,
} = herbDataSlice.actions;

export default herbDataSlice.reducer;
