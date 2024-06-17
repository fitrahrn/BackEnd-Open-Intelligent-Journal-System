import { DATE } from "sequelize";
import Reviewers from "../models/ReviewersModel.js";
import User from "../models/UserModel.js";
export const getReviewers = async(req, res) => {
    try {
        const response = await Reviewers.findAll(); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getReviewersFromReviewsId = async(req, res) => {
    
    try {
        const response = await Reviewers.findAll({
            where : {
                reviews_id: req.params.id
            },
            include:[{
                model:User,
                required: true,
                attributes:['name']
            }],
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getReviewersFromUserReviewers = async(req, res) => {
    
    try {
        const response = await Reviewers.findOne({
            where : {
                reviews_id: req.params.reviews_id,
                user_id: req.params.user_id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const addReviewers = async (req,res)=>{
    const { reviews_id,user_id,date_assigned,date_due} = req.body;
    if (!(reviews_id && user_id && date_assigned && date_due)) return res.status(400).json({msg: "All input is required"});
    try{

        await Reviewers.create({
            reviews_id: reviews_id,
            user_id:user_id,
            editor_review:null,
            author_review:null,
            recommendation: null,
            date_assigned: date_assigned,
            date_completed: null,
            date_due:date_due
            
        });
        res.status(200).json({msg: "New reviewers added successfully",
            data: {
                reviews_id: reviews_id,
                user_id:user_id,
                editor_review:null,
                author_review:null,
                recommendation: null,
                date_assigned: date_assigned,
                date_completed: null,
                date_due:date_due
            }
        });
    } catch (error) {
        res.status(500).json({msg: "Reviewers failed to add"});
    }
}
export const writeReviews = async (req,res)=>{
    const { reviewers_id, editor_review,author_review,recommendation} = req.body;
    
    const currentDate = new Date().toLocaleString('lt-LT').substring(0,10);
    try {
        await Reviewers.update({
            editor_review:editor_review,
            author_review:author_review,
            recommendation: recommendation,
            date_completed: currentDate,
        }, {
            where : {
                id : reviewers_id
            }
        });
        res.status(200).json({msg: "Reviewers updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Reviewers failed to update"});
    }
}
export const deleteReviewers= async(req, res) => {
    const eviewers = await Reviewers.findOne({
        where : {
            reviewers_id: req.params.id
        }
    });
    if(!eviewers) return res.status(404).json({msg : "No Reviewers Found"});
    try {
        await Reviewers.destroy({
            where : {
                reviewers_id : req.params.id
            }
        });
        res.status(200).json({msg : "Reviewers Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 