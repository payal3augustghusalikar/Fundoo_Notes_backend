/**
 * @module       test
 * @file         test.js
 * @description  test the all routes for crud operation
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @date         2/01/2021
-----------------------------------------------------------------------------------------------*/

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
chai.use(chaiHttp);
const greet = require("./notes.json");
const should = require("should");
//(err === null).should.be.true;

chai.should;

const token = greet.notes.properToken.token;

describe("notes API", () => {
    /**
     * @description Test the GET API
     */
    describe("GET /notes", () => {
        // test the GET API when points are proper
        it("givennotes_WhenGivenProperEndPoints_ShouldReturnObject", (done) => {
            console.log("getting all data .");
            const token = greet.notes.properToken.token;
            chai
                .request(server)
                .get("/notes")
                // .set(token)
                .set("Authorization", token)
                .end((err, res) => {
                    // res.should.have.status(401);
                    // res.body.should.be.a("object");
                    console.log("responce :", res);
                    console.log("error :", err);

                    done();
                });
        });

        // test the GET API when points are not proper
        it("givennotes_WhenNotGivenProperEndPoints_ShouldNotReturnObject", (done) => {
            const token = greet.notes.properToken.token;
            chai
                .request(server)
                .get("/not")
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    /**
     * @description Test the GET API using Id
     */
    describe("/GET /notes/noteId", () => {
        it("givennotes_WhenGivenProperNoteId_ShouldGiveObject", (done) => {
            const noteId = 1;
            const token = greet.notes.properToken.token;
            chai
                .request(server)
                .get("/notes/" + noteId)
                // .set(token)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a("object");
                    done();
                });
        });

        // test the GET API when provided improper note Id
        it("givennotes_WhenNotGivenProperNoteId_ShouldNotGiveObject", (done) => {
            const noteId = 144;
            const token = greet.notes.properToken.token;
            chai
                .request(server)
                .get("/notes/" + noteId)
                //  .set(token)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });
    });

    /**
     * @description Test the POST API
     */
    describe("POST /notes", () => {
        // test the POST API when provided proper data
        it("givennotes_WhenGivenPropertitleAnddescription_ShouldPostNote", (done) => {
            const note = greet.notes.noteToPost;
            const token = greet.notes.properToken.token;
            chai
                .request(server)
                .post("/notes/")
                .set("Authorization", token)
                .send(note)

            .end((error, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                //   res.should.have.message.equal("note added successfully !");
                done();
            });
        });

        it("givennotes_WhenGivenNotPropertitleAnddescription_ShouldNotPostNote", (done) => {
            const note = greet.notes.invalidNoteToPost;
            const token = greet.notes.properToken.token;
            chai
                .request(server)
                .post("/notes/")
                .set("Authorization", token)
                .send(note)

            .end((error, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                //  res.message.should.have.equal(
                //  "Some error occurred while creating note " + error

                done();
            });
        });

        // test the POST API when provided improper data
        it("givennotes_WhenNotGivenPropertitleAndDescription_ShouldNotPostNote", (done) => {
            const note = greet.notes.noteWithouttitle;
            const token = greet.notes.properToken.token;
            chai
                .request(server)
                .post("/notes/")
                .set("Authorization", token)
                .send(note)

            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it("givennotes_WhenNotGivenDescription_ShouldNotPostNote", (done) => {
            const note = greet.notes.noteWithoutDescription;
            chai
                .request(server)
                .post("/notes/")
                .set("Authorization", token)
                .send(note)

            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it("givennotes_WhenGivenEmptyTitle_ShouldNotPostNote", (done) => {
            const note = greet.notes.noteWithEmptyTitle;
            chai
                .request(server)
                .post("/notes/")
                .set("Authorization", token)
                .send(note)

            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });
    });

    /**
     * @description Test the PUT API using Id
     */
    describe("/PUT  /notes/:noteId", () => {
        // test the PUT API when provided proper Id
        it("givennotes_WhenGivenProperId_ShouldUpdateNote", (done) => {
            const noteId = greet.notes.noteToUpdate.noteId;
            const note = greet.notes.noteToUpdate;
            chai
                .request(server)
                .put("/notes/" + noteId)
                .set("Authorization", token)
                .send(note)

            .end((err, res) => {
                res.should.have.status(200);
                console.log("res Body:", res.body);
                res.body.should.be.a("Object");
                done();
            });
        });
        // test the PUT API when provided improper Id
        it("givennotes_WhenGivenImropertitle_ShouldNotUpdateNote", (done) => {
            const noteId = greet.notes.noteWithouttitle.noteId;
            const note = greet.notes.noteWithouttitle;
            chai
                .request(server)
                .put("/notes/" + noteId)
                .set("Authorization", token)
                .send(note)

            .end((err, res) => {
                res.should.have.status(400);

                done();
            });
        });
        it("givennotes_WhenGivenImropertitle_ShouldNotUpdateNote", (done) => {
            const noteId = greet.notes.noteWithEmptytitle.noteId;
            const note = greet.notes.noteWithEmptytitle;
            chai
                .request(server)
                .put("/notes/" + noteId)
                .set("Authorization", token)
                .send(note)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });
        it("givennotes_WhenGivenImroperdescription_ShouldNotUpdateNote", (done) => {
            const noteId = greet.notes.noteWithImproperdescription.noteId;
            const note = greet.notes.noteWithImproperdescription;
            chai
                .request(server)
                .put("/notes/" + noteId)
                .set("Authorization", token)
                .send(note)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe("DELETE /notes/noteID", function() {
        it("givennotes_WhenGivenProperId_ShouldDelete_note", (done) => {
            const noteID = greet.notes.noteToDelete.noteId;
            chai
                .request(server)
                .delete("/notes/" + noteID)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("givennotes_WhenNotGivenProperId_ShouldNotDelete_note", (done) => {
            const noteID = 144;
            chai
                .request(server)
                .delete("/notes/" + noteID)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(401);
                    //res.should.have.status(401);
                    //res.text.should.be.eq("it cannot delete with wrong note id");
                    done();
                });
        });
    });
});