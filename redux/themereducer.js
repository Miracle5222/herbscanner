import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "module",
  initialState: {
    backgroundColor: {
      primary: "",
      secondary: "",
      tertiary: "",
    },
    colors: {
      title: "",
      heading: "#7AAD33",
      sub_heading: "",
      paragraph: "",
    },
  },
  reducers: {},
});

export const {} = themeSlice.actions;

export default themeSlice.reducer;
