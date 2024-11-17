import Coupon from "../models/coupon.model.js"

const getCoupon = async (req, res) => {
    try {
        const coupon=await Coupon.findOne({userId:req.user._id,isActive:true});
        res.json(coupon||null);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const validateCoupon = async (req, res) => {
    try {
        const {code}=req.body;
        const coupon=await Coupn.findOne({code:code,userId:req.user._id,isActive:true});
        if(!coupon){
            return res.status(400).json({message:"Invalid Coupon"});
        }
        if(coupon.expirationDate<new Date()){
            coupon.isActive=false;
            return res.status(400).json({message:"Coupon Expired"});
        }
        res.json({
            code:coupon.code,
            discountPercentage:coupon.discountPercentage,
            message:"Coupon Valid"
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export { getCoupon, validateCoupon };