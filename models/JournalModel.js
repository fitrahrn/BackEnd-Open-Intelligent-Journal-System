import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Journal = db.define('journal',{
    journal_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    title : DataTypes.STRING,
    initials: DataTypes.STRING,
    abbreviation : DataTypes.STRING,
    path: DataTypes.STRING,
    image_path: DataTypes.STRING,
    languages: DataTypes.STRING,
    appear: DataTypes.BOOLEAN,
    publisher: DataTypes.STRING,
    issn: DataTypes.STRING,
    e_issn: DataTypes.STRING,
    reg_number: DataTypes.STRING
}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});