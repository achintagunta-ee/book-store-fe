import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { type RootState, type AppDispatch } from "../redux/store/store";
import { updateUserProfileThunk } from "../redux/slice/authSlice";

// --- Type Definitions ---

type OrderStatus = "Shipped" | "Delivered";

interface Order {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
}

const mockOrders: Order[] = [
  {
    id: "#12345",
    date: "October 21, 2023",
    total: "$55.00",
    status: "Shipped",
  },
  {
    id: "#12344",
    date: "October 15, 2023",
    total: "$35.00",
    status: "Delivered",
  },
  {
    id: "#12343",
    date: "September 28, 2023",
    total: "$120.50",
    status: "Delivered",
  },
];

// --- Order History Table Sub-Component ---

const OrderHistoryTable: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const statusStyles: Record<OrderStatus, string> = {
    Shipped: "bg-shipped",
    Delivered: "bg-delivered",
  };

  return (
    <section className="mt-8">
      <h2 className="text-[#333333]  text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-display">
        Order History
      </h2>
      <div className="px-4 py-3 @container">
        <div className="flex overflow-hidden rounded-xl border border-[#e6d8d1]  bg-[#fbf9f8]  shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#f3ebe8] ">
              <tr>
                <th className="px-6 py-4 text-left text-[#333333]  w-[150px] text-sm font-semibold leading-normal font-body">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-[#333333]  w-[200px] text-sm font-semibold leading-normal font-body">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-[#333333]  w-[150px] text-sm font-semibold leading-normal font-body">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-[#333333]  w-[120px] text-sm font-semibold leading-normal font-body">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[#333333]  w-[150px] text-sm font-semibold leading-normal font-body"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d8d1] dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="h-[72px] px-6 py-4 w-[150px] text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal font-body">
                    {order.id}
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[200px] text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal font-body">
                    {order.date}
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[150px] text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal font-body">
                    {order.total}
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[120px] text-sm font-normal leading-normal">
                    <span
                      className={`inline-flex items-center justify-center rounded-full h-7 px-4 text-xs font-bold leading-normal font-body ${
                        statusStyles[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[150px] text-primary  text-sm font-bold leading-normal tracking-[0.015em] font-body text-right">
                    <a className="hover:underline" href="#">
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// --- Main Profile Page Component ---

const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: { firstName: string; lastName: string; username: string };
}> = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: user.firstName,
    last_name: user.lastName,
    username: user.username,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    setFormData({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("username", formData.username);
    if (profileImage) {
      data.append("profile_image", profileImage);
    }
    try {
      await dispatch(updateUserProfileThunk(data)).unwrap();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to update profile.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h3 className="mb-4 text-2xl font-bold text-text-main">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
            />
          </div>
          <div>
            <label
              htmlFor="profile_image"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              Profile Image
            </label>
            <input
              type="file"
              name="profile_image"
              id="profile_image"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-secondary-link hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const { userProfile } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const orders = mockOrders;

  useEffect(() => {
    // If there's no user profile, they shouldn't be here. Redirect to login.
    if (!userProfile) {
      navigate("/login");
    }
  }, [userProfile, navigate]);

  // Render a loading state or null while redirecting
  if (!userProfile) {
    return null;
  }

  const avatarUrl = userProfile.profile_image
    ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.profile_image}`
    : `https://ui-avatars.com/api/?name=${userProfile.first_name}+${userProfile.last_name}&background=random`;

  return (
    <>
      <main className="flex-grow mt-8 p-5">
        <div className="p-4 @container">
          <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
            <div className="flex gap-6 items-center">
              <img
                src={avatarUrl}
                alt="User avatar"
                className="aspect-square h-32 w-32 rounded-full object-cover"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-[#333333]  text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
                  {userProfile.first_name} {userProfile.last_name}
                </h1>
                <p className="text-gray-500  text-base font-normal leading-normal font-body">
                  {userProfile.email}
                </p>
              </div>
            </div>
            <div className="flex w-full max-w-[480px] gap-3 @[480px]:w-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f3ebe8] dark:bg-gray-800 text-[#333333] dark:text-white text-sm font-semibold leading-normal tracking-[0.015em] flex-1 @[480px]:flex-auto hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="truncate font-body">Edit Profile</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold leading-normal tracking-[0.015em] flex-1 @[480px]:flex-auto hover:bg-opacity-90 transition-colors">
                <span className="truncate font-body">Change Password</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="pb-3">
            <div className="flex border-b border-[#e6d8d1]  px-4 gap-8">
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-gray-400 pb-[13px] pt-4 hover:text-[#333333]  transition-colors"
                href="#"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Profile Info
                </p>
              </a>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-[#333333]  pb-[13px] pt-4"
                href="#"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Order History
                </p>
              </a>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-gray-400 pb-[13px] pt-4 hover:text-[#333333]  transition-colors"
                href="#"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Addresses
                </p>
              </a>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-logout dark:text-red-400 pb-[13px] pt-4 hover:text-red-700  transition-colors"
                href="#"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Logout
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Render the Order History Table */}
        <OrderHistoryTable orders={orders} />
      </main>
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        user={{
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          username: userProfile.username,
        }}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default UserProfilePage;
