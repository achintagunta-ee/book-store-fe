import React from "react";
// We'll use react-icons for the Facebook and Twitter logos
// Install with: npm install react-icons
import { FaFacebook, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<footer className="bg-primary/20 text-stone-700 py-12 px-4">
			<div className="container mx-auto">
				{/* Top section with columns */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					{/* Column 1: Brand Info */}
					<div>
						<h3 className="text-lg font-bold mb-3">Hithabodha Book Store</h3>
						<p className="text-sm">
							Your destination for curated books and literary wonders.
						</p>
					</div>

					{/* Column 2: Quick Links */}
					<div>
						<h4 className="text-md font-semibold mb-3">Quick Links</h4>
						<ul className="space-y-2">
							<li>
								<a href="/" className="text-sm hover:underline">
									Home
								</a>
							</li>
							<li>
								<a href="/about" className="text-sm hover:underline">
									About Us
								</a>
							</li>
							<li>
								<a href="/contact" className="text-sm hover:underline">
									Contact
								</a>
							</li>
							<li>
								<a href="/faq" className="text-sm hover:underline">
									FAQ
								</a>
							</li>
						</ul>
					</div>

					{/* Column 3: Policies */}
					<div>
						<h4 className="text-md font-semibold mb-3">Policies</h4>
						<ul className="space-y-2">
							<li>
								<a href="/privacy" className="text-sm hover:underline">
									Privacy Policy
								</a>
							</li>
							<li>
								<a href="/terms" className="text-sm hover:underline">
									Terms of Service
								</a>
							</li>
							<li>
								<a href="/shipping" className="text-sm hover:underline">
									Shipping & Returns
								</a>
							</li>
						</ul>
					</div>

					{/* Column 4: Follow Us */}
					<div>
						<h4 className="text-md font-semibold mb-3">Follow Us</h4>
						<div className="flex space-x-4">
							<a
								href="#"
								aria-label="Facebook"
								className="text-stone-600 hover:text-stone-900"
							>
								<FaFacebook size={20} />
							</a>
							<a
								href="#"
								aria-label="Twitter"
								className="text-stone-600 hover:text-stone-900"
							>
								<FaTwitter size={20} />
							</a>
						</div>
					</div>
				</div>

				{/* Separator Line */}
				<hr className="border-stone-300 mb-8" />

				{/* Bottom Copyright Section */}
				<div className="text-center">
					<p className="text-sm text-stone-600">
						© 2024 Hithabodha Book Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
