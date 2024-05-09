import Participant from "../models/ParticipantModel";
import User from "../models/UserModel";
import Discussion from "../models/DiscussionModel";
export const getParticipant = async(req, res) => {
    try {
        const response = await Participant.findAll(); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getParticipantFromDiscussionId = async(req, res) => {
    
    try {
        const response = await Participant.findAll({
            where : {
                discussion_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getParticipantFromUserId = async(req, res) => {
    
    try {
        const response = await Participant.findAll({
            where : {
                user_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const createParticipant = async (req,res)=>{
    const { user_id,discussion_id,role} = req.body;
    if (!(user_id && discussion_id && role)) return res.status(400).json({msg: "All input is required"});
    
    try{
        const checkUser = await User.findOne({
            where: {
                user_id: user_id
            }
        });
        if (!checkUser) return res.status(409).json({msg: "User doesn't exist"});
    
        const checkDiscussion = await Discussion.findOne({
            where: {
                discussion_id: discussion_id
            }
        });
        if (!checkDiscussion) return res.status(409).json({msg: "Discussion doesn't exist"});
    
        
        await Participant.create({
            user_id:user_id,
            discussion_id:discussion_id,
            role:role
            
        });
        res.status(200).json({msg: "New Participant created successfully",
            data: {
                user_id:user_id,
                discussion_id:discussion_id,
                role:role
            }
        });
    } catch (error) {
        res.status(500).json({msg: "New Participant failed to create"});
    }
}
export const updateParticipant = async (req,res)=>{
    try {
        await Participant.update(req.body, {
            where : {
                participant_id : req.params.id
            }
        });
        res.status(200).json({msg: "Participant updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Participant failed to update"});
    }
}
export const deleteParticipant= async(req, res) => {
    const participant = await Participant.findOne({
        where : {
            participant_id : req.params.id
        }
    });
    if(!participant) return res.status(404).json({msg : "No Participant Found"});
    try {
        await Participant.destroy({
            where : {
                Participant_id : req.params.id
            }
        });
        res.status(200).json({msg : "Participant Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 