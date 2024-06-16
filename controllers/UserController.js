// setelah membuat model, dilanjutkan membuat controller
// source : https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
import User from "../models/UserModel.js";
import { Op } from "sequelize";
export const getUserId = async(req, res) => {
    try {
        const response = await User.findOne({
            where : {
                email: req.params.id
            }
        });
        res.status(200).json(response["user_id"]); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getUserByUsername = async(req, res) => {
    try {
        const response = await User.findOne({
            where : {
                username: req.params.username
            }
        });
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getUserByEmail = async(req, res) => {
    try {
        const response = await User.findOne({
            where : {
                email: req.params.email
            }
        });
        res.status(200).json(response); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getUserWithoutItself = async(req, res) => {
    const username = req.cookies.username;
    try {
        const response = await User.findAll({
            where : {
                username :{ [Op.ne]: username } 
            }
        });
        res.status(200).json(response); 
        
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const findUserByName = async(req, res) => {
    const { title} = req.body;
    try {
        const response = await User.findAll({
            where : {
                name : {
                    [Op.like] : `%${title}%`
                }
            }
        });
        res.status(200).json(response["user_id"]); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}

