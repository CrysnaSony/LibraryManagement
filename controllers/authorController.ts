import fs from "fs";
import csv from "csv-parser";

interface author {
    email: string,
    firstname: string,
    lastname: string
}

export default {
    getFullName: function (authorsMail: string) {
        return new Promise<string>((resolve, reject) => {
            let authorCsv = fs.createReadStream("./db/authors.csv")
            authorCsv.on("error", () => reject("Error reading Csv"))
            let authors = authorsMail.split(",")
            let authorsFullName: string[] = []

            authorCsv
                .pipe(csv({ separator: ";" }))
                .on("data", (row: author) => {
                    authors.map((author) => {
                        if (row.email == author) authorsFullName.push(`${row.firstname} ${row.lastname}`)
                    })
                })
                .on("end", () => {
                    if (authorsFullName.length != 0) resolve(authorsFullName.join(","))

                    else reject("No Authors found")
                })

        })
    }
}