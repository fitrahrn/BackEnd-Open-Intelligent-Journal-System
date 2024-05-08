import ReviewersFile from "../models/ReviewersFileModel";

export const getReviewersFile = async(req, res) => {
    try {
        const response = await ReviewersFile.findAll(); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getReviewersFileFromReviewersId = async(req, res) => {
    
    try {
        const response = await ReviewersFile.findAll({
            where : {
                reviewers_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}


export const createReviewersFile = async (req,res)=>{
    const { reviewers_id,reviewers_file} = req.body;
    try{

        await ReviewersFile.create({
            reviewers_id:reviewers_id,
            reviewers_file:reviewers_file
            
        });
        res.status(200).json({msg: "New reviewers file added successfully",
            data: {
                reviewers_id:reviewers_id,
                reviewers_file:reviewers_file
            }
        });
    } catch (error) {
        res.status(500).json({msg: "reviewers file failed to add"});
    }
}
export const updateReviewersFile = async (req,res)=>{
    try {
        await ReviewersFile.update(req.body, {
            where : {
                reviewers_file_id : req.params.id
            }
        });
        res.status(200).json({msg: "Reviewers file updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Reviewers file failed to update"});
    }
}
export const deleteReviewersFile= async(req, res) => {
    const reviewersFile = await ReviewersFile.findOne({
        where : {
            reviewers_file_id : req.params.id
        }
    });
    if(!reviewersFile) return res.status(404).json({msg : "No Reviewers File Found"});
    try {
        await ReviewersFile.destroy({
            where : {
                reviewers_file_id : req.params.id
            }
        });
        res.status(200).json({msg : "Reviewers File Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 