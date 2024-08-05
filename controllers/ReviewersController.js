import { DATE } from "sequelize";
import path from "path"
import fs from "fs"
import Reviewers from "../models/ReviewersModel.js";
import User from "../models/UserModel.js";
import Reviews from "../models/ReviewsModel.js";
import Article from "../models/ArticleModel.js";
import Journal from "../models/JournalModel.js";
import ReviewersFile from "../models/ReviewersFileModel.js";
import { Op } from "sequelize";
import { Storage } from "@google-cloud/storage";
const storage = new Storage({
  projectId: "oijs-429910",
  keyFilename: "application_default_credentials.json",
});
export const getReviewersFromUser = async(req, res) => {
    const username = req.cookies.username;
    try {
        const userResponse = await User.findOne({
            where : {
                username : username
            }
        })
        let response = await Reviewers.findAll({
            where : {
                user_id : userResponse.user_id
            },
            include:[{
                model:Reviews,
                required: true,
                include: [{
                    model:Article,
                    required: true,
                }],
            }],
        })
        response =  JSON.parse(JSON.stringify(response))

        for(let i=0;i<response.length;i++){
            const journalResponse = await Journal.findOne({
                where : {
                    journal_id: response[i].review.article.journal_id
                },

            });
            response[i].journal_title= journalResponse.title
        }
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
export const getReviewersFromReviewersId = async(req, res) => {
    
    try {
        const response = await Reviewers.findOne({
            where : {
                reviewers_id: req.params.id
            },
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getReviewersFromUserReviewers = async(req, res) => {
    const username = req.cookies.username;
    try {
        const response = await Reviewers.findOne({
            where : {
                reviews_id: req.params.id
            },
            include:[{
                model:User,
                required: true,
                attributes:['name','email'],
                where:{
                    username: username
                }
            }],
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const addReviewers = async (req,res)=>{
    const { reviews_id,user_id,date_assigned,date_due} = req.body;
    if (!(reviews_id && user_id && date_assigned && date_due)) return res.status(400).json({msg: "All input is required"});
    const reviewersResponse = await Reviewers.findOne({
        where : {
            [Op.and]:{
                reviews_id: reviews_id,
                user_id: user_id
            }
        }
    });
    if(reviewersResponse) return res.status(409).json({msg: "Reviewers already added"});
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
    const { reviewers_id, editor_review,author_review,recommendation,date_completed} = req.body;
    
    if(req.files){
        const file = req.files.file;
        const fileSize = file.data.length;
        const extension = path.extname(file.name);
        const fileName = "Review-"+file.md5 + extension;
        const file_path = `https://storage.googleapis.com/oijs-bucket/public/reviews/${fileName}`;
        const allowedType = ['.pdf', '.doc', '.docx','.xml'];
        const reviewers = await Reviewers.findOne({
            where : {
                reviewers_id : reviewers_id
            }
        });
        if(!reviewers) return res.status(404).json({msg : "No Reviewers Found"});
        if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "Invalid document format"});
        if(fileSize > 15000000) return res.status(422).json({msg : "Size of document must be less than 10 MB"});
        file.mv(`./public/reviews/${fileName}`, async (error) => {
            if (error) return res.status(500).json({ msg: error.message });
            
            try {
                const filepath=`./public/reviews/${fileName}`;
                const gcs = storage.bucket("oijs-bucket"); // Removed "gs://" from the bucket name
                const storagepath = `public/reviews/${fileName}`;
                const result = await gcs.upload(filepath, {
                    destination: storagepath,
                    predefinedAcl: 'publicRead', // Set the file to be publicly readable
                    metadata: {
                        contentType: `application/pdf`, // Adjust the content type as needed
                    }
                });
                await Reviewers.update({
                    editor_review:editor_review,
                    author_review:author_review,
                    recommendation: recommendation,
                    date_completed: date_completed,
                }, {
                    where : {
                        reviewers_id : reviewers_id
                    }
                });
                await ReviewersFile.create({
                    reviewers_id: reviewers_id,
                    reviewers_file: file_path
                })
                res.status(200).json({msg: "Reviewers updated",
                    data: req.body
                });
            } catch (error) {
                res.status(500).json({msg: "Reviewers failed to update",err:error.message});
            }
        });
    }
    else{
        const reviewers = await Reviewers.findOne({
            where : {
                reviewers_id : reviewers_id
            }
        });
        if(!reviewers) return res.status(404).json({msg : "No Reviewers Found"});
        try {
            await Reviewers.update({
                editor_review:editor_review,
                author_review:author_review,
                recommendation: recommendation,
                date_completed: date_completed,
            }, {
                where : {
                    reviewers_id: reviewers_id
                }
            });
            res.status(200).json({msg: "Reviewers updated",
                data: req.body
            });
        } catch (error) {
            res.status(500).json({msg: "Reviewers failed to update"});
        }
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