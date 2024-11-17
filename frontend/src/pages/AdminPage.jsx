import {React,useState} from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, ShoppingBasket, BarChart } from 'lucide-react'
import CreateProductForm from '../components/CreateProductForm';
import ProductsList from '../components/ProductList';
import AnalyticsTab from '../components/AnalyticsTab';

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 pt-24 bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="sm:mx-auto sm:w-full sm:max-w-md mb-6"
      >
        <motion.h2 
          variants={item}
          className="text-3xl mt-4 font-extrabold text-center text-gray-900 dark:text-white"
        >
          Admin Dashboard
        </motion.h2>
        
        <motion.div 
          variants={container}
          className="flex flex-wrap sm:flex-nowrap gap-4 mt-4 justify-center items-center"
        >
          {tabs.map((tab) => (
            <motion.button
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-2 whitespace-nowrap"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
      {activeTab === "create" && <CreateProductForm />} 
      {activeTab === "products" && <ProductsList />}      
      {activeTab === "analytics" && <AnalyticsTab />}
    </div>
  )
}

export default AdminPage