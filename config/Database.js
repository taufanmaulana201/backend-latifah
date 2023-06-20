import { Sequelize } from "sequelize";

// const db = new Sequelize("db_latifah", "postgres", "database", {
//   host: "localhost",
//   dialect: "postgres",
// });
const db = new Sequelize("railway", "postgres", "L9kY6Rx9BsT2dZQuTpXc", {
  host: "0.0.0.0",
  port: 6626,
  dialect: "postgres",
});

export default db;
