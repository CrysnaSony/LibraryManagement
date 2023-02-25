import express, { Request, Response } from "express";
import magazineController from "../controllers/magazineController";
const router = express.Router();

router.get("/magazines", async (req: Request, res: Response) => {
    magazineController.list()
        .then((row) => res.send(row))
        .catch((err) => res.status(400).send(err))
})

router.get("/magazines/:isbn", async (req: Request, res: Response) => {
    magazineController.findByISBN(req.params.isbn)
        .then((row) => res.send(row))
        .catch((err) => res.status(400).send(err))
})

router.get("/magazines/author/:mailId", async (req: Request, res: Response) => {
    magazineController.findByAuthor(req.params.mailId)
        .then((row) => res.send(row))
        .catch((err) => res.status(400).send(err))
})
router.post("/magazines", async (req: Request, res: Response) => {
    magazineController.create(req.body)
        .then((success) => res.send(success))
        .catch((err) => res.status(400).send(err))
})
export default router; 