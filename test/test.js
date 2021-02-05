/**
 * @module       test
 * @file         test.js
 * @description  test the all routes for crud operation
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        2/01/2021  
-----------------------------------------------------------------------------------------------*/

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server.js");
chai.use(chaiHttp);

var expect = chai.expect;
//var expect = require('chai').expect;

//assertion style
chai.should();

const greet = require("./notes.json");
(chai = require("chai")), (request = require("supertest"));
var assert = require("assert");

describe("Basic Mocha String Test", function() {
    it("should return number of characters is 5", function() {
        assert("Hello".length, 5);
    });
});

//describe('POST /login', function() {
describe.only("POST /register", function() {
    it("givenUser_whenGiven_properData_shouldSaveUser", function(done) {
        chai
            .request(server)
            .post("/register")
            .send({
                name: "Javascript",
                emailId: "payal@gmail.com",
                password: "ppppp",
                confirmPassword: "ppppp",
            })
            .end(function(err, res) {
                res.should.have.status(200);
                //res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.should.have.property("SUCCESS");
                res.body.SUCCESS.should.be.a("object");
                res.body.SUCCESS.should.have.property("name");
                res.body.SUCCESS.should.have.property("emailId");
                res.body.SUCCESS.should.have.property("_id");
                res.body.SUCCESS.name.should.equal("Javascript");
                res.body.SUCCESS.emailId.should.equal("payal@gmail.com");
                done();
            });
    });

    it("givenUser_whenGiven_duplicateData_shouldNotSaveUser", function(done) {
        var profile = {
            name: "Javascript",
            emailId: "payal@gmail.com",
            password: "ppppp",
            confirmPassword: "ppppp",
        };
        request(server)
            .post('/register')
            .send(profile)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 400);
                done();
            });
    });
})

describe.only("POST /login", function() {
    it("givenUser_whenGiven_properData_shouldResponds_withJson", function(done) {
        request(server)
            .post("/login")
            .send({
                    email: "abc@gmail.com",
                    password: "hellAll2uuu",
                    confirmPassword: "hellAll2uuu",
                }
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                })
            );
    });
});

describe("notes API", () => {
    /**
     * @description Test the GET API
     */
    describe("GET /notes", () => {
        // test the GET API when points are proper
        it("givennotes_WhenGivenProperEndPoints_ShouldReturn_object", (done) => {
            console.log("getting all data .");
            chai
                .request(server)
                .get("/notes")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });

        // test the GET API when points are not proper
        it("givennotes_WhenNotGivenProperEndPoints_ShouldNotReturn_object", (done) => {
            chai
                .request(server)
                .get("/note")
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
        // test the GET API when provided proper note Id
        it("givennotes_WhenGivenProperNoteId_ShouldGive_object", (done) => {
            const noteId = greet.notes.GetNoteById.noteId;
            chai
                .request(server)
                .get("/notes/" + noteId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("noteId");
                    response.body.should.have.property("title");
                    response.body.should.have.property("description");
                    done();
                });
        });

        // test the GET API when provided improper note Id
        it("givennotes_WhenNotGivenProperGreetoingId_ShouldNotGive_object", (done) => {
            const noteId = 144;
            chai
                .request(server)
                .get("/notes/" + noteId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.text.should.be.eq("task with provided id does not exist");
                    done();
                });
        });
    });

    /**
     * @description Test the POST API
     */
    describe("POST /notes", () => {
        // test the POST API when provided proper data
        it("givennotes_WhenGivenPropertitleAnddescription_ShouldPost_note", (done) => {
            const note = greet.notes.noteToPost;
            chai
                .request(server)
                .post("/notes")
                .send(note)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a("object");
                    response.body.should.have.property("noteId").eq(9);
                    response.body.should.have.property("title").eq("Ccompany");
                    response.body.should.have.property("description").eq("CHello");
                    done();
                });
        });

        // test the POST API when provided improper data
        it("givennotes_WhenNotGivenPropertitleAnddescription_ShouldNotPost_note", (done) => {
            const note = greet.notes.noteWithouttitle;
            console.log("not post", note);
            chai
                .request(server)
                .post("/notes/")
                .send(note)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.eq("it is not accepting without title property");
                    done();
                });
        });
    });

    /**
     * @description Test the PUT API using Id
     */
    describe("/PUT  /notes/:noteId", function() {
        // test the PUT API when provided proper Id
        it("givennotes_WhenGivenProperId_ShouldUpdate_note", (done) => {
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
                    res.body.should.have.property(" noteId").eq(2);
                    res.body.should.have.property("title").eq("payalllchanged");
                    res.body.should.have.property("note").eq("Worlddd");
                    done();
                });
        });
        // test the PUT API when provided improper Id
        it("givennotes_WhenNotGivenPropertitle_ShouldNotUpdate_note", (done) => {
            const noteId = greet.notes.noteWithouttitle.noteId;
            const note = greet.notes.note8;
            chai
                .request(server)
                .put("/notes/" + noteId)
                .send(note)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.eq("it is not accepting without title property");
                    done();
                });
        });
    });
});

describe("Local login", function() {
    it("should save user", function(done) {
        var profile = {
            name: "Abc",
            email: "abcd@abcd.com",
            password: "Testing1234",
            confirmPassword: "Testing1234",
        };
        request(process.env.URL)
            .post("/register")
            .send(profile)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                done();
            });
    });
});