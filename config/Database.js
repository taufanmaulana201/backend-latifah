import { Sequelize } from "sequelize";

const db = new Sequelize("db_latifah", "postgres", "database", {
  host: "localhost",
  dialect: "postgres",
});

export default db;
