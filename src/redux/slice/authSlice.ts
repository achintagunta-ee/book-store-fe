import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUserApi,
  updateUserProfileApi,
  forgotPasswordApi,
  resetPasswordApi,
  type RegisterData,
  type UserProfile,
} from "../utilis/authApi";

const PROFILE_KEY = "user_profile";

function saveTokens(access: string, refresh: string) {
  try {
    localStorage.setItem(TOKEN_KEYS.access, access);
    localStorage.setItem(TOKEN_KEYS.refresh, refresh);
  } catch {
    // no-op: storage might be unavailable
  }
}

function clearTokensAndProfile() {
  try {
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
    localStorage.removeItem(PROFILE_KEY);
  } catch {}
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

function saveUserProfile(profile: UserProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
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

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      const data = await registerApi(registerData);
      // Registration is successful, but we don't log the user in automatically.
      // The response can be used to show a success message.
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Registration failed");
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUserApi();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch user");
      }
      return rejectWithValue("Failed to fetch user");
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: FormData, { rejectWithValue }) => {
    try {
      const data = await updateUserProfileApi(profileData);
      return data.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update profile");
      }
      return rejectWithValue("Failed to update profile");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      // We can call the backend logout, but the main logic is clearing client-side data.
      await logoutApi();
    } catch (error: unknown) {
      // Even if the API call fails, we should still log the user out on the client.
      console.error(
        "Logout API call failed, but logging out client-side.",
        error
      );
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await forgotPasswordApi(email);
      return data; // Return the full response { message, reset_code, expires_in }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to send reset link");
      }
      return rejectWithValue("Failed to send reset link");
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      email,
      code,
      new_password,
    }: {
      email: string;
      code: string;
      new_password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await resetPasswordApi(email, code, new_password);
      return data.message;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to reset password");
      }
      return rejectWithValue("Failed to reset password");
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
    logout(state) {
      clearTokensAndProfile();
      state.accessToken = null;
      state.refreshToken = null;
      state.userProfile = null;
      state.status = "idle";
      state.profileStatus = "idle";
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
        state.profileStatus = "idle"; // Set to idle to trigger profile fetch
        saveTokens(action.payload.access_token, ""); // Storing empty string for refresh token
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Login failed";
      })
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.status = "succeeded"; // Or 'idle' if you prefer, as it's just a success message
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Registration failed";
      })
      // Get Current User
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.profileStatus = "loading";
        state.profileError = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.userProfile = action.payload;
        saveUserProfile(action.payload);
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError =
          (action.payload as string) || "Failed to fetch profile";
        // If fetching profile fails, we should log the user out as the token is likely invalid.
        clearTokensAndProfile();
        state.accessToken = null;
        state.refreshToken = null;
      })
      // Update User Profile
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        saveUserProfile(action.payload);
      })
      // We don't need to handle pending/fulfilled/rejected for forgot/reset password
      // in the main slice state, as this is typically handled with local component
      // state and toasts for user feedback. Adding them here could cause
      // unintended side effects on the global 'status' and 'error' fields.
      // .addCase(forgotPasswordThunk.fulfilled, (state, action) => { ... })
      // .addCase(resetPasswordThunk.fulfilled, (state, action) => { ... })

      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        clearTokensAndProfile();
        state.accessToken = null;
        state.refreshToken = null;
        state.userProfile = null;
        state.status = "idle";
        state.profileStatus = "idle";
      });
  },
});
export const { hydrateFromStorage, clearError, clearProfileError, logout } =
  authSlice.actions;
export default authSlice.reducer;
