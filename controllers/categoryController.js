import categoryModels from "../models/categoryModels.js";
import slugify from "slugify";

export const createCategoryController = async(req,res) => {
    try{
        const {name} = req.body
        if(!name){
        return res.status(401).send({message:"Name is required"});
        }
        const existingCategory = await categoryModels.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: "Category already exixts",
            });
        }
        const category = await new categoryModels({name, slug:slugify(name)}).save();
        return res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in category"
        })

    }
};