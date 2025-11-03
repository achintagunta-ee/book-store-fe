import React from "react";

const LoginPage: React.FC = () => {
	// A simple state for a dark mode toggle could be added here.

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 font-body  lg:p-8">
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
						<h2 className="font-display text-4xl font-bold text-text-main dark:text-text-main-dark">
							Hithabodha
						</h2>
						<p className="mt-1 text-secondary-link">
							Your journey through stories begins here.
						</p>
					</div>
					<div className="mb-4 flex flex-wrap justify-center gap-3 p-4">
						<div className="flex min-w-72 flex-col gap-2 text-center">
							<p className="font-display text-3xl font-bold leading-tight tracking-tight text-text-main dark:text-text-main-dark">
								Welcome Back
							</p>
							<p className="text-base font-normal leading-normal text-secondary-link">
								Don't have an account?{" "}
								<a
									className="font-semibold text-primary hover:underline"
									href="#"
								>
									Sign Up
								</a>
							</p>
						</div>
					</div>
					<form className="space-y-6">
						<div className="flex flex-col">
							<label
								className="pb-2 text-sm font-semibold leading-normal text-text-main dark:text-text-main-dark"
								htmlFor="email"
							>
								Email Address
							</label>
							<input
								className="h-12 min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-black/10 bg-white p-4 text-base font-normal leading-normal text-text-main placeholder:text-secondary-link/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
								id="email"
								placeholder="you@example.com"
								type="email"
							/>
						</div>
						<div className="flex flex-col">
							<label
								className="pb-2 text-sm font-semibold leading-normal text-text-main dark:text-text-main-dark"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className="h-12 min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-black/10 bg-white/50 p-4 text-base font-normal leading-normal text-text-main placeholder:text-secondary-link/80 focus:outline-none focus:ring-2 focus:ring-primary/50 "
								id="password"
								placeholder="Enter your password"
								type="password"
							/>
						</div>
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
							>
								Forgot Password?
							</a>
						</div>
						<div>
							<button className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-wide text-white shadow-soft transition-all duration-300 hover:scale-105 hover:bg-opacity-90">
								<span className="truncate">Login</span>
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
								className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/10 py-2.5 px-4 text-sm font-semibold text-text-main shadow-sm transition-colors hover:bg-black/5 dark:border-white/10 dark:text-text-main-dark dark:hover:bg-white/5"
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
								className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/10 py-2.5 px-4 text-sm font-semibold text-text-main shadow-sm transition-colors hover:bg-black/5 dark:border-white/10 dark:text-text-main-dark dark:hover:bg-white/5"
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
		</div>
	);
};

export default LoginPage;
