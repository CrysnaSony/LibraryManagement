import fs from "fs";
import csv from "csv-parser";
import { stringify } from "csv-stringify";
import authorController from "./authorController";
import { readFile } from "fs/promises";
import { object, string } from "yup";
import path from "path"
interface Book {
    title: string,
    isbn: string,
    authors: string,
    description: string
}
export default {
    list: async function () {
        return new Promise(async (resolve, reject) => {
            let data: Array<Book> = [];
            let bookCsv;
            try {

                bookCsv = fs.createReadStream("./db/books.csv")
                bookCsv.on("error", (err) => reject("error reading csv" + err))

                bookCsv
                    .pipe(csv({ separator: ";" }))
                    .on("data", async (row: Book) => {
                        data.push(row)
                    })
                    .on("end", async () => {
                        let result = await Promise.all(data.map(async (row: Book) => {
                            return { ...row, authors: await authorController.getFullName(row.authors) }
                        }))
                        resolve(result)
                    })
                    .on("error", (err) => {
                        reject(err)
                    })
            }
            catch (e) {
                reject(e)
            }
        })
    },
    findByISBN: function (isbn: string) {
        return new Promise((resolve, reject) => {
            let bookCsv = fs.createReadStream("./db/books.csv")
            bookCsv.on("error", () => reject("error reading csv"))
            let book: Book;
            bookCsv
                .pipe(csv({ separator: ";" }))
                .on("data", async (row) => {
                    if (row.isbn == isbn) {
                        book = row
                    }
                })
                .on("end", async () => {
                    if (book) resolve({ ...book, authors: await authorController.getFullName(book.authors) })
                    else reject(`No books found for isbn ${isbn}`)
                })
        })
    },
    findByAuthor: function (mailId: string) {
        return new Promise((resolve, reject) => {
            let data: Array<Object> = [];
            let bookCsv = fs.createReadStream("./db/books.csv")
            bookCsv.on("error", () => reject("error reading csv"))

            bookCsv
                .pipe(csv({ separator: ";" }))
                .on("data", (row) => {
                    let authors = row.authors.split(",").filter((author: string) => author == mailId)
                    if (authors && authors.length != 0) data.push({ title: row.title, isbn: row.isbn })
                })
                .on("end", () => {
                    if (data.length == 0)
                        reject(`No books found of Author ${mailId}`)
                    else resolve(data)
                })
        })
    },
    create: function (book: Book) {
        return new Promise(async (resolve, reject) => {
            let bookSchema = object({
                title: string().required(),
                isbn: string().required(),
                authors: string().required(),
                description: string().required(),
            })
            try {
                let newBook = await bookSchema.validate(book)

                let newBookCsv = fs.createWriteStream("./db/newBooks.csv")
                const columns = [
                    "title",
                    "isbn",
                    "authors",
                    "description"
                ]
                const stringifier = stringify({ header: true, columns, delimiter: ";" })
                stringifier.write(newBook);
                stringifier
                    .pipe(newBookCsv)
                    .on("error", () => reject("Error writing csv"))

                resolve("Data inserted successfully")

            } catch (error: any) {
                reject(error.message)
            }
        })
    }
}