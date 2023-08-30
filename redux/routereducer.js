import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    rootRoute: "https://b7af-110-54-168-159.ngrok-free.app/",
  },
  reducers: {
    routeRouter(state, action) {
      state.rootRoute = action.payload;
    },
  },
});

export const { routeRouter } = routeSlice.actions;

export default routeSlice.reducer;
