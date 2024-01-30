import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoute.js"
import categoryRoute from './routes/categoryRoute.js'
import cors from "cors";

// configure env
dotenv.config();


//database config
connectDB();


const app = express()


// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", categoryRoute);

//rest api
app.get('/' , (req,res) => {
    res.send("<h1>Welcome to ecommerce app</h1>");
});

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () =>{
    console.log(`Server is running at port ${PORT}`.bgBlack.white);
})

