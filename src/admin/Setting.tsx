import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

type TabType = "general" | "payment" | "profile";

const AdminSettings: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabType>("general");
	const [siteTitle, setSiteTitle] = useState("Hithabodha Book Store");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [storeAddress, setStoreAddress] = useState(
		"123 Literary Lane, Readingville, BK 54321"
	);
	const [contactEmail, setContactEmail] = useState("contact@hithabodha.com");
	const [adminName, setAdminName] = useState("Admin Name");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handleSaveChanges = () => {
		alert("Changes saved successfully!");
	};

	const handleLogout = () => {
		alert("Logging out...");
	};

	const handleImageChange = (type: string) => {
		alert(`Change ${type} clicked - File upload would be implemented here`);
	};

	return (
		<div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
			<Sidebar sidebarOpen={sidebarOpen} />
			<main className="flex-1 overflow-y-auto">
				<div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-5">
					<div className="max-w-[960px] mx-auto">
						{/* Header */}
						<div className="flex flex-wrap justify-between items-center gap-4 p-4">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="lg:hidden text-[#261d1a] hover:text-[#013a67] transition-colors"
							>
								{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
							</button>
							<h1 className="text-[#333333] text-4xl font-bold">Settings</h1>
							<button
								onClick={handleLogout}
								className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-[#5c2e2e] text-white text-sm font-medium leading-normal hover:opacity-90"
							>
								<span className="truncate">Logout</span>
							</button>
						</div>

						{/* Tabs */}
						<div className="pb-3 mt-4">
							<div className="flex border-b border-[#e2d8d4] px-4 gap-8">
								<button
									onClick={() => setActiveTab("general")}
									className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
										activeTab === "general"
											? "border-b-[#B35E3F] text-[#333333]"
											: "border-b-transparent text-[#8a685c] hover:text-[#333333]"
									}`}
								>
									<p className="text-sm font-bold">General</p>
								</button>
								<button
									onClick={() => setActiveTab("payment")}
									className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
										activeTab === "payment"
											? "border-b-[#B35E3F] text-[#333333]"
											: "border-b-transparent text-[#8a685c] hover:text-[#333333]"
									}`}
								>
									<p className="text-sm font-bold">Payment Gateways</p>
								</button>
								<button
									onClick={() => setActiveTab("profile")}
									className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
										activeTab === "profile"
											? "border-b-[#B35E3F] text-[#333333]"
											: "border-b-transparent text-[#8a685c] hover:text-[#333333]"
									}`}
								>
									<p className="text-sm font-bold">My Profile</p>
								</button>
							</div>
						</div>

						{/* General Settings Tab */}
						{activeTab === "general" && (
							<div className="p-4">
								<h2 className="text-[#333333] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
									General Settings
								</h2>
								<div className="space-y-6 mt-4">
									{/* Site Title */}
									<div className="flex max-w-[480px] flex-wrap items-end gap-4">
										<label className="flex flex-col min-w-40 flex-1">
											<p className="text-[#333333] text-base font-medium leading-normal pb-2">
												Site Title
											</p>
											<input
												type="text"
												value={siteTitle}
												onChange={(e) => setSiteTitle(e.target.value)}
												className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
											/>
										</label>
									</div>

									{/* Site Logo */}
									<div className="flex items-center gap-4 bg-transparent min-h-14 justify-between max-w-[480px]">
										<div className="flex items-center gap-4">
											<div
												className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-10 h-10"
												style={{
													backgroundImage:
														'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtfxeEfvBQfsHQQtwK5X77rcekr-5ktWztuMhOK2wkW_AM-CiNZ-OWln-Wk4I2tc8OKQKY2SFKi3rHvSLZCgrMwZ_PNHkrMWn4Ftrhsi9ejNOA2x3HyAR5zCyJSfTAkwOFDwVDI0hAgSdTH0pbj6M4x6oispb-chw7HdjFZX53tXsPOQiSSwcgZ8wyDrmbVfKHcjPKD1WjXxiwUiNfpPhSKSxk52sIchqX-tAS8LmbLX8FwHz7OOUOPDf4Go4BNPaz4Z7Bh6cuCZ4")',
												}}
											/>
											<p className="text-[#333333] text-base font-normal leading-normal flex-1 truncate">
												Site Logo
											</p>
										</div>
										<div className="shrink-0">
											<button
												onClick={() => handleImageChange("Site Logo")}
												className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f1ebea] text-[#333333] text-sm font-medium leading-normal hover:bg-[#B35E3F]/20"
											>
												<span className="truncate">Change</span>
											</button>
										</div>
									</div>

									{/* Store Address */}
									<div className="flex max-w-[480px] flex-wrap items-end gap-4">
										<label className="flex flex-col min-w-40 flex-1">
											<p className="text-[#333333] text-base font-medium leading-normal pb-2">
												Store Address
											</p>
											<input
												type="text"
												value={storeAddress}
												onChange={(e) => setStoreAddress(e.target.value)}
												className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
											/>
										</label>
									</div>

									{/* Contact Email */}
									<div className="flex max-w-[480px] flex-wrap items-end gap-4">
										<label className="flex flex-col min-w-40 flex-1">
											<p className="text-[#333333] text-base font-medium leading-normal pb-2">
												Contact Email
											</p>
											<input
												type="email"
												value={contactEmail}
												onChange={(e) => setContactEmail(e.target.value)}
												className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
											/>
										</label>
									</div>
								</div>

								<div className="mt-8">
									<button
										onClick={handleSaveChanges}
										className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#B35E3F] text-white text-base font-bold leading-normal hover:opacity-90"
									>
										<span className="truncate">Save Changes</span>
									</button>
								</div>
							</div>
						)}

						{/* Payment Gateways Tab */}
						{activeTab === "payment" && (
							<div className="p-4">
								<h2 className="text-[#333333] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
									Payment Gateways
								</h2>
								<div className="space-y-6 mt-4">
									<div className="max-w-[480px] p-6 border border-[#e2d8d4] rounded-lg bg-white">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-[#333333] text-lg font-semibold">
												Stripe
											</h3>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													className="sr-only peer"
													defaultChecked
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#B35E3F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B35E3F]"></div>
											</label>
										</div>
										<p className="text-[#8a685c] text-sm mb-4">
											Accept credit card payments via Stripe
										</p>
										<button className="text-[#B35E3F] hover:text-[#5c2e2e] text-sm font-medium">
											Configure
										</button>
									</div>

									<div className="max-w-[480px] p-6 border border-[#e2d8d4] rounded-lg bg-white">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-[#333333] text-lg font-semibold">
												PayPal
											</h3>
											<label className="relative inline-flex items-center cursor-pointer">
												<input type="checkbox" className="sr-only peer" />
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#B35E3F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B35E3F]"></div>
											</label>
										</div>
										<p className="text-[#8a685c] text-sm mb-4">
											Accept payments through PayPal
										</p>
										<button className="text-[#B35E3F] hover:text-[#5c2e2e] text-sm font-medium">
											Configure
										</button>
									</div>

									<div className="max-w-[480px] p-6 border border-[#e2d8d4] rounded-lg bg-white">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-[#333333] text-lg font-semibold">
												Cash on Delivery
											</h3>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													className="sr-only peer"
													defaultChecked
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#B35E3F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B35E3F]"></div>
											</label>
										</div>
										<p className="text-[#8a685c] text-sm">
											Accept cash payments on delivery
										</p>
									</div>
								</div>

								<div className="mt-8">
									<button
										onClick={handleSaveChanges}
										className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#B35E3F] text-white text-base font-bold leading-normal hover:opacity-90"
									>
										<span className="truncate">Save Changes</span>
									</button>
								</div>
							</div>
						)}

						{/* My Profile Tab */}
						{activeTab === "profile" && (
							<div className="p-4">
								<h2 className="text-[#333333] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
									My Profile
								</h2>
								<div className="space-y-6 mt-4">
									{/* Profile Picture */}
									<div className="flex items-center gap-4 bg-transparent min-h-14 justify-between max-w-[480px]">
										<div className="flex items-center gap-4">
											<div
												className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-16 h-16"
												style={{
													backgroundImage:
														'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALA5ve0jaVs88QBbRTvjURoY7cIv71TM8hFYDtcE1i3IoE9M2Z0zPrXNEcyQoR-SY6b-JrTaX35MFJOWBzf711pFfncKXtb2AyAIYL2yla3Mu4UiOVWtlilzHCI5-BY1hn62a8KZ3aD92J4hv1UB2ZTTx2QR-NZ1w9MIeaatAUy49Zifu4JBQI-bDnYjq2V5ACtpPv3dhEk8V1YecCgqbQhOIbWLqtqxwdgS4CEWIZ3LdJ0_oazESRrVnPecG3mz7dtHGfFovaxDI")',
												}}
											/>
											<p className="text-[#333333] text-base font-normal leading-normal flex-1 truncate">
												Profile Picture
											</p>
										</div>
										<div className="shrink-0">
											<button
												onClick={() => handleImageChange("Profile Picture")}
												className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f1ebea] text-[#333333] text-sm font-medium leading-normal hover:bg-[#B35E3F]/20"
											>
												<span className="truncate">Change</span>
											</button>
										</div>
									</div>

									{/* Administrator Name */}
									<div className="flex max-w-[480px] flex-wrap items-end gap-4">
										<label className="flex flex-col min-w-40 flex-1">
											<p className="text-[#333333] text-base font-medium leading-normal pb-2">
												Administrator Name
											</p>
											<input
												type="text"
												value={adminName}
												onChange={(e) => setAdminName(e.target.value)}
												className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
											/>
										</label>
									</div>

									{/* Email Address (readonly) */}
									<div className="flex max-w-[480px] flex-wrap items-end gap-4">
										<label className="flex flex-col min-w-40 flex-1">
											<p className="text-[#333333] text-base font-medium leading-normal pb-2">
												Email Address
											</p>
											<input
												type="email"
												readOnly
												value="admin@hithabodha.com"
												className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-500 bg-gray-100 border border-gray-300 h-14 p-[15px] text-base font-normal leading-normal cursor-not-allowed"
											/>
										</label>
									</div>

									{/* Change Password Section */}
									<div className="max-w-[480px] space-y-4 pt-4 border-t border-[#e2d8d4]">
										<p className="text-[#333333] font-medium">
											Change Password
										</p>
										<label className="flex flex-col min-w-40 flex-1">
											<p className="text-[#333333] text-base font-medium leading-normal pb-2">
												Current Password
											</p>
											<input
												type="password"
												placeholder="Enter current password"
												value={currentPassword}
												onChange={(e) => setCurrentPassword(e.target.value)}
												className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
											/>
										</label>
										<label className="flex flex-col min-w-40 flex-1">
											<p className="text-[#333333] text-base font-medium leading-normal pb-2">
												New Password
											</p>
											<input
												type="password"
												placeholder="Enter new password"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
											/>
										</label>
									</div>
								</div>

								<div className="mt-8">
									<button
										onClick={handleSaveChanges}
										className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#B35E3F] text-white text-base font-bold leading-normal hover:opacity-90"
									>
										<span className="truncate">Save Changes</span>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default AdminSettings;
