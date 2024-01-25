import {comparePassword, hashPassword} from "../helpers/authHelper.js";
import userModels from "../models/userModels.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try {
        const {name, email, password, phone, address, answer} = req.body
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
        if(!answer)
        {
            return res.send({error: 'Answer is required'})
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
        const user = await new userModels({name, email, phone, address, password:hashedPassword, answer}).save();

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
                address: user.address,
                role: user.role
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

export const forgotPasswordController = async(req,res) => {
    try{
        const {email, answer, newPassword} = req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'Answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'New password is required'})
        }
        const user = await userModels.findOne({email,answer})
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Invalid email or answer"
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModels.findByIdAndUpdate(user._id, {password : hashed});
        res.status(200).send({
            success : true,
            message : "Password changed successfuly"
        });

    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error

        })

    }
};

//test controller
export const testController = (req,res) => {
    res.send("protected route");
};