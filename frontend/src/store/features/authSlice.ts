import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  status: boolean;
  userData: {
    email: string;
    name: string;
    userId: string;
    emailVerified: boolean;
  } | null;
}

const initialState: AuthState = {
  status: false,
  userData: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState['userData']>) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    updateUserData: (state, action: PayloadAction<Partial<AuthState['userData']>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    }
  }
});

export const { login, logout, updateUserData } = authSlice.actions;

// Selectors
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectUserData = (state: { auth: AuthState }) => state.auth.userData;
export const selectIsEmailVerified = (state: { auth: AuthState }) => state.auth.userData?.emailVerified || false;

export default authSlice.reducer;
