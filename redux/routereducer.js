import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    // rootRoute: "https://herbscanner.onrender.com/",
    rootRoute: "https://1e4a-64-226-56-80.ngrok-free.app/",
  },
  reducers: {
    routeRouter(state, action) {
      state.rootRoute = action.payload;
    },
  },
});

export const { routeRouter } = routeSlice.actions;

export default routeSlice.reducer;
