import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import Journal from "./JournalModel.js";
const {DataTypes} = Sequelize;

const Role = db.define('role',{
    role_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
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
    administrator: DataTypes.BOOLEAN,
    lead_editor: DataTypes.BOOLEAN,
    editor: DataTypes.BOOLEAN,
    reviewer: DataTypes.BOOLEAN,
    author: DataTypes.BOOLEAN,
    reader: DataTypes.BOOLEAN,
    request: DataTypes.STRING
    
}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
User.hasMany(Role,{foreignKey:'user_id'});
Role.belongsTo(User,{
    foreignKey:'user_id'
});
Journal.hasMany(Role,{foreignKey:'journal_id'});
Role.belongsTo(Journal,{
    foreignKey:'journal_id'
})

export default Role;