import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import Journal from "./JournalModel.js";
const {DataTypes} = Sequelize;

const Role = db.define('role',{
    role_id : {
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
    journal_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Journal,
            key: 'journal_id'
        }
    },
    administrator: DataTypes.INTEGER,
    lead_editor: DataTypes.INTEGER,
    editor: DataTypes.INTEGER,
    reviewer: DataTypes.INTEGER,
    author: DataTypes.INTEGER,
    reader: DataTypes.INTEGER,
    
}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});


export default Role;