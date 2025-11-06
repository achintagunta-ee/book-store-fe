import React, { useState } from "react";

// --- 1. Type Definitions ---

type CheckoutStep = "billing" | "payment" | "confirmation";

type OrderItemType = {
	id: string;
	name: string;
	quantity: number;
	price: number;
	imageUrl: string;
	imageAlt: string;
};

// --- 2. Mock Data ---
// In a real app, this would come from props or a global state/context
const mockOrderItems: OrderItemType[] = [
	{
		id: "1",
		name: "The Midnight Library",
		quantity: 1,
		price: 15.99,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBmWdEgTkTQkdIDEQ0KAh1AEVRBBk0Idm-33QsF_5FJolM4I-qLzcuwDw-U7rd7gdBFzkqnbj7S-zbDPQBgs4fFGPCYlIoiyvFv_0UcZV0CqFsGPXkpx7Je8N2HTcZ4u6J7uh4a3Uf-oCEB_IbewmZtco5Q0C4w2dVQB9azxMnvKO4aMRxFpWY1u2rbdJkIlBmwc1h0Z4pLGPh6RaaK8geqEpBOqI-VXP6hldxqe1bgHEd9ebifFf0Pa7EQJvIa_y3t_mIzLWMO8Bc",
		imageAlt: "Cover of The Midnight Library",
	},
	{
		id: "2",
		name: "The Alchemist",
		quantity: 1,
		price: 12.5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDbIl7EdxSw2duXvxY5CuVEsNn4DhloevZ0PyTSEqLvrsxv9chB-M6ym-efwXeAFojAk_YaVq8qiUOcyEBQ-Lf_DL2Vqbk_05r384QGVDS_w8UtFSPagDF7alQMpCm5Sb9tdgbuLO66L8h_VXtITY6cZGsUR_isppagg122mMjsjLRrPs40c65ptJtG4Ui4DTqhHdn0OQXOl_5QCmHOdG-JLAS25bU-SNmuJ8gfF1jXK4OxeL-FrYFK2hyIfxRP4WUQ0zebpvCE1n8",
		imageAlt: "Cover of The Alchemist",
	},
];

const SHIPPING_COST = 5.0;

// --- 3. Order Summary Components ---

interface OrderSummaryItemProps {
	item: OrderItemType;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({ item }) => (
	<div className="flex justify-between items-start">
		<div className="flex gap-4">
			<img
				className="w-16 h-20 object-cover rounded"
				alt={item.imageAlt}
				src={item.imageUrl}
			/>
			<div>
				<p className="font-bold text-text-light dark:text-text-dark">
					{item.name}
				</p>
				<p className="text-sm text-text-light/70 dark:text-gray-400">
					Qty: {item.quantity}
				</p>
			</div>
		</div>
		<p className="font-bold text-text-light dark:text-text-dark">
			${item.price.toFixed(2)}
		</p>
	</div>
);

interface OrderSummaryProps {
	items: OrderItemType[];
	shipping: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, shipping }) => {
	const subtotal = items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	const total = subtotal + shipping;

	return (
		<div className="lg:col-span-1 bg-primary/5 dark:bg-primary/10 rounded-lg p-6 h-fit">
			<h3 className="text-text-light dark:text-text-dark text-xl font-bold font-display leading-tight tracking-[-0.015em] pb-4 border-b border-primary/20">
				Order Summary
			</h3>
			<div className="mt-4 space-y-4">
				{items.map((item) => (
					<OrderSummaryItem key={item.id} item={item} />
				))}
			</div>
			<div className="mt-6 pt-4 border-t border-primary/20 space-y-2">
				<div className="flex justify-between text-text-light/70 ">
					<span>Subtotal</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-between text-text-light/70 ">
					<span>Shipping</span>
					<span>${shipping.toFixed(2)}</span>
				</div>
				<div className="flex justify-between text-lg font-bold text-text-light dark:text-text-dark mt-2">
					<span>Total</span>
					<span>${total.toFixed(2)}</span>
				</div>
			</div>
		</div>
	);
};

// --- 4. Checkout Step Components ---

interface StepProps {
	setStep: React.Dispatch<React.SetStateAction<CheckoutStep>>;
}

// -- Billing Step (Your HTML) --
const BillingStep: React.FC<StepProps> = ({ setStep }) => (
	<div className="lg:col-span-2">
		<h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
			Billing Address
		</h2>
		<form
			onSubmit={(e) => {
				e.preventDefault();
				setStep("payment");
			}}
		>
			<div className="flex flex-wrap items-end gap-4 px-4 py-3">
				<label className="flex flex-col min-w-40 flex-1">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						First Name
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="John"
						defaultValue=""
						required
					/>
				</label>
				<label className="flex flex-col min-w-40 flex-1">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						Last Name
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="Doe"
						defaultValue=""
						required
					/>
				</label>
			</div>
			<div className="px-4 py-3">
				<label className="flex flex-col">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						Address
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="123 Bookworm Lane"
						defaultValue=""
						required
					/>
				</label>
			</div>
			<div className="flex flex-wrap items-end gap-4 px-4 py-3">
				<label className="flex flex-col min-w-40 flex-1">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						City
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="Storyville"
						defaultValue=""
						required
					/>
				</label>
				<label className="flex flex-col min-w-40 flex-1">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						State
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="Readington"
						defaultValue=""
						required
					/>
				</label>
				<label className="flex flex-col min-w-40 flex-1">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						Zip Code
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="12345"
						defaultValue=""
						required
					/>
				</label>
			</div>
			<div className="px-4 py-3">
				<label className="flex items-center gap-3">
					<input
						className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary/50 border-primary/30 bg-background-light  dark:checked:bg-primary"
						type="checkbox"
					/>
					<span className="text-text-light dark:text-gray-500 text-base">
						Same as shipping address
					</span>
				</label>
			</div>
			<div className="mt-8">
				<button
					type="submit"
					className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow duration-300"
				>
					Continue to Payment
				</button>
			</div>
		</form>
	</div>
);

