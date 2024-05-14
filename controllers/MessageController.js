import Message from "../models/MessageModel";
import Participant from "../models/ParticipantModel";
import Discussion from "../models/DiscussionModel";
export const getMessageFromDiscussionId = async(req, res) => {
    
    try {
        const response = await Message.findAll({
            where : {
                discussion_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
export const getMessageFromParticipantId = async(req, res) => {
    
    try {
        const response = await Message.findAll({
            where : {
                participant_id: req.params.id
            }
        }); // seluruh atribut same as SELECT * FROM
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const createMessage = async (req,res)=>{
    const { discussion_id,participant_id,message,message_file} = req.body;
    if (!(discussion_id && participant_id && message)) return res.status(400).json({msg: "All input is required"});
    
    try{
        const checkParticipant = await Participant.findOne({
            where: {
                participant_id: participant_id
            }
        });
        if (!checkParticipant) return res.status(409).json({msg: "Participant doesn't exist"});
    
        const checkDiscussion = await Discussion.findOne({
            where: {
                discussion_id: discussion_id
            }
        });
        if (!checkDiscussion) return res.status(409).json({msg: "Discussion doesn't exist"});
    
        
        await Message.create({
            participant_id:participant_id,
            discussion_id:discussion_id,
            message:message,
            message_file:message_file
            
        });
        res.status(200).json({msg: "New Message created successfully",
            data: {
                participant_id:participant_id,
                discussion_id:discussion_id,
                message:message,
                message_file:message_file
            }
        });
    } catch (error) {
        res.status(500).json({msg: "New Message failed to create"});
    }
}
export const updateMessage = async (req,res)=>{
    try {
        await Message.update(req.body, {
            where : {
                message_id : req.params.id
            }
        });
        res.status(200).json({msg: "Message updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Message failed to update"});
    }
}
export const deleteMessage= async(req, res) => {
    const message = await Message.findOne({
        where : {
            message_id : req.params.id
        }
    });
    if(!message) return res.status(404).json({msg : "No Message Found"});
    try {
        await Message.destroy({
            where : {
                message_id : req.params.id
            }
        });
        res.status(200).json({msg : "Message Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 