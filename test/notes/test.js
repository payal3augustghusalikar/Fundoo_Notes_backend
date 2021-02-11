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
          res.body.should.be.a("object");
        });
      done();
    });

    // test the GET API when points are not proper
    it("givennotes_WhenNotGivenProperEndPoints_ShouldNotReturnObject", (done) => {
      chai
        .request(server)
        .get("/note")
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });

  /**
   * @description Test the GET API using Id
   */
  describe("/GET /notes/noteId", () => {
    // test the GET API when provided proper note Id
    it("givennotes_WhenGivenProperNoteId_ShouldGiveObject", (done) => {
      const noteId = greet.notes.GetNoteById.noteId;
      chai
        .request(server)
        .get("/notes/" + noteId)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
        });
      done();
    });

    // test the GET API when provided improper note Id
    it("givennotes_WhenNotGivenProperGreetoingId_ShouldNotGiveObject", (done) => {
      const noteId = 144;
      chai
        .request(server)
        .get("/notes/" + noteId)
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq("task with provided id does not exist");
        });
      done();
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
        .post("/notes")
        .send(note)
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
        });
      done();
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
          res.should.have.status(400);
          res.text.should.be.eq("it is not accepting without title property");
        });
      done();
    });
  });

  /**
   * @description Test the PUT API using Id
   */
  describe("/PUT  /notes/:noteId", function () {
    // test the PUT API when provided proper Id
    it("givennotes_WhenGivenProperId_ShouldUpdateNote", (done) => {
      const noteId = greet.notes.noteToUpdate.noteId;
      const note = greet.notes.note7;
      chai
        .request(server)
        .put("/notes/" + noteId)
        .send(note)
        .end((err, res) => {
          res.should.have.status(200);
          console.log("Response Body:", res.body);
          res.body.should.be.a("Object");
        });
      done();
    });
    // test the PUT API when provided improper Id
    it("givennotes_WhenNotGivenPropertitle_ShouldNotUpdateNote", (done) => {
      const noteId = greet.notes.noteWithouttitle.noteId;
      const note = greet.notes.note8;
      chai
        .request(server)
        .put("/notes/" + noteId)
        .send(note)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eq("it is not accepting without title property");
        });
      done();
    });
  });
});
