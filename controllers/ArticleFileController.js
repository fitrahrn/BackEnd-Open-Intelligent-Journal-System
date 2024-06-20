import ArticleFile from "../models/ArticleFileModel.js";
import { Op } from "sequelize";

export const getArticleFileFromArticleId = async(req, res) => {
    
    try {
        const response = await ArticleFile.findAll({
            where : {
                article_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getArticleFileFromPhase = async(req, res) => {
    const {phase} = req.body;
    try {
        const response = await ArticleFile.findAll({
            where : {
                [Op.and]:{
                    article_id: req.params.id,
                    phase : phase 
                }
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message);
    }
}



export const createArticleFile = async (req,res)=>{
    const { article_id,article_path,phase} = req.body;
    if (!(article_id)) return res.status(400).json({msg: "All input is required"});
    try{

        await ArticleFile.create({
            article_id:article_id,
            article_path:article_path,
            phase:phase
            
        });
        res.status(200).json({msg: "New article file added successfully",
            data: {
                article_id:article_id,
                article_path:article_path,
                phase:phase
            }
        });
    } catch (error) {
        res.status(500).json({msg: "article file failed to add"});
    }
}
export const updateArticleFile = async (req,res)=>{
    try {
        await ArticleFile.update(req.body, {
            where : {
                article_file_id : req.params.id
            }
        });
        res.status(200).json({msg: "Article file updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Article file failed to update"});
    }
}
export const deleteArticleFile= async(req, res) => {
    const articleFile = await ArticleFile.findOne({
        where : {
            article_file_id : req.params.id
        }
    });
    if(!articleFile) return res.status(404).json({msg : "No Article File Found"});
    try {
        await ArticleFile.destroy({
            where : {
                article_file_id : req.params.id
            }
        });
        res.status(200).json({msg : "Article File Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 