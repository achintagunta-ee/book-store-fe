import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getGeneralSettingsThunk,
  updateGeneralSettingsThunk,
  getSocialLinksThunk,
  updateSocialLinksThunk,
  getAdminProfileThunk,
  updateAdminProfileThunk,
  changeAdminPasswordThunk,
  logoutThunk,
} from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

type TabType = "general" | "payment" | "profile" | "social";

const AdminSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { generalSettings, generalSettingsStatus, socialLinks, socialLinksStatus, adminProfile } = useSelector(
    (state: RootState) => state.auth
  );

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [siteTitle, setSiteTitle] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [storeAddress, setStoreAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    dispatch(getGeneralSettingsThunk());
    dispatch(getSocialLinksThunk());
    dispatch(getAdminProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (generalSettings) {
      setSiteTitle(generalSettings.site_title);
      setStoreAddress(generalSettings.store_address);
      setContactEmail(generalSettings.contact_email);
      setLogoPreview(generalSettings.site_logo_url);
    }
  }, [generalSettings]);

  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (socialLinks) {
      setFacebook(socialLinks.facebook || "");
      setYoutube(socialLinks.youtube || "");
      setTwitter(socialLinks.twitter || "");
      setWhatsapp(socialLinks.whatsapp || "");
    }
  }, [socialLinks]);

  useEffect(() => {
    if (adminProfile) {
      setAdminFirstName(adminProfile.first_name || "");
      setAdminLastName(adminProfile.last_name || "");
      setAdminUsername(adminProfile.username || "");
      setProfileImagePreview(adminProfile.profile_image_url || adminProfile.profile_image || "");
    }
  }, [adminProfile]);

  const handleSaveChanges = async () => {
    if (activeTab === "general") {
      const formData = new FormData();
      formData.append("site_title", siteTitle);
      formData.append("store_address", storeAddress);
      formData.append("contact_email", contactEmail);
      if (logoFile) {
        formData.append("site_logo", logoFile);
      }

      await dispatch(updateGeneralSettingsThunk(formData));
      toast.success("Settings updated successfully!");
    } else if (activeTab === "social") {
      await dispatch(
        updateSocialLinksThunk({
          facebook,
          youtube,
          twitter,
          whatsapp,
        })
      );
      toast.success("Social links updated successfully!");
    } else if (activeTab === "profile") {
      setIsSavingProfile(true);
      try {
        // Handle Password Change
        if (currentPassword && newPassword) {
            await dispatch(changeAdminPasswordThunk({
              current_password: currentPassword,
              new_password: newPassword
            })).unwrap();
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
        }
  
        // Handle Profile Update
        const formData = new FormData();
        formData.append("first_name", adminFirstName);
        formData.append("last_name", adminLastName);
        formData.append("username", adminUsername);
        if (profileImageFile) {
          // sending 'profile_image' as the key for the file, as backends typically expect the field name, not the url key
          formData.append("profile_image", profileImageFile);
        }
  
        await dispatch(updateAdminProfileThunk(formData)).unwrap();
        toast.success("Profile updated successfully!");
      } catch (error) {
         toast.error(`Update failed: ${error}`);
      } finally {
        setIsSavingProfile(false);
      }
    } else {
      toast.success("Changes saved successfully!");
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  const handleImageChange = (type: string) => {
    if (type === "Site Logo" && logoInputRef.current) {
      logoInputRef.current.click();
    } else if (type === "Profile Picture" && profileImageInputRef.current) {
      profileImageInputRef.current.click();
    } else {
      toast.error(`Change ${type} - File upload not implemented for this type`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "profile" = "logo") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setProfileImageFile(file);
        setProfileImagePreview(URL.createObjectURL(file));
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${!sidebarOpen ? "pl-20" : ""}`}>
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-5">
          <div className="max-w-[960px] mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4">

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
                  onClick={() => setActiveTab("profile")}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "profile"
                      ? "border-b-[#B35E3F] text-[#333333]"
                      : "border-b-transparent text-[#8a685c] hover:text-[#333333]"
                  }`}
                >
                  <p className="text-sm font-bold">My Profile</p>
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "social"
                      ? "border-b-[#B35E3F] text-[#333333]"
                      : "border-b-transparent text-[#8a685c] hover:text-[#333333]"
                  }`}
                >
                  <p className="text-sm font-bold">Social Media</p>
                </button>
              </div>
            </div>

            {/* General Settings Tab */}
            {activeTab === "general" && (
              <div className="p-4">
                <h2 className="text-[#333333] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                  General Settings
                </h2>
                {generalSettingsStatus === "loading" ? (
                  <p>Loading settings...</p>
                ) : (
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
                            backgroundImage: `url("${
                              logoPreview ||
                              "https://lh3.googleusercontent.com/aida-public/AB6AXuBtfxeEfvBQfsHQQtwK5X77rcekr-5ktWztuMhOK2wkW_AM-CiNZ-OWln-Wk4I2tc8OKQKY2SFKi3rHvSLZCgrMwZ_PNHkrMWn4Ftrhsi9ejNOA2x3HyAR5zCyJSfTAkwOFDwVDI0hAgSdTH0pbj6M4x6oispb-chw7HdjFZX53tXsPOQiSSwcgZ8wyDrmbVfKHcjPKD1WjXxiwUiNfpPhSKSxk52sIchqX-tAS8LmbLX8FwHz7OOUOPDf4Go4BNPaz4Z7Bh6cuCZ4"
                            }")`,
                          }}
                        />
                        <p className="text-[#333333] text-base font-normal leading-normal flex-1 truncate">
                          Site Logo
                        </p>
                        <input
                          type="file"
                          ref={logoInputRef}
                          onChange={(e) => handleFileChange(e, "logo")}
                          className="hidden"
                          accept="image/*"
                        />
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
                )}

                <div className="mt-8">
                  <button
                    onClick={handleSaveChanges}
                    disabled={generalSettingsStatus === "loading"}
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#B35E3F] text-white text-base font-bold leading-normal hover:opacity-90 disabled:opacity-50"
                  >
                    <span className="truncate">
                      {generalSettingsStatus === "loading"
                        ? "Saving..."
                        : "Save Changes"}
                    </span>
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
                          backgroundImage: `url("${
                            profileImagePreview ||
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuALA5ve0jaVs88QBbRTvjURoY7cIv71TM8hFYDtcE1i3IoE9M2Z0zPrXNEcyQoR-SY6b-JrTaX35MFJOWBzf711pFfncKXtb2AyAIYL2yla3Mu4UiOVWtlilzHCI5-BY1hn62a8KZ3aD92J4hv1UB2ZTTx2QR-NZ1w9MIeaatAUy49Zifu4JBQI-bDnYjq2V5ACtpPv3dhEk8V1YecCgqbQhOIbWLqtqxwdgS4CEWIZ3LdJ0_oazESRrVnPecG3mz7dtHGfFovaxDI"
                          }")`,
                        }}
                      />
                      <p className="text-[#333333] text-base font-normal leading-normal flex-1 truncate">
                        Profile Picture
                      </p>
                      <input
                          type="file"
                          ref={profileImageInputRef}
                          onChange={(e) => handleFileChange(e, "profile")}
                          className="hidden"
                          accept="image/*"
                        />
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

                  {/* First Name */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                        First Name
                      </p>
                      <input
                        type="text"
                        value={adminFirstName}
                        onChange={(e) => setAdminFirstName(e.target.value)}
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
                      />
                    </label>
                  </div>

                  {/* Last Name */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                        Last Name
                      </p>
                      <input
                        type="text"
                        value={adminLastName}
                        onChange={(e) => setAdminLastName(e.target.value)}
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
                      />
                    </label>
                  </div>

                  {/* Username */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                        Username
                      </p>
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
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
                        value={adminProfile?.email || "admin@hithabodha.com"}
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
                    disabled={isSavingProfile}
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#B35E3F] text-white text-base font-bold leading-normal hover:opacity-90 disabled:opacity-50"
                  >
                    <span className="truncate">{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <div className="p-4">
                <h2 className="text-[#333333] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                  Social Media Links
                </h2>
                {socialLinksStatus === "loading" ? (
                  <p>Loading social links...</p>
                ) : (
                  <div className="space-y-6 mt-4">
                    {/* Facebook */}
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                          Facebook URL
                        </p>
                        <input
                          type="text"
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
                        />
                      </label>
                    </div>

                    {/* Youtube */}
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                          YouTube URL
                        </p>
                        <input
                          type="text"
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                          placeholder="https://youtube.com/..."
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
                        />
                      </label>
                    </div>

                    {/* Twitter */}
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                          Twitter URL
                        </p>
                        <input
                          type="text"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          placeholder="https://x.com/..."
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
                        />
                      </label>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                          WhatsApp URL
                        </p>
                        <input
                          type="text"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="https://wa.me/..."
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#333333] bg-[#f8f4f1] border border-[#e2d8d4] focus:border-[#B35E3F] focus:outline-none h-14 p-[15px] text-base font-normal leading-normal placeholder:text-[#8a685c]"
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={handleSaveChanges}
                    disabled={socialLinksStatus === "loading"}
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#B35E3F] text-white text-base font-bold leading-normal hover:opacity-90 disabled:opacity-50"
                  >
                    <span className="truncate">
                      {socialLinksStatus === "loading"
                        ? "Saving..."
                        : "Save Changes"}
                    </span>
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
