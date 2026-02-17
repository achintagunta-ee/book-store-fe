import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  loginThunk,
  registerThunk,
  clearError,
  forgotPasswordThunk,
  resetPasswordThunk,
  getCurrentUserThunk,
} from "../redux/slice/authSlice";

import { toast, Toaster } from "react-hot-toast";

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "otp">(
    "email"
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    forgot_email: "",
    otp: "",
    new_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error, accessToken, userProfile, profileStatus } = useSelector(
    (s: RootState) => s.auth
  );

  useEffect(() => {
    // Clear errors when switching between login/register or on initial load
    dispatch(clearError());
    if (!isForgotPassword) {
      // Reset forgot password state when modal is closed
      setForgotPasswordStep("email");
    }
  }, [isRegistering, isForgotPassword, dispatch]);

  useEffect(() => {
    if (accessToken) {
      if (userProfile) {
        if (userProfile.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else if (profileStatus === "idle") {
        dispatch(getCurrentUserThunk());
      }
    }
  }, [accessToken, userProfile, profileStatus, navigate, dispatch]);

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setValidationErrors({});
      if (isRegistering) {
        const password = formData.password;
        if (password.length < 8) {
          setValidationErrors({ password: "Password must be at least 8 characters long." });
          return;
        }
        if (!/[A-Z]/.test(password)) {
          setValidationErrors({ password: "Password must contain at least one uppercase letter." });
          return;
        }
        if (!/[a-z]/.test(password)) {
          setValidationErrors({ password: "Password must contain at least one lowercase letter." });
          return;
        }
        if (!/[0-9]/.test(password)) {
          setValidationErrors({ password: "Password must contain at least one number." });
          return;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
          setValidationErrors({ password: "Password must contain at least one special character." });
          return;
        }

        if (formData.password !== formData.confirm_password) {
           setValidationErrors({ confirm_password: "Passwords do not match." });
           return;
        }
        await dispatch(registerThunk(formData)).unwrap();
        toast.success("Registration successful!");
        setIsRegistering(false); // Switch back to login form
        setFormData({
          // Reset form fields
          ...formData,
          first_name: "",
          last_name: "",
          username: "",
          password: "",
          confirm_password: "",
        });
      } else if (isForgotPassword) {
        // This case is handled by handleForgotPasswordSubmit
        // but we keep the structure for clarity
        return;
      } else {
        await dispatch(
          loginThunk({ email: formData.email, password: formData.password })
        ).unwrap();
        // Navigation is handled by useEffect
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);
    try {
      if (forgotPasswordStep === "email") {
        await dispatch(forgotPasswordThunk(formData.forgot_email)).unwrap();
        // toast.success("An OTP has been sent to your email.");
        setForgotPasswordStep("otp");
      } else {
      if (formData.otp.length !== 6) {
          // You might set a validation error here instead of toast
          //But for now just returning as requested to remove toast
          setIsForgotPasswordLoading(false);
          return;
        }
        await dispatch(
          resetPasswordThunk({
            email: formData.forgot_email,
            code: formData.otp,
            new_password: formData.new_password,
          })
        ).unwrap();
        // toast.success("Password has been reset successfully!");
        setIsForgotPassword(false);
        setForgotPasswordStep("email"); // Reset for next time
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 font-body  lg:p-8">
      <Toaster position="top-center" />
      <div className="flex w-full max-w-5xl flex-col shadow-soft md:flex-row">
        {/* Left Panel: Image */}
        <div className="w-full md:w-1/2">
          <div className="relative h-64 w-full overflow-hidden rounded-t-xl md:h-full md:rounded-l-xl md:rounded-r-none">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkHcX7R9fkixx2VV-yCqM4vB8eVO94dwnos7SBNkfd58xu_TX1IGfnXjec1A9R2481NMJS04uunoftPymo4gmlHUOudZyORCxec1NymswQEB0-sqH7PlspBYW-HR_CUfOXI8APtC4Zfmi8SKIazcAPADjWLfCZKKf-R4QnkUHsSAN7x3dABBw7H0BVR7A1Qbqe9tFnPU2S2pBpZerFsHp9ME_HvIxAKC6OltEI2FzNgnWTcW9Fd4y5H63Tutc8aH9U3qqzvGdFB1U")',
              }}
            ></div>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>
        {/* Right Panel: Form */}
        <div className="flex w-full flex-col justify-center rounded-b-xl border-t-4 border-card-border bg-background-light p-8  md:w-1/2 md:rounded-l-none md:rounded-r-xl md:border-l-4 md:border-t-0 lg:p-12">
          <div className="mb-8 text-center">
            <h2 className="font-display text-4xl font-bold text-text-main">
              Hithabodha
            </h2>
            <p className="mt-1 text-secondary-link">
              Your journey through stories begins here.
            </p>
          </div>
          <div className="mb-4 flex flex-wrap justify-center gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-2 text-center">
              <p className="font-display text-3xl font-bold leading-tight tracking-tight text-text-main">
                {isRegistering ? "Create an Account" : "Welcome Back"}
              </p>
              <p className="text-base font-normal leading-normal text-secondary-link">
                {isRegistering
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <a
                  className="font-semibold text-primary hover:underline"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(!isRegistering);
                    setIsForgotPassword(false);
                  }}
                >
                  {isRegistering ? "Login" : "Sign Up"}
                </a>
              </p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <div className="flex flex-col">
                  <label
                    className="pb-2 text-sm font-semibold text-text-main"
                    htmlFor="first_name"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="h-12 rounded-lg border border-black/10 p-4"
                    id="first_name"
                    name="first_name"
                    placeholder="John"
                    type="text"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    required
                  />
                  {validationErrors.first_name && (
                    <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.first_name}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    className="pb-2 text-sm font-semibold text-text-main"
                    htmlFor="last_name"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="h-12 rounded-lg border border-black/10 p-4"
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    type="text"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    required
                  />
                  {validationErrors.last_name && (
                    <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.last_name}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    className="pb-2 text-sm font-semibold text-text-main"
                    htmlFor="username"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="h-12 rounded-lg border border-black/10 p-4"
                    id="username"
                    name="username"
                    placeholder="johndoe"
                    type="text"
                    value={formData.username}
                    onChange={handleFormChange}
                    required
                  />
                   {validationErrors.username && (
                    <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.username}</p>
                  )}
                </div>
              </>
            )}
            <div className="flex flex-col">
              <label
                className="pb-2 text-sm font-semibold leading-normal text-text-main"
                htmlFor="email"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                className="h-12 min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-black/10 bg-white p-4 text-base font-normal leading-normal text-text-main placeholder:text-secondary-link/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
              {validationErrors.email && (
                <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                className="pb-2 text-sm font-semibold leading-normal text-text-main"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className="h-12 w-full min-w-0 resize-none overflow-hidden rounded-lg border border-black/10 bg-white/50 p-4 pr-10 text-base font-normal leading-normal text-text-main placeholder:text-secondary-link/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
               {validationErrors.password && (
                <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.password}</p>
              )}
            </div>
            {isRegistering && (
              <div className="flex flex-col">
                <label
                  className="pb-2 text-sm font-semibold text-text-main"
                  htmlFor="confirm_password"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    className="h-12 w-full rounded-lg border border-black/10 p-4 pr-10"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirm_password}
                    onChange={handleFormChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                 {validationErrors.confirm_password && (
                    <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.confirm_password}</p>
                  )}
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {(() => {
                        try {
                          // Try to parse if it's a JSON string like {"detail": "..."}
                          if (error.startsWith("{")) {
                             const parsed = JSON.parse(error);
                             return parsed.detail || parsed.message || error;
                          }
                          return error;
                        } catch (e) {
                          return error;
                        }
                      })()}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            {!isRegistering && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                  />
                  <label
                    className="ml-2 block text-sm text-secondary-link"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  className="text-sm font-semibold text-secondary-link hover:text-primary"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsForgotPassword(true);
                    setForgotPasswordStep("email");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-wide text-white shadow-soft transition-all duration-300 hover:scale-105 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50"
              >
                <span className="truncate">
                  {status === "loading"
                    ? isRegistering
                      ? "Registering..."
                      : "Logging in..."
                    : isRegistering
                    ? "Register"
                    : "Login"}
                </span>
              </button>
            </div>
          </form>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background-light px-2 text-secondary-link ">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/10 py-2.5 px-4 text-sm font-semibold text-text-main shadow-sm transition-colors hover:bg-black/5"
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10c0-5.523-4.477-10-10-10z"
                    fillRule="evenodd"
                  ></path>
                </svg>
                <span>Facebook</span>
              </a>
              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/10 py-2.5 px-4 text-sm font-semibold text-text-main shadow-sm transition-colors hover:bg-black/5"
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.107 4.107 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {isForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-text-main">
              Forgot Password
            </h3>
            <p className="mb-6 text-secondary-link">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <form onSubmit={handleForgotPasswordSubmit}>
              {forgotPasswordStep === "email" ? (
                <div className="flex flex-col">
                  <label
                    className="pb-2 text-sm font-semibold leading-normal text-text-main"
                    htmlFor="forgot_email"
                  >
                    Email Address
                  </label>
                  <input
                    className="h-12 min-w-0 flex-1 rounded-lg border border-black/10 p-4"
                    id="forgot_email"
                    name="forgot_email"
                    placeholder="you@example.com"
                    type="email"
                    value={formData.forgot_email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label
                      className="pb-2 text-sm font-semibold text-text-main"
                      htmlFor="otp"
                    >
                      OTP Code
                    </label>
                    <input
                      className="h-12 rounded-lg border border-black/10 p-4"
                      id="otp"
                      name="otp"
                      placeholder="Enter the 6-digit code"
                      type="text"
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleFormChange}
                      required
                    />
                     {validationErrors.otp && (
                      <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.otp}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="pb-2 text-sm font-semibold text-text-main"
                      htmlFor="new_password"
                    >
                      New Password
                    </label>
                    <input
                      className="h-12 rounded-lg border border-black/10 p-4"
                      id="new_password"
                      name="new_password"
                      placeholder="Enter your new password"
                      type="password"
                      value={formData.new_password}
                      onChange={handleFormChange}
                      required
                    />
                     {validationErrors.new_password && (
                      <p className="text-sm font-medium text-red-500 mt-1">{validationErrors.new_password}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-secondary-link hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isForgotPasswordLoading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isForgotPasswordLoading
                    ? forgotPasswordStep === "email"
                      ? "Sending..."
                      : "Resetting..."
                    : forgotPasswordStep === "email"
                    ? "Send OTP"
                    : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
