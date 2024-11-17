import Product from "../models/product.model.js";
import  {redis} from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";

const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_Products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Error updating featured products cache:", error);
    throw error; // Propagate error to caller
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    return res.json({ success: true, products });
  } catch (error) {
    console.error("Error in getting all products:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_Products");
    
    if (featuredProducts) {
      return res.json({ 
        success: true, 
        featuredProducts: JSON.parse(featuredProducts) 
      });
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    
    if (!featuredProducts?.length) {
      return res.status(404).json({
        success: false,
        message: "No featured products found",
      });
    }

    await redis.set("featured_Products", JSON.stringify(featuredProducts));
    return res.json({
      success: true,
      featuredProducts,
    });
  } catch (error) {
    console.error("Error in getting featured products:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    let cloudinaryResponse = null;
    if (image) {
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      } catch (cloudinaryError) {
        console.error("Error uploading image to Cloudinary:", cloudinaryError.message);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url || "",
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error in creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from cloudinary:", error);
      }
    }

    await Product.findByIdAndDelete(id);

    // If it was a featured product, update the cache
    if (product.isFeatured) {
      await updateFeaturedProductsCache();
    }

    return res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          description: 1,
          price: 1,
        },
      },
    ]);

    return res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error("Error in getting recommended products:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required",
      });
    }

    const products = await Product.find({ category }).lean();
    return res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.error("Error in getting products by category:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    
    await updateFeaturedProductsCache();

    return res.status(200).json({ 
      success: true,
      message: "Product featured status updated", 
      product: updatedProduct 
    });
  } catch (error) {
    console.error("Error in toggling featured status:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
};