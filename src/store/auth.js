import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  /** Self = self-service, Admin = admin console */
  account_toggle_button: "Admin",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToggleButton(state, action) {
      const next = action.payload;
      if (next === "Self" || next === "Admin") {
        state.account_toggle_button = next;
      }
    },
    setLogOut(state) {
      state.account_toggle_button = "Admin";
      Cookies.remove("token");
      Cookies.remove("tenant");
      Cookies.remove("selected_site");
    },
  },
});

export const { setLogOut, updateToggleButton } = authSlice.actions;
export default authSlice.reducer;
