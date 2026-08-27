import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  isClaimed?: "none" | "pending" | "approved";
  isSubscribed?: boolean;
  isProfileCompleted?: boolean;
  // add other user fields as needed
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isRehydrated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isRehydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isRehydrated = true;

      // Persist locally
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-token", action.payload.token);
        localStorage.setItem("auth-user", JSON.stringify(action.payload.user));
        // We set the cookie for proxy.ts to read on the server side
        Cookies.set("auth-token", action.payload.token, { expires: 7, path: '/' }); 
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
        Cookies.remove("auth-token", { path: '/' });
      }
    },
    rehydrate: (state, action: PayloadAction<{ token: string | null; user: User | null }>) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isRehydrated = true;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload as User;
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setAuth, logout, rehydrate, updateUser } = authSlice.actions;
export default authSlice.reducer;
