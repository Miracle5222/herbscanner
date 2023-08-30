import { configureStore } from "@reduxjs/toolkit";

import themereducer from "./themereducer";
import camerareducer from "./camerareducer";
import routeRouter from "./routereducer";
import herbdatareducer from "./herbdatareducer";
export const store = configureStore({
  reducer: {
    theme: themereducer,
    camera: camerareducer,
    mainRoute: routeRouter,
    herbData: herbdatareducer,
  },
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware({
  //       immutableCheck: { warnAfter: 128 },
  //       serializableCheck: { warnAfter: 128 },
  //     }),
});
