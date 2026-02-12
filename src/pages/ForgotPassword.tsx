import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import type { AppDispatch } from "../redux/store/store";
import { forgotPasswordThunk } from "../redux/slice/authSlice";

const ForgotPasswordPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!email) {
            setError("Email address is required");
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(forgotPasswordThunk(email)).unwrap();
            setIsSuccess(true);
            toast.success("Reset link sent to your email!");
            // Optional: navigate back to login after delay?
            // setTimeout(() => navigate("/login"), 5000); 
        } catch (err: any) {
             setError(err || "Failed to send reset link");
             toast.error(err || "Failed to send reset link");
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
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-secondary-link">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {!isSuccess ? (
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
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                        
                         <div className="text-center mt-4">
                            <a href="/login" className="text-sm font-semibold text-primary hover:underline">
                                Back to Login
                            </a>
                        </div>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                             <p className="text-green-800 font-medium">
                                 A password reset link has been sent to <strong>{email}</strong>.
                                 Please check your inbox (and spam folder) and click the link to reset your password.
                             </p>
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base hover:bg-opacity-90 transition-all shadow-soft"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
             </div>
        </div>
    );
};

export default ForgotPasswordPage;
