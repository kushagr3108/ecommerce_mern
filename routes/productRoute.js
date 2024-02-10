import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCountController, productFiltersController, productListController, productPhotoController, searchProductController, updateProductController } from "../controllers/productController.js";
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

//Filter product
router.post("/product-filters", productFiltersController)

//product count
router.get("/product-count", productCountController)

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);



export default router;