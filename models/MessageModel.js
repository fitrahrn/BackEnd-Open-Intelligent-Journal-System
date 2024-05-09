import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Participant from "./ParticipantModel.js";
import Discussion from "./DiscussionModel.js";
const {DataTypes} = Sequelize;

const Message = db.define('message',{
    message_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    discussion_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Discussion,
            key: 'discussion_id'
        }
    },
    participant_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Participant,
            key: 'participant_id'
        }
    },
    message: DataTypes.TEXT,
    message_file: DataTypes.STRING


}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
export default Message;