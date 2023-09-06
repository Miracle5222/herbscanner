import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "module",
  initialState: {
    backgroundColor: {
      primary: "#AAE057",
      secondary: "#D1556C",
      tertiary: "#316805",
    },
    colors: {
      title: "#AAE057",
      heading: "#7AAD33",
      sub_heading: "#212121",
      paragraph: "",
    },
  },
  reducers: {},
});

export const {} = themeSlice.actions;

export default themeSlice.reducer;
