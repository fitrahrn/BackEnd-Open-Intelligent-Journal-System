import Contributors from "../models/ContributorsModel.js";
import User from "../models/UserModel.js";


export const getContributorsFromArticle = async(req, res) => {
    try {
        const response = await Contributors.findAll({
            where : {
                article_id: req.params.id
            },
            include:[{
                model:User,
                required: true,
                attributes:['user_id','name','email'],
            }],
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getContributorsFromUser = async(req, res) => {
    try {
        const response = await Contributors.findAll({
            where : {
                user_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getContributorsById = async(req, res) => {
    try {
        const response = await Contributors.findOne({
            where : {
                contributors_id : req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const addContributors = async(req,res) =>{
    const { article_id, user_id} = req.body;
    try{
        await Contributors.create({
            article_id: article_id,
            user_id: user_id
            
        });
        res.status(200).json({msg: "Contributors added successfully",
            data: {
                article_id: article_id,
                user_id: user_id
            }
        });
    } catch (error){
        res.status(500).json(error.message);
    }
}

export const updateContributors = async (req,res)=>{
    try {
        await Contributors.update(req.body, {
            where : {
                contributors_id : req.params.id
            }
        });
        res.status(200).json({msg: "Contributors updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Contributors failed to update"});
    }
}
export const deleteContributors= async(req, res) => {
    const contributors = await Contributors.findOne({
        where : {
            contributors_id : req.params.id
        }
    });
    if(!contributors) return res.status(404).json({msg : "No Contributors Found"});
    try {
        await Contributors.destroy({
            where : {
                Contributors_id : req.params.id
            }
        });
        res.status(200).json({msg : "Contributors Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 