import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Journal from "./JournalModel.js";

const {DataTypes} = Sequelize;

const Issue = db.define('issue',{
    issue_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    journal_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Journal,
            key: 'journal_id'
        }
    },
    volume: DataTypes.INTEGER,
    number : DataTypes.INTEGER,
    year : DataTypes.INTEGER,
    date_published :DataTypes.DATEONLY,
    url_path: DataTypes.STRING,
    appear:DataTypes.BOOLEAN

}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
export default Issue;