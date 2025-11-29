import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../utilis/authApi";

// Define a basic user profile structure.
interface UserProfile {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

const PROFILE_KEY = "user_profile";

function saveTokens(access: string, refresh: string) {
  try {
    localStorage.setItem(TOKEN_KEYS.access, access);
    localStorage.setItem(TOKEN_KEYS.refresh, refresh);
  } catch {
    // no-op: storage might be unavailable
  }
}

function loadTokens(): { access: string | null; refresh: string | null } {
  try {
    return {
      access: localStorage.getItem(TOKEN_KEYS.access),
      refresh: localStorage.getItem(TOKEN_KEYS.refresh),
    };
  } catch {
    return { access: null, refresh: null };
  }
}

function loadUserProfile(): UserProfile | null {
  try {
    const profileData = localStorage.getItem(PROFILE_KEY);
    return profileData ? JSON.parse(profileData) : null;
  } catch {
    return null;
  }
}

const TOKEN_KEYS = {
  access: "auth_access",
  refresh: "auth_refresh",
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  profileStatus: "idle" | "loading" | "succeeded" | "failed";
  profileError: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userProfile: null,
  status: "idle",
  error: null,
  profileStatus: "idle",
  profileError: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await loginApi(email, password);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Login failed");
      }
      return rejectWithValue("Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateFromStorage(state) {
      const { access, refresh } = loadTokens();
      const profile = loadUserProfile();

      console.log("Hydrating from storage:", {
        access: !!access,
        profile: !!profile,
      });

      state.accessToken = access;
      state.refreshToken = refresh;

      if (profile) {
        state.userProfile = profile;
        state.profileStatus = "succeeded";
      } else if (access) {
        // Have token but no profile - will trigger fetch
        state.profileStatus = "idle";
      }
    },
    clearError(state) {
      state.error = null;
    },
    clearProfileError(state) {
      state.profileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.access_token;
        state.refreshToken = null; // API does not provide a refresh token
        saveTokens(action.payload.access_token, ""); // Storing empty string for refresh token
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Login failed";
      });
  },
});
export const { hydrateFromStorage, clearError, clearProfileError } =
  authSlice.actions;
export default authSlice.reducer;
