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