import fs from "fs";
import csv from "csv-parser";
import authorController from "./authorController";
import { object, string } from "yup";
import { stringify } from "csv-stringify";

interface Magazine {
    title: string,
    isbn: string,
    authors: string,
    publishedAt: string
}
export default {
    list: function () {
        return new Promise((resolve, reject) => {
            let data: Array<Magazine> = [];
            let magazineCsv = fs.createReadStream("./db/magazines.csv")
            magazineCsv.on("error", () => reject("error reading csv"))

            magazineCsv
                .pipe(csv({ separator: ";" }))
                .on("data", (row) => {
                    data.push(row)
                })
                .on("end", async () => {
                    let result = await Promise.all(data.map(async (row: Magazine) => {
                        return { ...row, authors: await authorController.getFullName(row.authors) }
                    }))
                    resolve(result)
                })
                .on("error", (err) => {
                    reject(err)
                })
        })
    },
    findByISBN: function (isbn: string) {
        return new Promise((resolve, reject) => {
            let magazineCsv = fs.createReadStream("./db/magazines.csv")
            magazineCsv.on("error", () => reject("error reading csv"))
            let magazine: Magazine;

            magazineCsv
                .pipe(csv({ separator: ";" }))
                .on("data", async (row) => {
                    if (row.isbn == isbn) {
                        magazine = row
                    }
                })
                .on("end", async () => {
                    if (magazine) resolve({ ...magazine, authors: await authorController.getFullName(magazine.authors) })
                    else reject(`No magazine found for isbn ${isbn}`)
                })
        })
    },
    findByAuthor: function (mailId: string) {
        return new Promise((resolve, reject) => {
            let data: Array<Object> = [];
            let magazineCsv = fs.createReadStream("./db/magazines.csv")
            magazineCsv.on("error", () => reject("error reading csv"))

            magazineCsv
                .pipe(csv({ separator: ";" }))
                .on("data", (row) => {
                    let authors = row.authors.split(",").filter((author: string) => author == mailId)
                    if (authors && authors.length != 0) data.push({ title: row.title, isbn: row.isbn })
                })
                .on("end", () => {
                    if (data.length == 0)
                        reject(`No magazines found of Author ${mailId}`)
                    else resolve(data)
                })
        })
    },
    create: function (book: Magazine) {
        return new Promise(async (resolve, reject) => {
            let bookSchema = object({
                title: string().required(),
                isbn: string().required(),
                authors: string().required(),
                publishedAt: string().required(),
            })
            try {
                let newBook = await bookSchema.validate(book)

                let newBookCsv = fs.createWriteStream("./db/newMagazine.csv")
                const columns = [
                    "title",
                    "isbn",
                    "authors",
                    "publishedAt"
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