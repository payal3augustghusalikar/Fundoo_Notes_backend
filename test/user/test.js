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

describe("register", () => {
  it("givenUser_whenGivenProperData_shouldSaveUser", (done) => {
    let userInfo = userData.user.registerUserProperData;
    console.log(userInfo);
    chai
      .request(server)
      .post("/register")
      .send(userInfo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
      });
    done();
  });

  it("givenUser_whenGivenDuplicateData_shouldNotSaveUser", (done) => {
    let userInfo = userData.user.registerUserProperData;
    chai
      .request(server)
      .post("/register")
      .send(userInfo)

      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
      });
    done();
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
      });
    done();
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
      });
    done();
  });

  it("givenUser_whenGivenImproperData_shouldRespondsWithJson", (done) => {
    let userInfo = userData.user.loginUserImproperData;
    chai
      .request(server)
      .post("/login")
      .send(userInfo)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
      });
    done();
  });
});

describe("ForgotPassword", () => {
  it("givenUser_whenGivenImproperData_shouldRespondsWithLink", (done) => {
    let userInfo = userData.user.forgotPasswordProperData;
    chai
      .request(server)
      .post("/forgotpassword")
      .send(userInfo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
      });
    done();
  });

  it("givenUser_whenGivenImproperData_shouldNotRespondsWithLink", (done) => {
    let userInfo = userData.user.forgotPasswordImproperData;
    chai
      .request(server)
      .post("/forgotpassword")
      .send(userInfo)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
      });
    done();
  });
});

describe("Resetpassword", () => {
  it("givenUser_whenGivenProperData_shouldResetPassword", (done) => {
    let userInfo = userData.user.resetPasswordProperData;
    let token = userData.user.properToken;
    chai
      .request(server)
      .put("/reset-password")
      .send(userInfo)
      .set("token", token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
      });
    done();
  });
  it("givenUser_whenGivenImproperData_shouldNotResetPassword", (done) => {
    let userInfo = userData.user.resetPasswordImproperData;
    let token = userData.user.properToken;
    chai
      .request(server)
      .put("/resetpassword")
      .send(userInfo)
      .set("token", token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
      });
    done();
  });

  it("givenUser_whenGivenImproperToken_shouldNotResetPassword", (done) => {
    let userInfo = userData.user.resetPasswordProperData;
    let token = userData.user.ImproperToken;
    chai
      .request(server)
      .put("/resetpassword")
      .send(userInfo)
      .set("token", token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
      });
    done();
  });
});
