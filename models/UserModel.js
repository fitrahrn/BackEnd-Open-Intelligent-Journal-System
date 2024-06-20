// source : https://sequelize.org/docs/v6/core-concepts/model-basics
//  models adalah abstraksi yang merepresentasikan tabel di dalam database
import { Sequelize } from "sequelize";
import db from "../config/database.js"
import Article from "./ArticleModel.js";

const {DataTypes} = Sequelize;

// struktur data dari user
// nama tabel, atribut, dan optional
const User = db.define('user', {
    user_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    name: DataTypes.STRING,
    public_name: DataTypes.STRING,
    username : DataTypes.STRING,
    email : DataTypes.STRING,
    password : DataTypes.STRING,
    phone: DataTypes.STRING,
    orcid_id: DataTypes.STRING,
    affliation: DataTypes.STRING,
    mailing_address: DataTypes.STRING,
    signature: DataTypes.STRING,
    country:DataTypes.STRING,
    profile_picture: DataTypes.STRING
}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});

export default User;
