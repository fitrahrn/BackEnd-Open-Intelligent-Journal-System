import ArticleFile from "../models/ArticleFileModel.js";
import { Op } from "sequelize";
import Article from "../models/ArticleModel.js";
import path from "path"
import fs from "fs"
import { Storage } from "@google-cloud/storage";
const storage = new Storage({
  projectId: "oijs-429910",
  keyFilename: "application_default_credentials.json",
});
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
        res.status(500).json(error.message);
    }
}



export const createArticleFile = async (req,res)=>{
    const { article_id} = req.body;
    if (!(article_id)) return res.status(400).json({msg: "All input is required"});
    const file = req.files.file;
    const fileSize = file.data.length;
    const extension = path.extname(file.name);
    const fileName = "Article-"+file.md5 + extension;
    const file_path = `https://storage.googleapis.com/oijs-bucket/public/articles/${fileName}`
    const allowedType = ['.pdf', '.doc', '.docx','.xml'];
    
    if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "invalid document format"});
    if(fileSize > 15000000) return res.status(422).json({msg : "Size of document must be less than 10 MB"});
    const article = await Article.findOne({
        where : {
            article_id : article_id
        }
    });
    if(!article) return res.status(404).json({msg : "No Article File Found"});
    file.mv(`./public/articles/${fileName}`, async (error) => {
        if (error) return res.status(500).json({ msg: error.message });
        
        try{
            const filepath=`./public/articles/${fileName}`;
            const gcs = storage.bucket("oijs-bucket"); // Removed "gs://" from the bucket name
            const storagepath = `public/articles/${fileName}`;
            const result = await gcs.upload(filepath, {
                destination: storagepath,
                predefinedAcl: 'publicRead', // Set the file to be publicly readable
                metadata: {
                    contentType: `application/pdf`, // Adjust the content type as needed
                }
            });
            await ArticleFile.create({
                article_id:article_id,
                article_path:file_path,
                phase:article.workflow_phase,
                
            });
            res.status(200).json({msg: "New article file added successfully",
                data: {
                    article_id:article_id,
                    article_path:file_path,
                    phase:article.workflow_phase,
                }
            });
        } catch (error) {
            res.status(500).json({msg: "article file failed to add"});
        }
    });
    
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
            article_id : req.params.id
        }
    });
    if(!articleFile) return res.status(404).json({msg : "No Article File Found"});
    try {
        await ArticleFile.destroy({
            where : {
                article_id : req.params.id
            }
        });
        res.status(200).json({msg : "Article File Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 