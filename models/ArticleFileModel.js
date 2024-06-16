import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Article from "./ArticleModel.js";
const {DataTypes} = Sequelize;

const ArticleFile = db.define('article_file',{
    article_file_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    article_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Article,
            key: 'reviews_id'
        }
    },
    article_path: DataTypes.STRING,


}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});


export default ArticleFile;