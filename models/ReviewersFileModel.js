import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Reviewers from "./ReviewersModel.js";
import User from "./UserModel.js";
const {DataTypes} = Sequelize;

const ReviewersFile = db.define('reviewers_file',{
    reviewers_file_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    reviewers_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Reviewers,
            key: 'reviews_id'
        }
    },
    reviewers_file: DataTypes.STRING,


}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});


export default ReviewersFile;