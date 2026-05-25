// _____for usermanagment_____
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: null,
  members: null,
  user_details:null
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.user_details = action.payload;
    },
    addUser(state, action) {
      state.users = action.payload;
    },
    addNewUser(state, action) {
      state.users = [...state.users, action.payload];
    },
    editUser(state, action) {
      state.users = state.users.map((data) =>
        data.id === action.payload.id ? action.payload : data
      );
    },
    deleteUser(state, action) {
      state.users = state.users.filter((data) => data.id !== action.payload);
    },
    addMember(state, action) {
      state.members = action.payload;
    },
    addNewMember(state, action) {
      state.members = [...state.members, action.payload];
    },
    editMember(state, action) {
      state.members = state.members.map((data) =>
        data.id === action.payload.id ? action.payload : data
      );
    },
    deleteMember(state, action) {
      state.members = state.members.filter(
        (data) => data.id !== action.payload
      );
    },
  },
});

export const {
  setUserDetails,
  addUser,
  addNewUser,
  editUser,
  deleteUser,
  addMember,
  addNewMember,
  editMember,
  deleteMember,
} = UserSlice.actions;
export default UserSlice.reducer;
