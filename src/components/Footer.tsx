import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// We'll use react-icons for the Facebook and Twitter logos
// Install with: npm install react-icons
import { FaFacebook, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import { getSocialLinksThunk } from "../redux/slice/authSlice";
import logo from "../assets/images/hita.png";

const Footer: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { socialLinks } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		dispatch(getSocialLinksThunk());
	}, [dispatch]);

	return (
		<footer className="bg-primary/20 text-stone-700 py-12 px-4 md:pl-8">
			<div className="container mx-auto">
				{/* Top section with columns */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					{/* Column 1: Brand Info */}
					<div className="flex flex-col items-center text-center">
						<div className="flex flex-col items-center gap-2 mb-3">
							<div className="size-16">
								<img src={logo} alt="Hithabodha Logo" className="w-full h-full object-contain mix-blend-multiply rounded-full" />
							</div>
							<h3 className="text-xl font-bold">Hithabodha Book Store</h3>
						</div>
						<p className="text-sm">
							Your destination for curated books and literary wonders.
						</p>
					</div>

					{/* Column 2: Quick Links */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left">
						<h4 className="text-md font-semibold mb-3">Quick Links</h4>
						<ul className="space-y-2">
							<li>
								<Link to="/" className="text-sm hover:underline">
									Home
								</Link>
							</li>
							<li>
								<Link to="/about" className="text-sm hover:underline">
									About Us
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-sm hover:underline">
									Contact
								</Link>
							</li>
							<li>
								<Link to="/faq" className="text-sm hover:underline">
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Policies */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left">
						<h4 className="text-md font-semibold mb-3">Policies</h4>
						<ul className="space-y-2">
							<li>
								<Link to="/privacy" className="text-sm hover:underline">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to="/terms" className="text-sm hover:underline">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link to="/shipping" className="text-sm hover:underline">
									Shipping & Returns
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 4: Follow Us */}
					<div className="flex flex-col items-center md:items-start text-center md:text-left">
						<h4 className="text-md font-semibold mb-3">Follow Us</h4>
						<div className="flex space-x-4 justify-center md:justify-start">
							{socialLinks?.facebook && (
								<a
									href={socialLinks.facebook}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Facebook"
									className="text-stone-600 hover:text-stone-900"
								>
									<FaFacebook size={26} />
								</a>
							)}
							{socialLinks?.twitter && (
								<a
									href={socialLinks.twitter}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Twitter"
									className="text-stone-600 hover:text-stone-900"
								>
									<FaTwitter size={26} />
								</a>
							)}
							{socialLinks?.youtube && (
								<a
									href={socialLinks.youtube}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="YouTube"
									className="text-stone-600 hover:text-stone-900"
								>
									<FaYoutube size={26} />
								</a>
							)}
							{socialLinks?.whatsapp && (
								<a
									href={socialLinks.whatsapp}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="WhatsApp"
									className="text-stone-600 hover:text-stone-900"
								>
									<FaWhatsapp size={26} />
								</a>
							)}
						</div>
					</div>
				</div>

				{/* Separator Line */}
				<hr className="border-stone-300 mb-8" />

				{/* Bottom Copyright Section */}
				<div className="text-center">
					<p className="text-sm text-stone-600">
						© {new Date().getFullYear()} Hithabodha Book Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
