import express, { Request, Response } from "express";
import commonController from "../controllers/commonController";
const router = express.Router();

router.get("/common", async (req: Request, res: Response) => {
    let data = await commonController.list();
    res.send(data)
})
router.get("/common/sortByTitle", async (req: Request, res: Response) => {
    let data = await commonController.sortByTitle();
    res.send(data)
})
export default router; 
