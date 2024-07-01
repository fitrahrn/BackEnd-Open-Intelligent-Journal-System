import path from "path"
import fs from "fs"
import { Op } from "sequelize";
import Article from "../models/ArticleModel.js"
import Journal from "../models/JournalModel.js"
import Issue from "../models/IssueModel.js"
import querystring from "querystring"
import Contributors from "../models/ContributorsModel.js";
import User from "../models/UserModel.js";

export const getArticleById = async(req, res) => {
    try {
        let response = await Article.findOne({
            where : {
                article_id : req.params.id
            },
            include:[{
                model:Journal,
                required: true,
                attributes: ['title']
            }],
        });
        response =  JSON.parse(JSON.stringify(response))
        let articles = [];
        const authorResponse = await Contributors.findAll({
            where : {
                article_id : response.article_id
            },
            include:[{
                model:User,
                required: true,
            }],

        });
        //response.author = {}
        for(let j=0;j<authorResponse.length;j++){
            articles.push(authorResponse[j].user)
        }
        response.authors = articles
        response.journal_title = response.journal.title
        const issueResponse = await Issue.findOne({
            where : {
                issue_id : response.issue_id
            }

        });
        response.year = issueResponse.year
        response.volume = issueResponse.volume
        response.issue = issueResponse.number
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getArticleByUser = async(req, res) => {
    const username = req.cookies.username;
    try {
        const userResponse = await User.findOne({
            where : {
                username : username
            }
        })
        let response = await Contributors.findAll({
            where : {
                user_id : userResponse.user_id
            },
            include:[{
                model:Article,
                required: true,
                order: [['journal_id', 'DESC']],
                
            }],
        });
        response =  JSON.parse(JSON.stringify(response))
        for(let i=0;i<response.length;i++){
            const journalResponse = await Journal.findOne({
                where : {
                    journal_id: response[i].article.journal_id
                },

            });
            response[i].journal_title= journalResponse.title
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getArticlesByTitle = async(req, res) => {
    const { title} = req.body;
    try {
        const response = await Article.findAll({
            where : {
                title : {
                    [Op.like] : `%${title}%`
                }
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
        if(!journalResponse) return res.status(409).json({msg: "Journal not found"});
        const issueResponse = await Issue.findOne({
            where : {
                [Op.and]:{
                    volume : req.params.volume,
                    number : req.params.number
                }
            }
        });
        if(!issueResponse) return res.status(409).json({msg: "Issue not found"});
        const response = await Article.findAll({
            where : {
                [Op.and]:{
                    issue_id : issueResponse.issue_id,
                    journal_id : journalResponse.journal_id
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
        if(!journalResponse) return res.status(409).json({msg: "Journal not found"});
        let response = await Article.findAll({
            where : {
                journal_id : journalResponse.journal_id
            }

        });
        response =  JSON.parse(JSON.stringify(response))
        
        for(let i=0;i<response.length;i++){
            let articles = [];
            const authorResponse = await Contributors.findAll({
                where : {
                    article_id : response[i].article_id
                },
                include:[{
                    model:User,
                    required: true,
                    attributes:['name'],
                }],

            });
            //response.author = {}
            for(let j=0;j<authorResponse.length;j++){
                if(j<authorResponse.length-1) articles.push(authorResponse[j].user.name + ', ')
                else articles.push(authorResponse[j].user.name)
            }
            response[i].authors = articles
            const issueResponse = await Issue.findOne({
                where : {
                    issue_id : response[i].issue_id
                }
    
            });
            response[i].year = issueResponse.year
            response[i].volume = issueResponse.volume
            response[i].issue = issueResponse.number
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const createArticle = async (req, res) => {
    const {prefix,title,subtitle,abstract,keywords,contributors} = req.body;
    if (!(title && abstract)) return res.status(400).json({msg: "All input is required"});
    const username = req.cookies.username;
    const checkTitle = await Article.findOne({
        where: {
            title: title
        }
    });
    if (checkTitle) return res.status(409).json({msg: "Article already exist"});

    const findJournal = await Journal.findOne({
        where: {
            path: req.params.journal
        }
    });
    if (!findJournal) return res.status(409).json({msg: "Journal not found"});
    const findUser = await User.findOne({
        where: {
            username: username
        }
    });
    if (!findUser) return res.status(409).json({msg: "User not found"});
    const findIssue = await Issue.findOne({
        where: {
            [Op.and]:{
                journal_id: findJournal.journal_id,
                date_published : {
                    [Op.lt]:'2001-01-02'
                },
                appear: false
            }
        }
    });
    
    const getAllArticle = await Article.findAll()
    const findLastArticle = getAllArticle !=null ?getAllArticle.pop().article_id : 0;
    if (!findIssue) return res.status(409).json({msg: "No unpublished issue found"});
    const file = req.files.file;
    const fileSize = file.data.length;
    const extension = path.extname(file.name);
    const fileName = "Article-"+file.md5 + extension;
    const file_path = `${req.protocol}://${req.get("host")}/articles/${fileName}`;
    const allowedType = ['.pdf', '.doc', '.docx','.xml'];
    
    if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "invalid document format"});
    if(fileSize > 15000000) return res.status(422).json({msg : "Size of document must be less than 10 MB"});
    file.mv(`./public/articles/${fileName}`, async (error) => {
        if (error) return res.status(500).json({ msg: error.message });
        try {
            const article = await Article.create({
                article_id: findLastArticle+1,
                journal_id : findJournal.journal_id,
                issue_id : findIssue.issue_id,
                prefix: prefix,
                title: title,
                subtitle : subtitle,
                abstract : abstract,
                article_path : file_path,
                comment : "",
                keywords : keywords,
                workflow_phase: "submitted",
                status: "not reviewed"
            });
            await Contributors.create({
                article_id: article.article_id,
                user_id: findUser.user_id,
            })
            if(contributors !== "0"){
                await Contributors.create({
                    article_id: article.article_id,
                    user_id: contributors,
                })
            }
            res.status(200).json({msg: "Article created successfully",
                data: {
                    article_id: findLastArticle+1,
                    journal_id : findJournal.journal_id,
                    issue_id : findIssue.issue_id,
                    prefix: prefix,
                    title: title,
                    subtitle : subtitle,
                    abstract : abstract,
                    comment : "",
                    keywords : keywords,
                    workflow_phase: "submitted",
                    status: "not reviewed"
                }
            });
        } catch (error) {
            res.status(500).json({msg: "Article failed to create",error:error.message});
        }
    });
    
}
export const updateArticle = async (req, res) => {
    const article = await Article.findOne({
        where : {
            article_id : req.params.id
        }
    });
    if(!article) return res.status(404).json({msg : "No Article Found"});
    let article_path = article.article_path
    const article_path_split = article_path.split("/");
    let fileName = ""

    if(req.files === null) {
        fileName = article_path_split[article_path_split.length - 1]
    } else {
        // user mengupload song baru
        // buat nama file (md5) baru juga
        const file = req.files.file;
        const fileSize = file.data.length;
        const extension = path.extname(file.name);
        const fileName = "Article-"+file.md5 + extension;
        const allowedType = ['.pdf', '.doc', '.docx','.xml'];
        
        // validasi
        if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "invalid document format"});
        if(fileSize > 15000000) return res.status(422).json({msg : "Size of document must be less than 10 MB"});
        // hapus yang lama
        if(article_path_split[article_path_split.length - 1] != ''){
            const filepath = `./public/articles/${article_path_split[article_path_split.length - 1]}`;
            fs.unlinkSync(filepath);
        }

        // terima jurnalnya masukkan ke public
        file.mv(`./public/articles/${fileName}`, (error) => {
            if (error) return res.status(500).json({ msg: error.message });
        });
        article_path = `${req.protocol}://${req.get("host")}/articles/${fileName}`;
    }
    try {
        await Article.update({
            prefix: req.body.prefix,
            title: req.body.title,
            subtitle : req.body.subtitle,
            abstract : req.body.abstract,
            article_path : article_path,
            comment :req.body.comment,
            keywords : req.body.keywords,
            workflow_phase: req.body.workflow_phase,
            status: req.body.status
        }, {
            where : {
                article_id: req.params.id
            }
        });
        res.status(200).json({msg: "Article updated",
            data: {
                prefix: req.body.prefix,
                title: req.body.title,
                subtitle : req.body.subtitle,
                abstract : req.body.abstract,
                comment :req.body.comment,
                keywords : req.body.keywords,
                workflow_phase: req.body.workflow_phase,
                status: req.body.status
            }
        });
    } catch (error) {
        res.status(500).json({msg: "Article failed to update",error:error.message});
    }
}

export const deleteArticle = async(req, res) => {
    const article = await Article.findOne({
        where : {
            article_id : req.params.id
        }
    });
    if(!article) return res.status(404).json({msg : "No Article Found"});
    try {
        await Article.destroy({
            where : {
                article_id : req.params.id
            }
        });
        res.status(200).json({msg : "Article Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
}
