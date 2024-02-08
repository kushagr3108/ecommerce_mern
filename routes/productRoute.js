import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController } from "../controllers/productController.js";
import ExpressFormidable from "express-formidable";


const router = express.Router()

//routes

//create products
router.post('/create-product', requireSignIn, ExpressFormidable(), isAdmin, createProductController)

//update products
router.put('/update-product/:pid', requireSignIn, ExpressFormidable(), isAdmin, updateProductController)

//get products
router.get("/get-product", getProductController)

//get single product
router.get("/get-product/:slug", getSingleProductController)

//get photo
router.get("/product-photo/:pid", productPhotoController)

//delete produc
router.delete("/delete-product/:pid", deleteProductController)

export default router;