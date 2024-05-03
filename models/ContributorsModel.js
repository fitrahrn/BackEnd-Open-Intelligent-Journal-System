import {Sequelize } from "sequelize";
import db from "../config/database.js";
import Article from "./ArticleModel.js";
import User from "./UserModel.js";
const {DataTypes} = Sequelize;

const Contributors = db.define('contributors',{
    contributors_id : {
        type : DataTypes.INTEGER,
        primaryKey : true
    },
    article_id : {
        type : DataTypes.INTEGER,
        references: {
            model: Article,
            key: 'article_id'
        }
    },
    user_id : {
        type : DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },

}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
// Article.belongsToMany(User, {through:Contributors});
// User.belongsToMany(Article,{through:Contributors});
User.hasMany(Contributors,{foreignKey:'user_id'});
Contributors.belongsTo(User,{
    foreignKey:'user_id'
});
Article.hasMany(Contributors,{foreignKey:'article_id'});
Contributors.belongsTo(Article,{
    foreignKey:'article_id'
})
export default Contributors;