import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    // rootRoute: "https://herbscanner.onrender.com/",
    rootRoute: "https://7b19-110-54-203-27.ngrok-free.app/",
  },
  reducers: {
    routeRouter(state, action) {
      state.rootRoute = action.payload;
    },
  },
});

export const { routeRouter } = routeSlice.actions;

export default routeSlice.reducer;
