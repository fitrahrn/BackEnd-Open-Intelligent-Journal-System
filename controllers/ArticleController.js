import path from "path"
import { Op } from "sequelize";
import Article from "../models/ArticleModel.js"
import Journal from "../models/JournalModel.js"
import Issue from "../models/IssueModel.js"
import querystring from "querystring"
import Contributors from "../models/ContributorsModel.js";
import User from "../models/UserModel.js";

export const getArticles = async(req, res) => {
    try {
        const response = await Article.findAll(); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getArticleById = async(req, res) => {
    try {
        const response = await Article.findOne({
            where : {
                article_id : req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getArticlesByIssue = async(req, res) => {
    try {
        const journalResponse = await Journal.findOne({
            where : {
                path : req.params.journal
            }
        });
        const issueResponse = await Issue.findOne({
            where : {
                [Op.and]:{
                    volume : req.params.volume,
                    number : req.params.number
                }
            }
        });
        const response = await Article.findAll({
            where : {
                [Op.and]:{
                    issue_id : issueResponse.dataValues.issue_id,
                    journal_id : journalResponse.dataValues.journal_id
                }
                

            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getArticlesByJournal = async(req, res) => {
    try {
        const journalResponse = await Journal.findOne({
            where : {
                path : req.params.journal
            }
        });
        const response = await Article.findAll({
            where : {
                journal_id : journalResponse.dataValues.journal_id
            }

        });
        let articles = [];
        for(let i=0;i<response.length;i++){
            const authorResponse = await Contributors.findAll({
                include:User,
                where : {
                    article_id : response[i].dataValues.article_id
                }
            });
            console.log(authorResponse)
            //response[i].dataValues.authors = {}
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

