import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import type { AppDispatch } from "../redux/store/store";
import { resetPasswordThunk } from "../redux/slice/authSlice";

const ResetPasswordPage: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!password || !confirmPassword || !email) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        // Password validation
         if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
          }
          if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter.");
            return;
          }
          if (!/[a-z]/.test(password)) {
            setError("Password must contain at least one lowercase letter.");
            return;
          }
          if (!/[0-9]/.test(password)) {
            setError("Password must contain at least one number.");
             return;
          }
          if (!/[^A-Za-z0-9]/.test(password)) {
            setError("Password must contain at least one special character.");
             return;
          }

        setIsLoading(true);
        try {
            if (!code) {
                setError("Invalid reset link");
                return;
            }

            await dispatch(resetPasswordThunk({
                email,
                code,
                new_password: password
            })).unwrap();

            toast.success("Password reset successful!");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
             let errorMessage = err;
             if (err instanceof Error) errorMessage = err.message;
             
             if (typeof errorMessage === "string") {
                 try {
                     if (errorMessage.startsWith("{")) {
                         const parsed = JSON.parse(errorMessage);
                         errorMessage = parsed.detail || parsed.message || errorMessage;
                     }
                 } catch (e) {
                     // If parsing fails, use original message
                 }
             }
             
             setError(errorMessage || "Failed to reset password");
             // toast removed per request
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 font-body lg:p-8">
             <Toaster position="top-center" />
             <div className="flex w-full max-w-md flex-col justify-center rounded-xl border border-card-border bg-white p-8 shadow-soft">
                <div className="mb-8 text-center">
                    <h2 className="font-display text-3xl font-bold text-text-main">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-secondary-link">
                        Enter your email and new password to continue.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="pb-2 text-sm font-semibold text-text-main" htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="h-12 rounded-lg border border-black/10 p-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="pb-2 text-sm font-semibold text-text-main" htmlFor="password">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                className="h-12 w-full rounded-lg border border-black/10 p-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09"/>
                                        <line x1="2" y1="2" x2="22" y2="22"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="pb-2 text-sm font-semibold text-text-main" htmlFor="confirmPassword">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                className="h-12 w-full rounded-lg border border-black/10 p-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09"/>
                                        <line x1="2" y1="2" x2="22" y2="22"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                         <div className="rounded-md bg-red-50 p-4 border border-red-200">
                           <p className="text-sm font-medium text-red-800">{error}</p>
                         </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-soft"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    
                     <div className="text-center mt-4">
                        <a href="/login" className="text-sm font-semibold text-primary hover:underline">
                            Back to Login
                        </a>
                    </div>
                </form>
             </div>
        </div>
    );
};

export default ResetPasswordPage;
