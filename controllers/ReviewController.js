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
export const createReviews = async (req,res)=>{
    const { article_id,article_file_path} = req.body;
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