import React, { useState } from "react";
import {
	Search,
	CreditCard,
	ShoppingCart,
	Package,
	Menu,
	X,
	BookOpen,
} from "lucide-react";
import Sidebar from "./Sidebar";

interface StatCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
	<div className="flex flex-col gap-4 rounded-lg p-6 bg-white shadow-md border border-transparent hover:border-[#5c2e2e]/30 transition-all">
		<div className="flex items-center justify-between">
			<p className="text-[#261d1a] text-lg font-bold">{title}</p>
			<div className="text-[#e1aa12]">{icon}</div>
		</div>
		<p className="text-[#000] text-4xl font-bold tracking-tight">{value}</p>
	</div>
);

const Dashboard: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

	const stats = [
		{ title: "Total Books", value: "12,456", icon: <BookOpen size={24} /> },
		{ title: "Total Orders", value: "8,732", icon: <ShoppingCart size={24} /> },
		{
			title: "Total Revenue",
			value: "$98,450",
			icon: <CreditCard size={24} />,
		},
		{ title: "Low Stock", value: "124", icon: <Package size={24} /> },
	];

	return (
		<div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
			{/* Sidebar */}
			<Sidebar sidebarOpen={sidebarOpen} />

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<div className="flex flex-col p-8 overflow-y-auto">
					{/* Header */}
					<header className="flex justify-between items-center mb-8 gap-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="lg:hidden text-[#261d1a] hover:text-[#013a67] transition-colors"
							>
								{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
							</button>
							<h1 className="text-3xl font-bold text-[#261d1a]">Dashboard</h1>
						</div>
						<div className="flex-1 max-w-md">
							<div className="flex items-stretch rounded-lg h-12 shadow-sm">
								<div className="flex items-center justify-center pl-4 rounded-l-lg border-y border-l border-[#5c2e2e]/20 bg-white text-gray-500">
									<Search size={20} />
								</div>
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="flex-1 px-4 rounded-r-lg border-y border-r border-[#5c2e2e]/20 bg-white text-[#261d1a] focus:outline-none focus:ring-2 focus:ring-[#013a67]/50"
									placeholder="Search for books, orders, etc."
								/>
							</div>
						</div>
					</header>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{stats.map((stat) => (
							<StatCard
								key={stat.title}
								title={stat.title}
								value={stat.value}
								icon={stat.icon}
							/>
						))}
					</div>

					{/* Additional Content Area */}
					<div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-[#5c2e2e]/10">
						<h2 className="text-2xl font-bold text-[#261d1a] mb-4">
							Dashboard Overview
						</h2>
						<p className="text-[#261d1a]/70">
							Content for dashboard section will appear here. This is a fully
							functional dashboard with working navigation and search.
						</p>

						<button className="mt-4 ml-3 px-6 py-2 bg-[#e1aa12] hover:bg-[#e1aa12]/90 text-white rounded-lg transition-colors font-semibold">
							View All
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
