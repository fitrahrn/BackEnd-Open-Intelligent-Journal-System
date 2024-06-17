import { DATE } from "sequelize";
import Role from "../models/RoleModel.js";
import User from "../models/UserModel.js";
import Journal from "../models/JournalModel.js";
import { Op } from "sequelize";
export const getRoles = async(req, res) => {
    try {
        const response = await Role.findAll(); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getRoleFromJournal = async(req, res) => {
    const findJournal = await Journal.findOne({
        where: {
            path: req.params.path
        }
    });
    try {
        const response = await Role.findAll({
            where : {
                journal_id: findJournal.dataValues.journal_id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getReviewersFromJournal = async(req, res) => {
    const findJournal = await Journal.findOne({
        where: {
            path : req.params.path,
        },

    });
    try {
        const response = await Role.findAll({
            where : {
                [Op.and]:{
                    journal_id: findJournal.dataValues.journal_id,
                    reviewer : true
                }
            },
            include:[{
                model:User,
                required: true,
                attributes:['name','user_id']
            }],
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message);
    }
}
export const getAuthorFromJournal = async(req, res) => {
    const findJournal = await Journal.findOne({
        where: {
            path : req.params.path,
        }
    });
    try {
        const response = await Role.findAll({
            where : {
                [Op.and]:{
                    journal_id: findJournal.dataValues.journal_id,
                    author : true
                }
                
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getEditorFromJournal = async(req, res) => {
    const findJournal = await Journal.findOne({
        where: {
            path : req.params.path,
        }
    });
    try {
        const response = await Role.findAll({
            where : {
                [Op.and]:{
                    journal_id: findJournal.dataValues.journal_id,
                    editor : true
                }
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getRoleFromUser = async(req, res) => {
    
    try {
        const response = await Role.findOne({
            where : {
                user_id: req.params.user_id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const addRole = async (req,res)=>{
    const { username, path} = req.body;
    if (!(username && path)) return res.status(400).json({msg: "All input is required"});
    try{
        const findUser = await User.findOne({
            where: {
                username: username
            }
        });
        if (!findUser) return res.status(409).json({msg: "User not found"});
        
        const findJournal = await Journal.findOne({
            where: {
                path: path
            }
        });
        if (!findJournal) return res.status(409).json({msg: "Journal not found"});

        await Role.create({
            user_id: findUser.dataValues.user_id,
            journal_id: findJournal.dataValues.journal_id,
            administrator: false,
            lead_editor:false,
            reviewer: false,
            author:false,
            reader:true
        });
        res.status(200).json({msg: "New Role added successfully",
            data: {
                user_id: findUser.dataValues.user_id,
                journal_id: findJournal.dataValues.journal_id,
                administrator: false,
                lead_editor:false,
                reviewer: false,
                author:false,
                reader:true
            }
        });
    } catch (error) {
        res.status(500).json({msg: "Role failed to add"});
    }
}
export const updateRole = async (req,res)=>{
    const username = req.cookies.username;
    try {
        const findUser = await User.findOne({
            where: {
                username: username
            }
        });
        if (!findUser) return res.status(409).json({msg: "User not found"});
        
        const findJournal = await Journal.findOne({
            where: {
                path: req.params.path
            }
        });
        if (!findJournal) return res.status(409).json({msg: "Journal not found"});
        await Role.update({
            user_id: findUser.dataValues.user_id,
            journal_id: findJournal.dataValues.journal_id,
            administrator:req.body.administrator,
            lead_editor:req.body.lead_editor,
            editor:req.body.editor,
            reviewer:req.body.reviewer,
            author:req.body.author,
            reader:req.body.reader
        }, {
            where : {
                role_id : req.params.id
            }
        });
        res.status(200).json({msg: "Role updated",
            data: {
                user_id: findUser.dataValues.user_id,
                journal_id: findJournal.dataValues.journal_id,
                administrator:req.body.administrator,
                lead_editor:req.body.lead_editor,
                editor:req.body.editor,
                reviewer:req.body.reviewer,
                author:req.body.author,
                reader:req.body.reader
            }
        });
    } catch (error) {
        res.status(500).json({msg: "Role failed to update"});
    }
}
export const deleteRole= async(req, res) => {
    const eviewers = await Role.findOne({
        where : {
            Role_id: req.params.id
        }
    });
    if(!eviewers) return res.status(404).json({msg : "No Role Found"});
    try {
        await Role.destroy({
            where : {
                Role_id : req.params.id
            }
        });
        res.status(200).json({msg : "Role Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 