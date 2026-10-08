import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
  isClaimed?: "none" | "pending" | "approved";
  isSubscribed?: boolean;
  isProfileCompleted?: boolean;
  venue?: any;
  [key: string]: any;
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
      const rawUser = action.payload.user;
      const claimedVal = rawUser?.isClaimed !== undefined 
        ? rawUser.isClaimed 
        : (rawUser as any)?.isClamied !== undefined 
        ? (rawUser as any).isClamied 
        : undefined;

      const subscribedVal = rawUser?.isSubscribed !== undefined
        ? Boolean(rawUser.isSubscribed)
        : Boolean(rawUser?.subscriptionPlan && rawUser.subscriptionPlan !== "none" && rawUser.subscriptionPlan !== "null");

      const normalizedUser: User = {
        ...rawUser,
        isClaimed: claimedVal,
        isSubscribed: subscribedVal,
      };

      state.accessToken = action.payload.token;
      state.user = normalizedUser;
      state.isRehydrated = true;

      // Persist locally
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-token", action.payload.token);
        localStorage.setItem("auth-user", JSON.stringify(normalizedUser));
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
      const incoming = action.payload;
      const claimedVal = incoming.isClaimed !== undefined 
        ? incoming.isClaimed 
        : (incoming as any)?.isClamied !== undefined 
        ? (incoming as any).isClamied 
        : state.user?.isClaimed;

      const subscribedVal = incoming.isSubscribed !== undefined
        ? Boolean(incoming.isSubscribed)
        : incoming.subscriptionPlan && incoming.subscriptionPlan !== "none" && incoming.subscriptionPlan !== "null"
        ? true
        : state.user?.isSubscribed;

      if (state.user) {
        state.user = { 
          ...state.user, 
          ...incoming,
          isClaimed: claimedVal,
          isSubscribed: subscribedVal,
        };
      } else {
        state.user = {
          ...incoming,
          isClaimed: claimedVal,
          isSubscribed: subscribedVal,
        } as User;
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setAuth, logout, rehydrate, updateUser } = authSlice.actions;
export default authSlice.reducer;
