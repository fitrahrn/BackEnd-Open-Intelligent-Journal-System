import { Sequelize } from "sequelize";

const db = new Sequelize('oijs', 'root', '', {
    host : 'localhost',
    dialect : 'mysql'
});

export default db;

// aktifkan xampp