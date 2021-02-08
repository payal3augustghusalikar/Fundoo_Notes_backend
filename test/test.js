/**
 * @module       test
 * @file         test.js
 * @description  test the all routes for crud operation
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @date       2/01/2021  
-----------------------------------------------------------------------------------------------*/


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
chai.use(chaiHttp);
request = require('supertest');
const greet = require("./notes.json");


describe('register', () => {
    it('givenUser_whenGiven_properData_shouldSaveUser', (done) => {
        let userInfo = {
            name: 'Payal',
            emailId: 'ghusalikarapayal1@gmail.com',
            password: 'Ghjjjjj'
        }
        chai.request(server)
            .post('/register')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
            })
    })

    it('givenUser_whenGiven_duplicateData_shouldNotSaveUser', (done) => {
        let userInfo = {
            name: 'Payal',
            emailId: 'ghusalikarapayal1@gmail.com',
            password: 'Ghjjjjj'
        }
        chai.request(server)
            .post('/register')
            .send(userInfo)

        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            done()
        })
    })
    it('givenUser_whenGiven_improperData_shouldNotSaveUser', (done) => {
        let userInfo = {
            name: '',
            emailId: 'ghusalikarapayal1@gmail.com',
            password: 'Ghjjjjj'
        }
        chai.request(server)
            .post('/register')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done()
            })
    })
})


describe('Login', () => {
    it('givenUser_whenGiven_properData_shouldResponds_withJson', (done) => {
        let userInfo = {
            emailId: 'ghusalikarapayal1@gmail.com',
            password: 'Ghjjjjj'
        }
        chai.request(server)
            .post('/login')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
            })
    })

    it('givenUser_whenGiven_improperData_shouldResponds_withJson', (done) => {
        let userInfo = {
            emailId: 'ghusalikarapayal1@gmail.com',
            password: ''
        }
        chai.request(server)
            .post('/login')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done()
            })
    })
})

describe('ForgotPassword', () => {
    it('givenUser_whenGiven_improperData_shouldResponds_withLink', (done) => {
        let userInfo = {
            emailId: 'ghusalikarapayal1@gmail.com'
        }
        chai.request(server)
            .post('/forgotpassword')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
            })
    })

    it('givenUser_whenGiven_improperData_shouldNotResponds_withLink', (done) => {
        let userInfo = {
            emailId: 'ghusalikar@gmail.com'
        }
        chai.request(server)
            .post('/forgotpassword')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done()
            })
    })
})

describe('Resetpassword', () => {
    it('givenUser_whenGiven_improperData_shouldResetPassword', (done) => {
        let userInfo = {
            newPassword: 'Thanakfhfgfjg',
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoiZ2h1c2FsaWthcnBheWFsQGdtYWlsLmNvbSIsImlkIjoiNjAxOGRiOWM3MzU1YTkyM2I4OGFmM2UwIiwiaWF0IjoxNjEyMzgyMzg3LCJleHAiOjE2MTI0Njg3ODd9.6I8fMEnAS0_PpSMl5ixe0zPWhh0Vpx9QaNFQYShJLjA'
        chai.request(server)
            .put('/reset-password')
            .send(userInfo)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
            })
    })
    it('givenUser_whenGiven_improperData_shouldResetPassword', (done) => {
        let userInfo = {
            newPassword: 'as',
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoiZ2h1c2FsaWthcnBheWFsQGdtYWlsLmNvbSIsImlkIjoiNjAxOGRiOWM3MzU1YTkyM2I4OGFmM2UwIiwiaWF0IjoxNjEyMzgyMzg3LCJleHAiOjE2MTI0Njg3ODd9.6I8fMEnAS0_PpSMl5ixe0zPWhh0Vpx9QaNFQYShJLjA'
        chai.request(server)
            .put('/resetpassword')
            .send(userInfo)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done()
            })
    })

    it('givenUser_whenGiven_improperToken_shouldResetPassword', (done) => {
        let userInfo = {
            newPassword: 'aGHGHGYThgh',
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoiZ2h1c2FsaWthcnBheWFsQGdtYWlsLmNvbSIsImlkIjoiNjAxOGRiOWM3MzU1YTkyM2I4OGFmM2UwIiwiaWF0IjoxNjEyMzgyMzg3LCJleHAiOjE2MTI0Njg3ODd9.6I8fMEnAS0_PpSMl5ixe0zPWhh0Vpx9QaNFQYShJLjA'
        chai.request(server)
            .put('/resetpassword')
            .send(userInfo)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done()
            })
    })
})


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