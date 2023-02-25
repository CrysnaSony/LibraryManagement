import bookController from "../controllers/bookController";

test("should have book's property", () => {
    return bookController.list()
        .then((data: any) => {
            data.map((d: any) => {
                expect(d).toHaveProperty(['title'])
            })
        })
});


