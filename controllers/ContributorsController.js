import path from "path"
import { Op } from "sequelize";
import Article from "../models/ArticleModel.js"
import Journal from "../models/JournalModel.js"
import Issue from "../models/IssueModel.js"
import querystring from "querystring"
import Contributors from "../models/ContributorsModel.js";
import User from "../models/UserModel.js";

export const getContributorsFromArticle = async(req, res) => {
    try {
        const response = await Contributors.findAll({
            where : {
                article_id: req.params.id
            }
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