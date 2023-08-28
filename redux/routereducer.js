import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    rootRoute: "https://0d42-110-54-202-55.ngrok-free.app/",
  },
  reducers: {
    routeRouter(state, action) {
      state.rootRoute = action.payload;
    },
  },
});

export const { routeRouter } = routeSlice.actions;

export default routeSlice.reducer;
