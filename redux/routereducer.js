import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    rootRoute: "https://fd61-64-226-58-94.ngrok-free.app/",
  },
  reducers: {
    routeRouter(state, action) {
      state.rootRoute = action.payload;
    },
  },
});

export const { routeRouter } = routeSlice.actions;

export default routeSlice.reducer;
