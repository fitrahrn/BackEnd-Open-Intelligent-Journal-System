import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Reviews from "./ReviewsModel.js";
import User from "./UserModel.js";
const {DataTypes} = Sequelize;

const Reviewers = db.define('reviewers',{
    reviewers_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    reviews_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Reviews,
            key: 'reviews_id'
        }
    },
    user_id :{
        type : DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    editor_review:DataTypes.TEXT,
    author_review:DataTypes.TEXT,
    recommendation: DataTypes.STRING,
    date_assigned: DataTypes.DATEONLY,
    date_completed:DataTypes.DATEONLY,
    date_due: DataTypes.DATEONLY,


}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});


export default Reviewers;