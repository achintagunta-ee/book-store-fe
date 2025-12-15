import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { type RootState, type AppDispatch } from "../redux/store/store";
import {
  updateUserProfileThunk,
  getOrderHistoryThunk,
  getOrderDetailsThunk,
} from "../redux/slice/authSlice";
import {
  getAddressesThunk,
  addAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
} from "../redux/slice/authSlice";
import {
  type AddressItem,
  type OrderHistoryItem,
  type OrderDetailResponse,
  type UserProfile,
} from "../redux/utilis/authApi";

// --- Order History Table Sub-Component ---

const OrderHistoryTable: React.FC<{
  orders: OrderHistoryItem[];
  onViewDetails: (id: number) => void;
}> = ({ orders, onViewDetails }) => {
  const statusStyles: Record<string, string> = {
    Shipped: "bg-shipped",
    Delivered: "bg-delivered",
    pending: "bg-yellow-100 text-yellow-800",
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
                <tr key={order.order_id}>
                  <td className="h-[72px] px-6 py-4 w-[150px] text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal font-body">
                    {order.order_id}
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[200px] text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal font-body">
                    {order.date}
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[150px] text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal font-body">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[120px] text-sm font-normal leading-normal">
                    <span
                      className={`inline-flex items-center justify-center rounded-full h-7 px-4 text-xs font-bold leading-normal font-body ${
                        statusStyles[order.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="h-[72px] px-6 py-4 w-[150px] text-primary  text-sm font-bold leading-normal tracking-[0.015em] font-body text-right">
                    <button
                      className="hover:underline"
                      onClick={() => onViewDetails(order.raw_id)}
                    >
                      View Details
                    </button>
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

// --- Address Components ---

const AddressModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  address?: AddressItem;
}> = ({ isOpen, onClose, address }) => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    if (address) {
      // Attempt to split full_name if first/last are missing (GET vs PUT response diff)
      let fName = address.first_name || "";
      let lName = address.last_name || "";
      if (!fName && !lName && address.full_name) {
        const parts = address.full_name.split(" ");
        fName = parts[0];
        lName = parts.slice(1).join(" ");
      }

      setFormData({
        first_name: fName,
        last_name: lName,
        address: address.address,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
      });
    }
  }, [address, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (address) {
        await dispatch(
          updateAddressThunk({ id: address.id, data: formData })
        ).unwrap();
        toast.success("Address updated");
      } else {
        await dispatch(addAddressThunk(formData)).unwrap();
        toast.success("Address added");
      }
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to save address");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h3 className="mb-4 text-2xl font-bold text-[#333333]">
          {address ? "Edit Address" : "Add Address"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
          </div>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="h-12 w-full rounded-lg border border-black/10 p-4"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
          </div>
          <input
            type="text"
            name="zip_code"
            placeholder="Zip Code"
            value={formData.zip_code}
            onChange={handleChange}
            className="h-12 w-full rounded-lg border border-black/10 p-4"
            required
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { addresses, addressStatus } = useSelector(
    (state: RootState) => state.auth
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | undefined>(
    undefined
  );

  useEffect(() => {
    if (addressStatus === "idle") {
      dispatch(getAddressesThunk());
    }
  }, [addressStatus, dispatch]);

  const handleDelete = async (id: number) => {
    if (!id) {
      toast.error("Invalid address ID");
      return;
    }
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddressThunk(id)).unwrap();
        toast.success("Address deleted");
      } catch (err: any) {
        toast.error(err || "Failed to delete");
      }
    }
  };

  return (
    <section className="mt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#333333]">Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(undefined);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90"
        >
          Add Address
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border border-[#e6d8d1] p-4 rounded-lg shadow-sm bg-[#fbf9f8]"
          >
            <p className="font-bold text-[#333333]">
              {addr.full_name || `${addr.first_name} ${addr.last_name}`}
            </p>
            <p className="text-gray-600">{addr.address}</p>
            <p className="text-gray-600">
              {addr.city}, {addr.state} {addr.zip_code}
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => {
                  setEditingAddress(addr);
                  setIsModalOpen(true);
                }}
                className="text-primary text-sm font-semibold hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="text-red-600 text-sm font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <p className="text-gray-500">No addresses found.</p>
        )}
      </div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={editingAddress}
      />
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

const OrderDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetailResponse | null;
}> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#333333]">
            Order Details #{order.order.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">
              {new Date(order.order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold capitalize">{order.order.status}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">
              ${order.order.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold">
              ${order.order.shipping.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax</span>
            <span className="font-semibold">${order.order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary">
              ${order.order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInfo: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <section className="mt-8 px-4">
      <h2 className="text-[#333333] text-2xl font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 font-display">
        Profile Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-8xl">
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Username</p>
          <p className="font-semibold text-[#333333]">{user.username}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <p className="font-semibold text-[#333333]">{user.email}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Full Name</p>
          <p className="font-semibold text-[#333333]">
            {user.first_name} {user.last_name}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Role</p>
          <p className="font-semibold text-[#333333] capitalize">{user.role}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Client</p>
          <p className="font-semibold text-[#333333]">{user.client}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Member Since</p>
          <p className="font-semibold text-[#333333]">
            {new Date(user.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

const UserProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userProfile, orderHistory, currentOrder } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses"
  >("profile");

  useEffect(() => {
    // If there's no user profile, they shouldn't be here. Redirect to login.
    if (!userProfile) {
      navigate("/login");
    }
  }, [userProfile, navigate]);

  useEffect(() => {
    if (activeTab === "orders") {
      dispatch(getOrderHistoryThunk());
    }
  }, [activeTab, dispatch]);

  const handleViewDetails = async (id: number) => {
    await dispatch(getOrderDetailsThunk(id));
    setIsOrderModalOpen(true);
  };

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
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                  activeTab === "profile"
                    ? "border-b-primary text-[#333333]"
                    : "border-b-transparent text-gray-500 hover:text-[#333333]"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Profile Info
                </p>
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                  activeTab === "orders"
                    ? "border-b-primary text-[#333333]"
                    : "border-b-transparent text-gray-500 hover:text-[#333333]"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Order History
                </p>
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                  activeTab === "addresses"
                    ? "border-b-primary text-[#333333]"
                    : "border-b-transparent text-gray-500 hover:text-[#333333]"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Addresses
                </p>
              </button>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-logout dark:text-red-400 pb-[13px] pt-4 hover:text-red-700  transition-colors"
                href="#"
              >
                {/* <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Logout
                </p> */}
              </a>
            </div>
          </div>
        </div>

        {activeTab === "profile" && <ProfileInfo user={userProfile} />}
        {activeTab === "orders" && (
          <OrderHistoryTable
            orders={orderHistory}
            onViewDetails={handleViewDetails}
          />
        )}
        {activeTab === "addresses" && <AddressList />}
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
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={currentOrder}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default UserProfilePage;
