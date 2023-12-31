import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SuplierRoute from "./routes/SuplierRoute.js";
import BarangRoute from "./routes/BarangRoute.js";
import PengeluaranRoute from "./routes/Pengeluaran.js";
import invoiceRoute from "./routes/InvoiceRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

(async () => {
  await db.sync();
})();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      // secure: "auto",
      httpOnly: false,
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin:
      "https://frontend-latifah-lamo7lbtq-taufanmaulana201201-gmailcom.vercel.app",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(SuplierRoute);
app.use(BarangRoute);
app.use(PengeluaranRoute);
app.use(invoiceRoute);

store.sync();

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server up and running...");
});
