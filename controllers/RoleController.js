import { DATE } from "sequelize";
import Role from "../models/RoleModel.js";
import User from "../models/UserModel.js";
import Journal from "../models/JournalModel.js";
import { Op } from "sequelize";
export const getRolesRequest = async(req, res) => {
    try {
        let response = await Role.findAll({
            where : {
                request :{ [Op.ne]: null } 
            },
            include:[{
                model:User,
                attributes: ["user_id","name"],
            }],
            
        }); // seluruh atribut same as SELECT * FROM
        response =  JSON.parse(JSON.stringify(response))
        for(let i=0;i<response.length;i++){
            const journalResponse = await Journal.findOne({
                where : {
                    journal_id: response[i].journal_id
                },

            });
            response[i].journal_title= journalResponse.title
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getReviewersFromJournal = async(req, res) => {
    
    try {
        const findJournal = await Journal.findOne({
            where: {
                path : req.params.path,
            },
    
        });
        const response = await Role.findAll({
            where : {
                [Op.and]:{
                    journal_id: findJournal.journal_id,
                    reviewer : true
                }
            },
            include:[{
                model:User,
                required: true,
                attributes:['name','user_id','email']
            }],
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getRoleFromUser = async(req, res) => {
    const username = req.cookies.username;
    try {
        const findUser = await User.findOne({
            where: {
                username: username
            }
        });
        if (!findUser) return res.status(409).json({msg: "User not found"});
        const response = await Role.findAll({
            where : {
                user_id: findUser.user_id
            },
            include:[{
                model:Journal,
                required: true,
                attributes: ["journal_id","title","path"]
            }],
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const addRole = async (req,res)=>{
    const { journal_id} = req.body;
    const username = req.cookies.username;
    if (!(username && journal_id)) return res.status(400).json({msg: "All input is required"});
    try{
        const findUser = await User.findOne({
            where: {
                username: username
            }
        });
        if (!findUser) return res.status(409).json({msg: "User not found"});
        

        await Role.create({
            user_id: findUser.user_id,
            journal_id: journal_id,
            administrator: false,
            lead_editor:false,
            reviewer: false,
            author:false,
            reader:true
        });
        res.status(200).json({msg: "New Role added successfully",
            data: {
                user_id: findUser.user_id,
                journal_id: journal_id,
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
            user_id: findUser.user_id,
            journal_id: findJournal.journal_id,
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
                user_id: findUser.user_id,
                journal_id: findJournal.journal_id,
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
export const requestRoles = async (req,res)=>{
    const username = req.cookies.username;
    const {  journal_id,request } = req.body;
    try {
        const findUser = await User.findOne({
            where: {
                username: username
            }
        });
        if (!findUser) return res.status(409).json({msg: "User not found"});
        const findRole = await Role.findOne({
            where: {
                [Op.and]:{
                    user_id : findUser.user_id,
                    journal_id : journal_id
                }
            }
        });
        if (!findRole) return res.status(409).json({msg: "Role not found"});
        if (findRole.request) return res.status(409).json({msg: "User already have role request"});
        if (request==="administrator" && findRole.administrator=== true) return res.status(409).json({msg: "User already have the role"});
        if (request==="lead_editor" && findRole.lead_editor=== true) return res.status(409).json({msg: "User already have the role"});
        if (request==="editor" && findRole.editor=== true) return res.status(409).json({msg: "User already have the role"});
        if (request==="reviewer" && findRole.reviewer=== true) return res.status(409).json({msg: "User already have the role"});
        if (request==="author" && findRole.author=== true) return res.status(409).json({msg: "User already have the role"});
        await Role.update({
            request: request
        }, {
            where : {
                role_id : findRole.role_id
            }
        });
        res.status(200).json({msg: "Role updated",
            data: {
                user_id: findUser.user_id,
                journal_id: journal_id,
                request: request
            }
        });
    } catch (error) {
        res.status(500).json({msg: "Role request failed to update"});
    }
}
export const answerRequestRoles = async (req,res)=>{
    const {  role_id, accept} = req.body;
    try {
        const findRole = await Role.findOne({
            where: {
                role_id:role_id
            }
        });
        if (!findRole) return res.status(409).json({msg: "Role not found"});
        if (!findRole.request) return res.status(409).json({msg: "User don't have role request"});
        if (accept ===false){
            await Role.update({
                request:null
            }, {
                where : {
                    role_id : role_id
                }
            });
            res.status(200).json({msg: "Role updated",
                data: {
                    request:null
                }
            });
        }
        else if(accept ===true && findRole.request==="lead_editor"){
            await Role.update({
                lead_editor:true,
                request:null
                
            }, {
                where : {
                    role_id : role_id
                }
            });
            res.status(200).json({msg: "Role updated",
                data: {
                    lead_editor:true,
                    request:null
                }
            });
        }
        else if(accept ===true && findRole.request==="editor"){
            await Role.update({
                editor:true,
                request:null
            }, {
                where : {
                    role_id : role_id
                }
            });
            res.status(200).json({msg: "Role updated",
                data: {
                    editor:true,
                    request:null
                }
            });
        }
        else if(accept ===true && findRole.request==="reviewer"){
            await Role.update({
                reviewer:true,
                request:null
            }, {
                where : {
                    role_id : role_id
                }
            });
            res.status(200).json({msg: "Role updated",
                data: {
                    reviewer:true,
                    request:null
                }
            });
        }
        else if(accept ===true && findRole.request==="author"){
            await Role.update({
                author:true,
                request:null
            }, {
                where : {
                    role_id : role_id
                }
            });
            res.status(200).json({msg: "Role updated",
                data: {
                    author:true,
                    request:null
                }
            });
        }
        else {
            if (!findRole.request) return res.status(409).json({msg: "User don't have role request"});
        }
        
    } catch (error) {
        res.status(500).json({msg: "Role request failed to update"});
    }
}
export const deleteRole= async(req, res) => {
    const reviewers = await Role.findOne({
        where : {
            Role_id: req.params.id
        }
    });
    if(!reviewers) return res.status(404).json({msg : "No Role Found"});
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