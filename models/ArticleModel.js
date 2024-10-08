import { BOOLEAN, Sequelize } from "sequelize";
import db from "../config/database.js";
import Journal from "./JournalModel.js";
import Issue from "./IssueModel.js";
const {DataTypes} = Sequelize;

const Article = db.define('article',{
    article_id : {
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
    issue_id: {
        type : DataTypes.INTEGER,
        references: {
            model: Issue,
            key: 'issue_id'
        }
    },
    prefix: DataTypes.STRING,
    title : DataTypes.STRING,
    subtitle: DataTypes.STRING,
    abstract: DataTypes.TEXT,
    article_path: DataTypes.STRING,
    comment: DataTypes.STRING,
    keywords: DataTypes.STRING,
    workflow_phase :DataTypes.STRING,
    status:DataTypes.STRING,
    date_published:DataTypes.DATEONLY,
    cite:DataTypes.INTEGER

}, {
    freezeTableName : true, // memaksa untuk menginfer nama model sebagai nama tabel
    timestamps : false // agar gak ngequery createdAt and updatedAt
});
Journal.hasMany(Article,{foreignKey:'journal_id'});
Article.belongsTo(Journal,{
    foreignKey:'journal_id'
});

export default Article;