import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoute.js"
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js'
import cors from "cors";
import path from "path";
import {fileURLToPath} from 'url' ;

// configure env
dotenv.config();


//database config
connectDB();

//
const __filename = fileURLToPath (import.meta.url);
const __dirname = path.dirname(__filename);



const app = express()


// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute)

//rest api
app.use("*", function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () =>{
    console.log(`Server is running at port ${PORT}`.bgBlack.white);
})

