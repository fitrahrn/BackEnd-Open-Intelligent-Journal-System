import path from "path"
import fs from "fs"
import Issue from "../models/IssueModel.js"
import Journal from "../models/JournalModel.js"
import User from "../models/UserModel.js"
import querystring from "querystring"


export const getIssueById = async(req, res) => {
    try {
        const response = await Issue.findOne({
            where : {
                issue_id : req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getIssueByVolumeNumber = async(req, res) => {
    try {
        const journalResponse = await Journal.findOne({
            where : {
                path : req.params.journal
            }
        });
        const response = await Issue.findOne({
            where : {
                [Op.and]:{
                    journal_id : journalResponse.dataValues.journal_id,
                    volume : req.params.volume,
                    number : req.params.number
                }
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getIssueByJournal = async(req, res) => {
    try {
        const journalResponse = await Journal.findOne({
            where : {
                path : req.params.journal
            }
        });
        const response = await Issue.findAll({
            where : {
                journal_id : journalResponse.dataValues.journal_id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const createIssue = async (req, res) => {
    const { volume,number,year,url_path} = req.body;
    if (!(volume && number &&year &&url_path)) return res.status(400).json({msg: "All input is required"});

    const findJournal = await Journal.findOne({
        where: {
            path: req.params.journal
        }
    });
    if (!findJournal) return res.status(409).json({msg: "Journal not found"});

    try {
        await Issue.create({
            journal_id: findJournal.dataValues.journal_id,
            volume:volume,
            number: number,
            year: year,
            date_published : "",
            url_path:url_path,
            appear: 0,
        });
        res.status(200).json({msg: "Issue created successfully",
            data: {
                journal_id: findJournal.dataValues.journal_id,
                volume:volume,
                number: number,
                year: year,
                date_published : "",
                url_path:url_path,
                appear: 0,
            }
        });
    } catch (error) {
        res.status(500).json({msg: "Issue failed to create"});
    }
}

export const updateIssue = async (req, res) => {

    try {
        await Issue.update(req.body, {
            where : {
                issue_id: req.params.id
            }
        });
        res.status(200).json({msg: "Issue updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Issue failed to update"});
    }
}

export const deleteIssue = async(req, res) => {
    const issue = await Issue.findOne({
        where : {
            issue_id : req.params.id
        }
    });
    if(!issue) return res.status(404).json({msg : "No Issue Found"});
    try {
        await Issue.destroy({
            where : {
                issue_id : req.params.id
            }
        });
        res.status(200).json({msg : "Issue Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
}