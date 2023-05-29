import { configureStore } from "@reduxjs/toolkit";

import subaccountSlice from "./subaccountSlice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [subaccountSlice.name]: subaccountSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
