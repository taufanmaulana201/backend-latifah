import { Sequelize } from "sequelize";

// const db = new Sequelize("db_latifah", "postgres", "database", {
//   host: "localhost",
//   dialect: "postgres",
// });
const db = new Sequelize("railway", "postgres", "L9kY6Rx9BsT2dZQuTpXc", {
  host: "containers-us-west-209.railway.app",
  port: 6626,
  dialect: "postgres",
});

export default db;
