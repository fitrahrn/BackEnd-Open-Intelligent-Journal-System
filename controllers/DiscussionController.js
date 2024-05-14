import Discussion from "../models/DiscussionModel";
import Reviews from "../models/ReviewsModel";


export const getDiscussionFromReviewsId = async(req, res) => {
    
    try {
        const response = await Discussion.findAll({
            where : {
                reviews_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}


export const createDiscussion = async (req,res)=>{
    const { reviews_id,subject,file_path} = req.body;
    if (!(reviews_id && subject)) return res.status(400).json({msg: "All input is required"});
    
    try{
        const checkReviews = await Reviews.findOne({
            where: {
                reviews_id: reviews_id
            }
        });
        if (!checkReviews) return res.status(409).json({msg: "Reviews id doesn't exist"});
    
        
        await Discussion.create({
            reviews_id:reviews_id,
            subject: subject,
            file_path: file_path
            
        });
        res.status(200).json({msg: "New discussion created successfully",
            data: {
                reviews_id:reviews_id,
                subject: subject,
                file_path: file_path
            }
        });
    } catch (error) {
        res.status(500).json({msg: "New discussion failed to create"});
    }
}
export const updateDiscussion = async (req,res)=>{
    try {
        await Discussion.update(req.body, {
            where : {
                discussion_id : req.params.id
            }
        });
        res.status(200).json({msg: "Discussion updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Discussion failed to update"});
    }
}
export const deleteDiscussion= async(req, res) => {
    const discussion = await Discussion.findOne({
        where : {
            discussion_id : req.params.id
        }
    });
    if(!discussion) return res.status(404).json({msg : "No Discussion Found"});
    try {
        await Discussion.destroy({
            where : {
                discussion_id : req.params.id
            }
        });
        res.status(200).json({msg : "Discussion Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 