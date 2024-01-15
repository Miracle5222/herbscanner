import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "herbdata",
  initialState: {
    userName: "mario",
    userPass: "test",
    userId: "127",
  },
  reducers: {
    userNameHandler(state, action) {
      state.userName = action.payload;
    },
    userPassHandler(state, action) {
      state.userPass = action.payload;
    },
    userIdHandler(state, action) {
      state.userId = action.payload;
    },
  },
});

export const { userNameHandler, userPassHandler, userIdHandler } =
  userSlice.actions;

export default userSlice.reducer;
