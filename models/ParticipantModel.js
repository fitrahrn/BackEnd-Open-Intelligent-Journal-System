import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import Discussion from "./DiscussionModel.js";
const {DataTypes} = Sequelize;

const Participant = db.define('participant',{
    participant_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    user_id : {
        type : DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    discussion_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Discussion,
            key: 'discussion_id'
        }
    },
    role: DataTypes.STRING


}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
export default Participant;