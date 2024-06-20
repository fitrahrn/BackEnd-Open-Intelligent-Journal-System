import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Discussion from "./DiscussionModel.js";
import User from "./UserModel.js";
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
    user_id : {
        type : DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    message: DataTypes.TEXT,
    message_file: DataTypes.STRING,
    date_send:DataTypes.DATE,


}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
Discussion.hasMany(Message,{foreignKey:'discussion_id'});
Message.belongsTo(Discussion,{
    foreignKey:'discussion_id'
});

User.hasMany(Message,{foreignKey:'user_id'});
Message.belongsTo(User,{
    foreignKey:'user_id'
});
export default Message;