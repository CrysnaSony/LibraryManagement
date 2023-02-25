import fs from "fs";
import csv from "csv-parser";
import bookController from "./bookController";
import magazineController from "./magazineController";

interface Common {
    title: string,
    isbn: string,
    authors: string,
    description: string,
    publishedAt: string
}
export default {
    list: async function () {
        let books: any = await bookController.list()
        let magazines: any = await magazineController.list();
        let common = await books.concat(magazines)
        return common;
    },
    sortByTitle: async function () {
        let common = await this.list()
        return await common
            .sort((a: Common, b: Common) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    },
}