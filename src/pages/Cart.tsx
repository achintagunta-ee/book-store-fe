import React from "react";

// --- 1. Type Definitions ---
// This defines the data structure for a single cart item
type CartItemType = {
	id: string;
	title: string;
	author: string;
	price: number;
	imageUrl: string;
	quantity: number;
};

// --- 2. Mock Data ---
// In a real application, this data would come from React state, context, or props
const mockCartItems: CartItemType[] = [
	{
		id: "1",
		title: "The Silent Patient",
		author: "Alex Michaelides",
		price: 12.5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAWSwC2tdcGpyI725SOXOkpYC-bdZBiKzjnKQUYEJHw12n01iDpk5gKYb0NiAIPs9wupM8WpBMEXUBnNMwGOA6Zll99NVxtqJIPENdhHFaabjvlurGQkyD0DzBAVDhJ7VfsjHxXGAvmJy15a3buZD6oVo5LiDJYeGMiadoHe4qt7pz02qpwmc1IBEkBtNRwFvtGp0nadc5Yzc-vk7iJTiMxKZ2_o2JLIgl_gYBAxqkhY-QJAw0BfQuEkQXBIkvoXwsKdurr_qglU1Y",
		quantity: 1,
	},
	{
		id: "2",
		title: "The Midnight Library",
		author: "Matt Haig",
		price: 12.5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuA3DHQYlckoASE7gG1PLZpXlu3BTo_ljdK5mxsj0CVbOpNUXufJNk3nTwJUOXD2Rr-55dxOF_xunTZcTeetGFsSCtfUibR3gmFICfaljI6gO-tDNFX3HCNOFaLRGY11y12FwwYFMXthsXjKBOi8wx9kwUZTC71Wi_5K3icA73S9ui5DX1CXOzPRYMV1X4mOIwPhIE5mCH9SPYzxMzQLoM8vzLq2q-zJTHYG-MTRjdhYaoCXUNt6bw01e6AzkxT9lvOKwoXEDUmAXVU",
		quantity: 1,
	},
];

// --- 3. CartItem Sub-Component ---
// This component renders a single item in the cart list
interface CartItemProps {
	item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
	return (
		<div className="flex items-center gap-4 bg-background-light  px-4 py-3 justify-between border-b border-primary/10">
			<div className="flex items-center gap-4">
				<div
					className="bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-lg h-28 w-20"
					data-alt={`Book cover of ${item.title}`}
					style={{ backgroundImage: `url("${item.imageUrl}")` }}
				></div>
				<div className="flex flex-col justify-center">
					<p className="text-lg font-medium leading-normal line-clamp-1">
						{item.title}
					</p>
					<p className="text-sm font-normal leading-normal line-clamp-2 text-text-light/70 dark:text-text-dark/70">
						{item.author}
					</p>
					<p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
				</div>
			</div>
			<div className="shrink-0 flex flex-col items-end gap-4">
				<div className="flex items-center gap-2">
					<button className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 cursor-pointer">
						-
					</button>
					{/* In a real app, this input's value and onChange would be tied to state 
            to allow the user to change the quantity.
          */}
					<input
						className="text-lg font-medium leading-normal w-6 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						type="number"
						defaultValue={item.quantity}
					/>
					<button className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 cursor-pointer">
						+
					</button>
				</div>
				<button className="text-sm text-primary font-medium flex items-center gap-1">
					<span className="material-symbols-outlined text-base">delete</span>{" "}
					Remove
				</button>
			</div>
		</div>
	);
};

// --- 4. OrderSummary Sub-Component ---
// This component renders the summary box with totals
interface OrderSummaryProps {
	subtotal: number;
	taxes: number;
	total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
	subtotal,
	taxes,
	total,
}) => {
	return (
		<div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6">
			<h3 className="text-xl font-bold mb-4">Order Summary</h3>
			<div className="space-y-3">
				<div className="flex justify-between gap-x-6 py-2 border-b border-primary/10">
					<p className="text-sm font-normal leading-normal text-text-light/70 dark:text-text-dark/70">
						Subtotal
					</p>
					<p className="text-sm font-medium leading-normal text-right">
						${subtotal.toFixed(2)}
					</p>
				</div>
				<div className="flex justify-between gap-x-6 py-2 border-b border-primary/10">
					<p className="text-sm font-normal leading-normal text-text-light/70 dark:text-text-dark/70">
						Taxes
					</p>
					<p className="text-sm font-medium leading-normal text-right">
						${taxes.toFixed(2)}
					</p>
				</div>
				<div className="flex justify-between gap-x-6 py-4">
					<p className="text-base font-bold leading-normal">Total</p>
					<p className="text-xl font-bold leading-normal text-right">
						${total.toFixed(2)}
					</p>
				</div>
			</div>
			<button className="w-full mt-6 bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-300">
				Checkout
			</button>
		</div>
	);
};

// --- 5. Main CartPage Component ---
// This component assembles the layout and provides the data
const CartPage: React.FC = () => {
	// Use the mock data
	const cartItems = mockCartItems;

	// Calculate totals based on the cart items
	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	// Calculating tax based on the HTML example ($2.00 on $25.00 is 8%)
	const taxes = subtotal * 0.08;
	const total = subtotal + taxes;

	return (
		<main className="flex-1 container mx-auto px-4 py-8">
			<div className="flex flex-wrap justify-between gap-3 p-4">
				<p className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
					Your Cart
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
				{/* Column 1: Cart Items List */}
				<div className="lg:col-span-2 space-y-4">
					{/* We map over the cartItems array to render each item dynamically */}
					{cartItems.map((item) => (
						<CartItem key={item.id} item={item} />
					))}

					<div className="pt-4">
						<button className="text-primary font-medium text-sm flex items-center gap-2">
							<span className="material-symbols-outlined">arrow_back</span>
							Continue Shopping
						</button>
					</div>
				</div>

				{/* Column 2: Order Summary */}
				<div className="lg:col-span-1">
					<OrderSummary subtotal={subtotal} taxes={taxes} total={total} />
				</div>
			</div>
		</main>
	);
};

export default CartPage;
