import express, { Request, Response } from "express";
import bookController from "../controllers/bookController";
const router = express.Router();

router.get("/books", async (req: Request, res: Response) => {
    bookController.list()
        .then((row) => res.send(row))
        .catch((err) => res.status(400).send(err))
})

router.get("/books/:isbn", async (req: Request, res: Response) => {
    bookController.findByISBN(req.params.isbn)
        .then((row) => res.send(row))
        .catch((err) => res.status(400).send(err))
})

router.get("/books/author/:mailId", async (req: Request, res: Response) => {
    bookController.findByAuthor(req.params.mailId)
        .then((row) => res.send(row))
        .catch((err) => res.status(400).send(err))
})
router.post("/books", async (req: Request, res: Response) => {
    bookController.create(req.body)
        .then((success) => res.send(success))
        .catch((err) => res.status(400).send(err))
})
export default router; 