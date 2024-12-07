import { ArrowRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import  useCartStore  from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payments/checkout-success", {
					sessionId,
				});
				clearCart();
			} catch (error) {
				console.log(error);
				setError("Failed to complete the checkout process.");
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL.");
		}
	}, [clearCart]);

	if (isProcessing) {
		return (
			<div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<p className="text-lg font-medium text-gray-700 dark:text-gray-300">
					Processing your order...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<p className="text-lg text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={600}
				recycle={false}
			/>

			<div className="w-full max-w-lg bg-white rounded-xl border border-gray-300 shadow-lg dark:border-gray-700 dark:bg-gray-800 transition-shadow duration-300">
				{/* Icon and Message */}
				<div className="p-8 text-center">
					<CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
						Purchase Successful!
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-300">
						Thank you for your order. We're processing it now.
					</p>
					<p className="mt-1 text-sm text-green-500">
						Check your email for order details and updates.
					</p>
				</div>

				{/* Order Summary */}
				<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mx-5 mb-5">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-gray-500 dark:text-gray-400">Order number</span>
						<span className="text-sm font-medium text-green-600 dark:text-green-400">#12345</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-500 dark:text-gray-400">Estimated delivery</span>
						<span className="text-sm font-medium text-green-600 dark:text-green-400">
							3-5 business days
						</span>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex flex-col gap-4 px-5 pb-5">
					<button className="flex items-center justify-center gap-2 px-5 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800">
						Thanks for trusting us!
					</button>
					<Link
						to="/"
						className="flex items-center justify-center gap-2 px-5 py-3 font-medium text-blue-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
					>
						Continue Shopping
						<ArrowRight className="h-5 w-5" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;
