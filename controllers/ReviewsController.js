import Article from "../models/ArticleModel.js";
import ReviewersFile from "../models/ReviewersFileModel.js";
import Reviewers from "../models/ReviewersModel.js";
import Reviews from "../models/ReviewsModel.js";
import User from "../models/UserModel.js";

export const getReviewsFromArticleId = async(req, res) => {
    try {
        let response = await Reviews.findAll({
            where : {
                article_id: req.params.id
            },
            include:[{
                model:Reviewers,
                include:[{
                    model:User,

                    attributes:["user_id","name"]
                }]
            }]
        }); // seluruh atribut same as SELECT * FROM
        response =  JSON.parse(JSON.stringify(response))
        for(let i=0;i<response.length;i++){
            //response.author = {}
            for(let j=0;j<response[i].reviewers.length;j++){
                let reviewersFile= await ReviewersFile.findOne({
                    where:{
                        reviewers_id:response[i].reviewers[j].reviewers_id
                    }
                })
                if(reviewersFile){
                    reviewersFile =  JSON.parse(JSON.stringify(reviewersFile))
                    response[i].reviewers[j].reviewers_file = reviewersFile.reviewers_file
                }
                else response[i].reviewers[j].reviewers_file=""
            }
            
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message);
    }
}

export const getReviewFromReviewRounds = async(req, res) => {
    
    try {
        const response = await Reviews.findOne({
            where : {
                article_id: req.params.id,
                review_rounds: req.params.rounds
            }
        }); // seluruh atribut same as SELECT * FROM
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const createReviews = async (req,res)=>{
    const { article_id,article_file_path} = req.body;
    if (!(article_id)) return res.status(400).json({msg: "All input is required"});
    try{
        let findPrevReviews = await Reviews.findAll({
            where : {
                article_id: article_id
            }
        });
        let reviewRounds= 1;
        console.log(findPrevReviews)
        if (findPrevReviews.length>0){
            findPrevReviews =  JSON.parse(JSON.stringify(findPrevReviews))
            reviewRounds = findPrevReviews.pop().review_rounds +1
        }

        await Reviews.create({
            article_id:article_id,
            review_rounds: reviewRounds,
            article_file_path : article_file_path,
        });
        res.status(200).json({msg: "New review created successfully",
            data: {
                article_id:article_id,
                review_rounds: reviewRounds,
                article_file_path : article_file_path, 
            }
        });
    } catch (error) {
        res.status(500).json({msg: "New review failed to create",err:error.message});
    }
}
export const updateReviews = async (req,res)=>{
    try {
        await Reviews.update(req.body, {
            where : {
                reviews_id : req.params.id
            }
        });
        res.status(200).json({msg: "Review updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Review failed to update"});
    }
}
export const deleteReviews= async(req, res) => {
    const reviews = await Reviews.findOne({
        where : {
            reviews_id : req.params.id
        }
    });
    if(!reviews) return res.status(404).json({msg : "No Reviews Found"});
    try {
        await Reviews.destroy({
            where : {
                reviews_id : req.params.id
            }
        });
        res.status(200).json({msg : "Reviews Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 