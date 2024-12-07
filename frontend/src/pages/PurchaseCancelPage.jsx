import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
	return (
		<div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-lg bg-white rounded-xl border border-gray-300 shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				{/* Icon and Message */}
				<div className="p-8 text-center">
					<XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
						Purchase Cancelled
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-300">
						Your order has been cancelled, and no charges have been made.
					</p>
				</div>

				{/* Help Message */}
				<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mx-5 mb-5">
					<p className="text-sm text-gray-500 text-center dark:text-gray-300">
						If you faced any issues during the checkout process, please contact our support team for
						assistance.
					</p>
				</div>

				{/* Button */}
				<div className="flex flex-col gap-4 px-5 pb-5">
					<Link
						to="/"
						className="flex items-center justify-center gap-2 px-5 py-3 font-medium text-blue-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
					>
						<ArrowLeft className="h-5 w-5" />
						Return to Shop
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
