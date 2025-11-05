import React from "react";

// --- Type Definitions ---

type OrderStatus = "Shipped" | "Delivered";

interface User {
	name: string;
	email: string;
	avatarUrl: string;
}

interface Order {
	id: string;
	date: string;
	total: string;
	status: OrderStatus;
}

// --- Mock Data (from HTML) ---

const mockUser: User = {
	name: "John Doe",
	email: "johndoe@email.com",
	avatarUrl:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuBD1nJH_PBjKl8ceBHPArTJ7Xvn57tO1Fnnbzv0ftzNgk8RO6c58h1s3nHbfzhQ6MGgu28Q9eNGNTIZlijDIG7DbXQ2b_e1pkzlRDDvUonhax-tlLDWi4KZtpWcLXvSuTB4weTR7qfp5DzeB78E7kN31vZZNuh_sivIwBMUjvPrpJkkRRBGetTT36pYT8iBR8crItxplY2AOiqwqjKxuB9RhMmZ1YMUg4QmIfCyeK4SWfq-7rDkvMhDX1TPXz1uXhusRTrPO8_c0TA",
};

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

const UserProfilePage: React.FC = () => {
	const user = mockUser;
	const orders = mockOrders;

	return (
		<main className="flex-grow mt-8 p-5">
			<div className="p-4 @container">
				<div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
					<div className="flex gap-6 items-center">
						<div
							className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
							aria-label="User avatar"
							style={{ backgroundImage: `url("${user.avatarUrl}")` }}
						></div>
						<div className="flex flex-col justify-center">
							<h1 className="text-[#333333]  text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
								{user.name}
							</h1>
							<p className="text-gray-500  text-base font-normal leading-normal font-body">
								{user.email}
							</p>
						</div>
					</div>
					<div className="flex w-full max-w-[480px] gap-3 @[480px]:w-auto">
						<button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f3ebe8] dark:bg-gray-800 text-[#333333] dark:text-white text-sm font-semibold leading-normal tracking-[0.015em] flex-1 @[480px]:flex-auto hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
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
	);
};

export default UserProfilePage;
