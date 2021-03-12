/**
 * @module       test
 * @file         test.js
 * @description  test the all routes for user api
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @date         2/01/2021
-----------------------------------------------------------------------------------------------*/

let chai = require("chai");
let chaiHttp = require("chai-http");

let server = require("../../server");
chai.use(chaiHttp);
const userData = require("./user.json");
chai.should();
let token = userData.user.properToken.token;

describe("register", () => {
    it("givenUser_whenGivenProperData_shouldSaveUser", (done) => {
        let userInfo = userData.user.registerUserProperData;
        console.log("userInfo: " + userInfo);
        chai
            .request(server)
            .post("/register")
            .send(userInfo)
            .end((err, res) => {
                //   console.log("body : " + res.body);
                res.should.have.status(200);
                res.body.should.be.a("array");
                done();
            });
    });

    it("givenUser_whenGivenDuplicateData_shouldNotSaveUser", (done) => {
        let userInfo = userData.user.registerUserProperData;
        chai
            .request(server)
            .post("/register")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
    it("givenUser_whenGivenImproperData_shouldNotSaveUser", (done) => {
        let userInfo = userData.user.userWithEmptyName;
        chai
            .request(server)
            .post("/register")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });
    it("givenUser_whenGivenImproperDataEmail_shouldNotSaveUser", (done) => {
        let userInfo = userData.user.userWithImproperEmail;
        chai
            .request(server)
            .post("/register")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });
    it("givenUser_whenGivenEmptyEmail_shouldNotSaveUser", (done) => {
        let userInfo = userData.user.userWithEmptyEmail;
        chai
            .request(server)
            .post("/register")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });

    it("givenUser_whenGivenLessThan3CharInName_shouldNotSaveUser", (done) => {
        let userInfo = userData.user.userWithThan3CharInName;
        chai
            .request(server)
            .post("/register")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });

    it("givenUser_whenNotGivenPasswordAndConfirmPasswordSame_shouldNotSaveUser", (done) => {
        let userInfo = userData.user.PasswordAndConfirmPasswordNotSame;
        chai
            .request(server)
            .post("/register")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });
});

describe("Login", () => {
    it("givenUser_whenGivenProperData_shouldRespondsWithJson", (done) => {
        let userInfo = userData.user.loginUserProperData;
        chai
            .request(server)
            .post("/login")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                done();
            });
    });

    it("givenUser_whenGivenEmptyEmail_shouldNotLoginUser", (done) => {
        let userInfo = userData.user.loginUserEmptyEmail;
        chai
            .request(server)
            .post("/login")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });
    it("givenUser_whenGivenImproperData_shouldNotRespondsWithJson", (done) => {
        let userInfo = userData.user.loginUserImproperData;
        chai
            .request(server)
            .post("/login")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });

    it("givenUser_whenGivenImproperData_shouldNotRespondsWithJson", (done) => {
        let userInfo = userData.user.loginUserImproperData;
        chai
            .request(server)
            .post("/login")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });

    it("givenUser_whenGivenNotRegisterdData_shouldNotRespondsWithJson", (done) => {
        let userInfo = userData.user.NotregisterUserProperDatatoLogin;
        chai
            .request(server)
            .post("/login")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                done();
            });
    });
});

describe("ForgotPassword", () => {
    it("givenUser_whenGivenImproperData_shouldNotRespondsWithLink", (done) => {
        let userInfo = userData.user.forgotPasswordImproperData;
        chai
            .request(server)
            .post("/forgotpassword")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
    it("givenUser_whenGivenEmptyEmail_shouldNotRespondsWithLink", (done) => {
        let userInfo = userData.user.forgotPasswordEmptyEmail;
        chai
            .request(server)
            .post("/forgotpassword")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
    it("givenUser_whenGivenProperData_shouldRespondsWithLink", (done) => {
        let userInfo = userData.user.forgotPasswordProperData;
        chai
            .request(server)
            .post("/forgotpassword")
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe("Resetpassword", () => {
    it("givenUser_whenGivenProperData_shouldResetPassword", (done) => {
        let userInfo = userData.user.resetPasswordProperData;
        let token = userData.user.properToken.token;
        chai
            .request(server)
            .put("/resetpassword")
            .set("Authorization", token)
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                done();
            });
    });
    it("givenUser_whenGivenImproperData_shouldNotResetPassword", (done) => {
        let userInfo = userData.user.resetPasswordImproperData;
        let token = userData.user.properToken;
        chai
            .request(server)
            .put("/resetpassword")
            .set("Authorization", token)
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                done();
            });
    });


    it("givenUser_whenGivenPasswordConfirmPasswordNotSame_shouldNotResetPassword", (done) => {
        let userInfo = userData.user.resetPasswordAndCPassNotSame;
        let token = userData.user.properToken.token;
        chai
            .request(server)
            .put("/resetpassword")
            .set("Authorization", token)
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(401);
                console.log(res.body);
                res.body.should.be.a("object");
                //  res.body.message.should.have.equal("Password not match");
                done();
            });
    });

    it("givenUser_whenGivenImproperToken_shouldNotResetPassword", (done) => {
        let userInfo = userData.user.resetPasswordProperData;
        let token = userData.user.ImproperToken;
        chai
            .request(server)
            .put("/resetpassword")
            .set("Authorization", token)
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                done();
            });
    });
});

describe.only("activateemail", () => {
    it("givenUser_whenGivenProperToken_shouldActivateEmail", (done) => {
        // let token = userData.user.properToken.token;
        let token =
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoiZ2h1c2FsaWthcnBheWFsQGdtYWlsLmNvbSIsImlkIjoiNjAxOGRiOWM3MzU1YTkyM2I4OGFmM2UwIiwiaWF0IjoxNjE0ODcxODg5LCJleHAiOjE2MjAwNTU4ODl9.gqfVbu8VeLRYZlrWDjwCaA1pihl5TwYQ0i_EfaGRBgc";
        chai
            .request(server)
            .put("/activateemail")
            .set("Authorization", token)
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a("object");
                done();
            });
    });
    it("givenUser_whenGivenImProperToken_shouldNotActivateEmail", (done) => {
        let token = userData.user.ImproperToken.token;
        chai
            .request(server)
            .put("/activateemail")
            .set("Authorization", token)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                done();
            });
    });
});