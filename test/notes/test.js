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
chai.should();
//var should = require("chai").should();

describe("notes API", () => {
    /**
     * @description Test the GET API
     */
    describe("GET /notes", () => {
        // test the GET API when points are proper
        it("givennotes_WhenGivenProperEndPoints_ShouldReturnObject", (done) => {
            console.log("getting all data .");
            chai
                .request(server)
                .get("/notes")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });

        // test the GET API when points are not proper
        it("givennotes_WhenNotGivenProperEndPoints_ShouldNotReturnObject", (done) => {
            chai
                .request(server)
                .get("/not")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        // done();
    });

    /**
     * @description Test the GET API using Id
     */
    describe("/GET /notes/noteId", () => {
        it("givennotes_WhenGivenProperNoteId_ShouldGiveObject", (done) => {
            const noteId = 1;
            chai
                .request(server)
                .get("/notes/" + noteId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });

        // test the GET API when provided improper note Id
        it("givennotes_WhenNotGivenProperNoteId_ShouldNotGiveObject", (done) => {
            const noteId = 144;
            chai
                .request(server)
                .get("/notes/" + noteId)
                .end((err, res) => {
                    res.should.have.status(401);
                    // res.text.should.be.eq("task with provided id does not exist");
                    done();
                });
            //
        });
    });

    /**
     * @description Test the POST API
     */
    describe("POST /notes", () => {
        // test the POST API when provided proper data
        it("givennotes_WhenGivenPropertitleAnddescription_ShouldPostNote", (done) => {
            const note = greet.notes.noteToPost;
            chai
                .request(server)
                .post("/notes/")
                .send(note)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });

        // test the POST API when provided improper data
        it("givennotes_WhenNotGivenPropertitleAndDescription_ShouldNotPostNote", (done) => {
            const note = greet.notes.noteWithouttitle;
            console.log("not post", note);
            chai
                .request(server)
                .post("/notes/")
                .send(note)
                .end((err, res) => {
                    res.should.have.status(401);
                    // res.text.should.be.eq("it is not accepting without title property");
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
                .send(note)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log("Response Body:", res.body);
                    res.body.should.be.a("Object");
                    done();
                });
        });
        // test the PUT API when provided improper Id
        it("givennotes_WhenNotGivenImropertitle_ShouldNotUpdateNote", (done) => {
            const noteId = greet.notes.noteWithouttitle.noteId;
            const note = greet.notes.noteWithouttitle;
            chai
                .request(server)
                .put("/notes/" + noteId)
                .send(note)
                .end((err, res) => {
                    res.should.have.status(401);
                    // res.text.should.be.eq("it is not accepting without title property");
                    done();
                });
        });
    });
});