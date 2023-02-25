import express from "express";
// require("./db/mongoose");
import cors from "cors";
const app = express();
import bookRouter from "./routes/bookRoutes";
import magazineRouter from "./routes/magazineRoutes";
import commonRouter from "./routes/commonRoutes";
app.use(express.json());
app.use(cors());
app.use(express.static('public'))

app.use(bookRouter);
app.use(magazineRouter);
app.use(commonRouter)
export default app;
