import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Reviews from "./ReviewsModel.js";

const {DataTypes} = Sequelize;

const Discussion = db.define('discussion',{
    discussion_id : {
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
    subject: DataTypes.STRING,
    closed:DataTypes.BOOLEAN

}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
export default Discussion;