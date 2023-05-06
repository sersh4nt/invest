import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface SubaccountState {
  active: string | null;
}

const initialState: SubaccountState = {
  active: localStorage.getItem("subaccount"),
};

const subaccountSlice = createSlice({
  name: "subaccount",
  initialState,
  reducers: {
    setActiveSubaccount: (state, action) => {
      state.active = action.payload;
      localStorage.setItem("subaccount", action.payload);
    },
  },
});

export const activeSubaccountSelector = (state: RootState) =>
  state.subaccount.active;

export const { setActiveSubaccount } = subaccountSlice.actions;

export default subaccountSlice;
