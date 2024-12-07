import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommended");
				// Ensure the response is an array or extract the correct field
				const products = Array.isArray(res.data) ? res.data : res.data?.products || [];
				setRecommendations(products);
			} catch (error) {
				toast.error(
					error.response?.data?.message || "An error occurred while fetching recommendations"
				);
			}
		};

		fetchRecommendations();
	}, []);

	return (
		<div className="mt-8">
			<h3 className="text-2xl font-semibold text-blue-400">People Also Bought</h3>
			<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{recommendations.length > 0 ? (
					recommendations.map((product) => (
						<ProductCard key={product._id} product={product} />
					))
				) : (
					<p className="text-gray-400">No recommendations available.</p>
				)}
			</div>
		</div>
	);
};

export default PeopleAlsoBought;
