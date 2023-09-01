import { configureStore } from "@reduxjs/toolkit";

import themereducer from "./themereducer";
import camerareducer from "./camerareducer";
import routeRouter from "./routereducer";
import herbdatareducer from "./herbdatareducer";
import userReducer from "./userReducer";


export const store = configureStore({
  reducer: {
    theme: themereducer,
    camera: camerareducer,
    mainRoute: routeRouter,
    herbData: herbdatareducer,
    user: userReducer,
  },
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware({
  //       immutableCheck: { warnAfter: 128 },
  //       serializableCheck: { warnAfter: 128 },
  //     }),
});
