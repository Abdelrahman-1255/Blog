import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressLayout from "express-ejs-layouts";
import methodOverride from "method-override";
import mainRoutes from "./server/routes/main.js";
import adminRoutes from "./server/routes/admin.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import connectDB from "./server/config/db.js";
import { isActiveRoute } from "./server/Helpers/routeHelpers.js";
const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      // Use the same env var as in server/config/db.js
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "sessions",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(express.static("public"));

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.locals.isActiveRoute = isActiveRoute;
app.use("/", mainRoutes);
app.use("/", adminRoutes);
app.use("/about", mainRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
