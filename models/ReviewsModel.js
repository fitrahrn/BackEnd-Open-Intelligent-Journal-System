import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Article from "./ArticleModel.js";
const {DataTypes} = Sequelize;

const Reviews = db.define('reviews',{
    reviews_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    article_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Article,
            key: 'article_id'
        }
    },
    review_rounds: DataTypes.INTEGER,
    article_file_path: DataTypes.STRING,
}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
Article.hasMany(Reviews,{foreignKey:'article_id'});
Reviews.belongsTo(Article,{
    foreignKey:'article_id'
});

export default Reviews;