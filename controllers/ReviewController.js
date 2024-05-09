import Reviews from "../models/ReviewsModel";

export const getReviews = async(req, res) => {
    try {
        const response = await Reviews.findAll(); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getReviewsFromArticleId = async(req, res) => {
    
    try {
        const response = await Reviews.findAll({
            where : {
                article_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
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
        const findPrevReviews = await Reviews.findAll({
            where : {
                article_id: req.params.id
            }
        });
        let review_rounds= 1;
        if (findPrevReviews){
            review_rounds = findPrevReviews.pop().dataValues.review_rounds++
        }  

        await Reviews.create({
            article_id:article_id,
            review_rounds: review_rounds,
            article_file_path : article_file_path,
            review_author: null,
            review_editor: null 
            
        });
        res.status(200).json({msg: "New review created successfully",
            data: {
                article_id:article_id,
                review_rounds: review_rounds,
                article_file_path : article_file_path,
                review_author: null,
                review_editor: null 
            }
        });
    } catch (error) {
        res.status(500).json({msg: "New review failed to create"});
    }
}
export const updateReviews = async (req,res)=>{
    try {
        await Reviews.update(req.body, {
            where : {
                reviews_id : req.params.id
            }
        });
        res.status(200).json({msg: "Jurnal updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Jurnal failed to update"});
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