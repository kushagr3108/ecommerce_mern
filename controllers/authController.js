import {comparePassword, hashPassword} from "../helpers/authHelper.js";
import userModels from "../models/userModels.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try {
        const {name, email, password, phone, address} = req.body
        // validation
        if(!name)
        {
            return res.send({message: 'Name is required'})
        }
        if(!email)
        {
            return res.send({message: 'Email is required'})
        }
        if(!password)
        {
            return res.send({message: 'Password is required'})
        }
        if(!phone)
        {
            return res.send({message: 'Phone is required'})
        }
        if(!address)
        {
            return res.send({error: 'Address is required'})
        }

        // check user
        const existingUser = await userModels.findOne({email})

        //existing user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message: "Already registered, please login",
            })
        }

        //register user
        const hashedPassword = await hashPassword(password)

        //save
        const user = await new userModels({name, email, phone, address, password:hashedPassword}).save()

        res.status(201).send({
            success:true,
            message: "User registration successful.",
            user
        })


    } catch(error) {
        console.log(error)
        res.status(500).send ({
            success: false,
            message:'Error in registeration',
            error
        })
    }
};

//POST Login
export const loginController = async(req,res) => {
    try{
        const{email,password} = req.body

        //validation
        if(!email || !password)
        {
            res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        // Check if user is present
        const user = await userModels.findOne({email})
        if(!user)
        {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        } 
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            })
        }
        //Token
        const token = JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token,
        });
    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
};

//test controller
export const testController = (req,res) => {
    res.send("protected route");
};