import Discussion from "../models/DiscussionModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Reviews from "../models/ReviewsModel.js";
export const getDiscussionFromReviewsId = async(req, res) => {
    
    try {
        const response = await Discussion.findAll({
            where : {
                reviews_id: req.params.id

            },
            include:[{
                model:Message,
                required: true,
                include:[{
                    model:User,
                    required: true,
                    attributes:["name"]
                }],
            }],
        }); // seluruh atribut same as SELECT * FROM
        for(let i=0;i<response.length;i++){
            let message = response[i].dataValues.messages
            const messageFirstSendTime = message[0].dataValues.date_send
            const messageFirstSendName = message[0].dataValues.user.name
            const messageLastSendTime = message[message.length-1].dataValues.date_send
            const messageLastSendName = message[message.length-1].dataValues.user.name
            response[i].dataValues.time_first_send = messageFirstSendTime
            response[i].dataValues.name_first_send = messageFirstSendName
            response[i].dataValues.time_last_send = messageLastSendTime
            response[i].dataValues.name_last_send = messageLastSendName
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}


export const createDiscussion = async (req,res)=>{
    const { reviews_id,subject,message,date_send} = req.body;
    if (!(reviews_id && subject,message)) return res.status(400).json({msg: "All input is required"});
    const username = req.cookies.username;
    const findUser = await User.findOne({
        where: {
            username: username
        }
    });
    if (!findUser) return res.status(409).json({msg: "User not found"});
    if(file !== null){
        const fileSize = file.data.length;
        const extension = path.extname(file.name);
        const fileName = "Message-"+file.md5 + extension;
        const file_path = `${req.protocol}://${req.get("host")}/messages/${fileName}`;
        const allowedType = ['.pdf', '.doc', '.docx','.xml'];
        if(!allowedType.includes(extension.toLowerCase())) return res.status(422).json({msg: "Invalid document format"});
        if(fileSize > 15000000) return res.status(422).json({msg : "Size of document must be less than 10 MB"});
        file.mv(`./public/messages/${fileName}`, async (error) => {
            if (error) return res.status(500).json({ msg: error.message });
            const checkReviews = await Reviews.findOne({
                where: {
                    reviews_id: reviews_id
                }
            });
            if (!checkReviews) return res.status(409).json({msg: "Reviews id doesn't exist"});
        
            
            const discussion =  await Discussion.create({
                reviews_id:reviews_id,
                subject: subject,
                closed:false
                
            });
            await Message.create({
                discussion_id: discussion.dataValues.discussion_id,
                user_id: findUser.dataValues.user_id,
                message:message,
                message_file:file_path,
                date_send:date_send
            })
            res.status(200).json({msg: "New discussion created successfully",
                data: {
                    reviews_id:reviews_id,
                    subject: subject,
                    closed:false,
                    discussion_id: discussion.dataValues.discussion_id,
                    user_id: findUser.dataValues.user_id,
                    message:message,
                    message_file:file_path,
                    date_send:date_send
                }
            });
        });
    }
    else{
        try{
            const checkReviews = await Reviews.findOne({
                where: {
                    reviews_id: reviews_id
                }
            });
            if (!checkReviews) return res.status(409).json({msg: "Reviews id doesn't exist"});
        
            
            const discussion =  await Discussion.create({
                reviews_id:reviews_id,
                subject: subject,
                closed:false
                
            });
            await Message.create({
                discussion_id: discussion.dataValues.discussion_id,
                user_id: findUser.dataValues.user_id,
                message:message,
                message_file:null,
                date_send:date_send
            })
            res.status(200).json({msg: "New discussion created successfully",
                data: {
                    reviews_id:reviews_id,
                    subject: subject,
                    closed:false,
                    discussion_id: discussion.dataValues.discussion_id,
                    user_id: findUser.dataValues.user_id,
                    message:message,
                    message_file:null,
                    date_send:date_send
                }
            });
        } catch (error) {
            res.status(500).json({msg: "New discussion failed to create"});
        }
    }
    
}
export const updateDiscussion = async (req,res)=>{
    try {
        await Discussion.update(req.body, {
            where : {
                discussion_id : req.params.id
            }
        });
        res.status(200).json({msg: "Discussion updated",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({msg: "Discussion failed to update"});
    }
}
export const deleteDiscussion= async(req, res) => {
    const discussion = await Discussion.findOne({
        where : {
            discussion_id : req.params.id
        }
    });
    if(!discussion) return res.status(404).json({msg : "No Discussion Found"});
    try {
        await Discussion.destroy({
            where : {
                discussion_id : req.params.id
            }
        });
        res.status(200).json({msg : "Discussion Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
} 