import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<AnalyticsCard
					title="Total Users"
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color="bg-blue-500"
				/>
				<AnalyticsCard
					title="Total Products"
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color="bg-green-500"
				/>
				<AnalyticsCard
					title="Total Sales"
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color="bg-purple-500"
				/>
				<AnalyticsCard
					title="Total Revenue"
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
					color="bg-yellow-500"
				/>
			</div>
			<motion.div
				className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-300 dark:border-gray-700"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Sales and Revenue</h2>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" stroke="#9CA3AF" />
						<YAxis yAxisId="left" stroke="#9CA3AF" />
						<YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
						<Tooltip />
						<Legend />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="sales"
							stroke="#3B82F6"
							activeDot={{ r: 8 }}
							name="Sales"
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="revenue"
							stroke="#10B981"
							activeDot={{ r: 8 }}
							name="Revenue"
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color, darkColor }) => (
	<motion.div
		className={`flex flex-col justify-between items-start p-5 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 ${color} dark:${darkColor}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className="flex items-center gap-4">
			<div
				className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 text-white rounded-full"
				style={{ color: "inherit" }}
			>
				<Icon className="w-6 h-6" />
			</div>
			<div>
				<p className="text-sm text-white font-medium">{title}</p>
				<h3 className="text-2xl font-bold text-white">{value}</h3>
			</div>
		</div>
	</motion.div>
);