// -- Payment Step (New Content) --
const PaymentStep: React.FC<StepProps> = ({ setStep }) => (
	<div className="lg:col-span-2">
		<h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
			Payment Details
		</h2>
		<form
			onSubmit={(e) => {
				e.preventDefault();
				setStep("confirmation");
			}}
		>
			<div className="px-4 py-3">
				<label className="flex flex-col">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						Card Number
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="0000 0000 0000 0000"
						defaultValue=""
						required
					/>
				</label>
			</div>
			<div className="flex flex-wrap items-end gap-4 px-4 py-3">
				<label className="flex flex-col min-w-40 flex-1">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						Expiry Date
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="MM / YY"
						defaultValue=""
						required
					/>
				</label>
				<label className="flex flex-col min-w-40 flex-1">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						CVC
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="123"
						defaultValue=""
						required
					/>
				</label>
			</div>
			<div className="px-4 py-3">
				<label className="flex flex-col">
					<p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
						Name on Card
					</p>
					<input
						className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
						placeholder="John M. Doe"
						defaultValue=""
						required
					/>
				</label>
			</div>
			<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
				<button
					type="button"
					onClick={() => setStep("billing")}
					className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary/20 text-text-light dark:text-text-dark gap-2 text-lg font-bold leading-normal tracking-[0.015em] transition-colors duration-300"
				>
					Back to Billing
				</button>
				<button
					type="submit"
					className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow duration-300"
				>
					Pay $33.49
				</button>
			</div>
		</form>
	</div>
);

// -- Confirmation Step (New Content from your HTML) --
const ConfirmationStep: React.FC<StepProps> = () => (
	<div className="lg:col-span-2">
		<main className="bg-white  rounded-lg shadow-md p-6 sm:p-8">
			<div className="flex flex-wrap justify-between gap-3 p-4">
				<div className="flex min-w-72 flex-col gap-3">
					<p className="text-charcoal  text-4xl font-display font-bold leading-tight tracking-[-0.033em]">
						Thank you for your order #12345
					</p>
					<p className="text-charcoal/80 dark:text-gray-400 text-base font-body leading-normal">
						Dear Customer,
					</p>
				</div>
			</div>
			<p className="text-charcoal dark:text-gray-500  text-base font-body leading-normal pb-10 pt-1 px-4">
				We've received your order and will let you know when it has shipped. In
				the meantime, you can view your order details in the summary.
			</p>

			<div className="px-4">
				<h3 className="text-lg font-display font-semibold text-mahogany  mb-2">
					Shipping To:
				</h3>
				<p className="text-charcoal dark:text-gray-500  font-body">
					John Doe
					<br />
					123 Bookworm Lane
					<br />
					Reading, PA 19601
				</p>
			</div>
			<div className="mt-6 px-4">
				<p className="text-charcoal dark:text-gray-500  font-body">
					We hope you enjoy your new books!
				</p>
			</div>
		</main>
	</div>
);

// --- 5. Main Checkout Page Component ---

const CheckoutPage: React.FC = () => {
	const [step, setStep] = useState<CheckoutStep>("billing");

	const renderStep = () => {
		switch (step) {
			case "billing":
				return <BillingStep setStep={setStep} />;
			case "payment":
				return <PaymentStep setStep={setStep} />;
			case "confirmation":
				return <ConfirmationStep setStep={setStep} />;
			default:
				return <BillingStep setStep={setStep} />;
		}
	};

	const getTabClassName = (tabStep: CheckoutStep) => {
		const baseClasses =
			"flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 cursor-pointer";
		if (step === tabStep) {
			return `${baseClasses} border-b-secondary-link text-text-light dark:text-text-dark`;
		}
		return `${baseClasses} border-b-transparent text-text-light/70 dark:text-gray-400`;
	};

	return (
		<main className="flex-1 mt-8 px-0 sm:px-10">
			<div className="flex flex-wrap justify-between gap-3 p-4">
				<p className="text-text-light dark:text-text-dark text-4xl lg:text-5xl font-black font-display leading-tight tracking-[-0.033em] min-w-72">
					Checkout
				</p>
			</div>

			{/* Tabs */}
			<div className="pb-3 mt-4">
				<div className="flex border-b border-secondary-link  justify-between">
					<a
						className={getTabClassName("billing")}
						onClick={() => setStep("billing")}
					>
						<p className="text-sm font-bold leading-normal tracking-[0.015em]">
							1. Billing
						</p>
					</a>
					<a
						className={getTabClassName("payment")}
						onClick={() => step !== "confirmation" && setStep("payment")}
					>
						<p className="text-sm font-bold leading-normal tracking-[0.015em]">
							2. Payment
						</p>
					</a>
					<a className={getTabClassName("confirmation")}>
						<p className="text-sm font-bold leading-normal tracking-[0.015em]">
							3. Confirmation
						</p>
					</a>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
				{/* Conditional Step Content */}
				{renderStep()}

				{/* Order Summary (always visible) */}
				<OrderSummary items={mockOrderItems} shipping={SHIPPING_COST} />
			</div>
		</main>
	);
};

export default CheckoutPage;
