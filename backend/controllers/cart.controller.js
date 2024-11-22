import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
const addToCart=async(req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.user;
        let existingItem=user.cartItems.find(item=>item.product==productId);
        if(existingItem){
            existingItem.quantity+=1;
            await user.save();
            res.json({message:"Item quantity updated"});
        }else{
            user.cartItems.push({product:productId,quantity:1});
            await user.save();
            res.json({message:"Item added to cart"},user.cartItems);
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
}

const removeAllFromCart=async(req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.user;
        if(!productId){
            user.cartItems=[];
        }else{
            user.cartItems=user.cartItems.filter(item=>item.product!=productId);
        }
        await user.save();
        res.json({message:"Item removed from cart"},user.cartItems);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
}

const updateQuantity=async(req,res)=>{
    try {
        const{id:productId}=req.params;
        const {quantity}=req.body;
        const user=req.user;
        let existingItem=user.cartItems.find(item=>item.product==productId);
        if(existingItem){
            if(quantity==0){
                user.cartItems=user.cartItems.filter(item=>item.product!=productId);
                await user.save();
                return res.json({message:"Item removed from cart"},{cartItems:user.cartItems});
            }
            existingItem.quantity=quantity;
            await user.save();
            res.json({message:"Item quantity updated",cartItems:user.cartItems});
        }else{
            res.status(404).json({message:"Item not found"});
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const getCartProducts=async(req,res)=>{
    try {
        const products = await Product.find({
          _id: { $in: req.user.cartItems.map(id => mongoose.Types.ObjectId(id)) }
        });
        const cartItems=products.map(product=>{
            const item=req.user.cartItems.find(item=>item.product==product._id);
            return {...product,quantity:item.quantity};
        });
        res.json({cart:cartItems}); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export {addToCart,removeAllFromCart,updateQuantity,getCartProducts};