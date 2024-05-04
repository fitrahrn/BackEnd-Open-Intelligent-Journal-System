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
        console.log(response.length)
        for(let i=0;i<response.length;i++){
            console.log(response[i].dataValues.article_id)
            const authorResponse = await Contributors.findAll({
                where : {
                    article_id : response[i].dataValues.article_id
                },
                include:[{
                    model:User,
                    required: true,
                    attributes:['name'],
                }],

            });
            //response.author = {}
            for(let j=0;j<authorResponse.length;j++){
                articles.push(authorResponse[j].dataValues.user.dataValues.name + ', ')
            }
            response[i].dataValues.authors = articles
            const issueResponse = await Issue.findOne({
                where : {
                    issue_id : response[i].dataValues.issue_id
                }
    
            });
            response[i].dataValues.year = issueResponse.dataValues.year
            response[i].dataValues.volume = issueResponse.dataValues.volume
            response[i].dataValues.issue = issueResponse.dataValues.number
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const createArticle = async (req, res) => {
    const { journalPath,prefix,title,subtitle,abstract,keywords} = req.body;
    if (!(name && username && email && password && confPassword)) return res.status(400).json({msg: "All input is required"});
    if (password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password don't match"});

    const findJournal = await Journal.findOne({
        where: {
            email: email
        }
    });
    if (oldUser) return res.status(409).json({msg: "User already exists"});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            name: name,
            public_name: public_name,
            username: username,
            email: email,
            password: hashPassword,
            phone: phone,
            orcid_id: orcid_id,
            affiliation: affiliation,
            mailing_address: mailing_address,
            signature:signature,
            country:country,
        });
        res.status(200).json({msg: "Registration Successful"});
    } catch (error) {
        res.status(500).json({msg: "Registration failed"});
    }
}

