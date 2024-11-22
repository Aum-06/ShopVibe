import { React, useState } from "react";
import { motion } from "framer-motion";
import { Loader, Upload, PlusCircle } from "lucide-react";
import useProductStore from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "bags"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });
   const handleImageChange = (e) => {
       const file=e.target.files[0];
       if(file){
        const reader=new FileReader();
        reader.onloadend=()=>{
            setNewProduct({...newProduct,image:reader.result})
        }
        reader.readAsDataURL(file); //base64 
       }
   }

   const {createProduct,loading}=useProductStore();

  const handleSubmit =  (e) => {
    e.preventDefault();
    try {
        createProduct(newProduct);
        setNewProduct({
            name:"",description:"",price:"",category:"",image:""
        })
    } catch (error) {
        console.log(error);
    }
  };

  const inputClassName =
    "block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-400 text-sm transition-colors duration-200 outline-none";

  const labelClassName =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full sm:w-1/2 lg:w-1/3"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
          Create Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClassName}>
              Product Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className={inputClassName}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClassName}>
              Description
            </label>
            <textarea
              id="description"
              required
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className={`${inputClassName} resize-none`}
              placeholder="Description"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="price" className={labelClassName}>
              Price
            </label>
            <input
              type="number"
              id="price"
              required
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className={inputClassName}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClassName}>
              Category
            </label>
            <select
              id="category"
              required
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className={inputClassName}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="file"
              id="image"
              className="sr-only"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
            />
            <label
              htmlFor="image"
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
            >
              <Upload className="mr-2" size={20} aria-hidden="true" />
              Upload Image
            </label>
            {newProduct.image && (
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                Image Uploaded Successfully
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 mt-2 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader
                  className="animate-spin mr-2"
                  size={20}
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2" size={20} aria-hidden="true" />
                Create Product
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateProductForm;
