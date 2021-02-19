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
const greet = require("./labels.json");
chai.should();
const token = greet.labels.properToken.token;
const labelId = "602fe57aab2f532e30a6214a";

describe("labels API", () => {
    /**
     * @description Test the GET API
     */
    describe("GET /labels", () => {
        // test the GET API when points are proper
        it("givenlabels_WhenGivenProperEndPoints_ShouldReturnObject", (done) => {
            console.log("getting all data .");
            chai
                .request(server)
                .get("/labels")
                // .set("Accept", "application/json")
                .set("Authorization", token)
                .end((err, res) => {
                    console.log("responce :", +res.body);
                    console.log("error :", +err);
                    //  res.should.have.status(200);
                    // res.body.should.be.a("object");
                    // res.body.message.should.have.equal(
                    //     "label of current account has been retrieved"
                    // );
                    done();
                });
        });

        // test the GET API when points are not proper
        it("givenlabels_WhenNotGivenProperEndPoints_ShouldNotReturnObject", (done) => {
            chai
                .request(server)
                .get("/not")
                // .set("x-auth-token", token)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(404);
                    //  res.body.message.should.have.equal("label not found");
                    done();
                });
        });
    });

    /**
     * @description Test the GET API using Id
     */
    describe("/GET /labels/labelId", () => {
        it("givenlabels_WhenGivenProperlabelId_ShouldGiveObject", (done) => {
            // const labelId = "602fe5c2ab2f532e30a6214c";
            chai
                .request(server)
                .get("/labels/" + labelId)
                // .set("Accept", "application/json")
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.message.should.have.equal("label found");
                    done();
                });
        });

        // test the GET API when provided improper label Id
        it("givenlabels_WhenNotGivenProperlabelId_ShouldNotGiveObject", (done) => {
            const labelId = 144;
            chai
                .request(server)
                .get("/labels/" + labelId)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(500);
                    //  res.body.message.should.have.equal("label not found");

                    done();
                });
        });
    });

    /**
     * @description Test the POST API
     */
    describe("POST /labels", () => {
        // test the POST API when provided proper data
        it("givenlabels_WhenGivenProperName_ShouldPostLabel", (done) => {
            const label = greet.labels.labelToPost;
            chai
                .request(server)
                .post("/labels")

            //  .set("Accept", "application/json")
            .set("Authorization", token)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.message.should.have.equal("label added successfully !");
                    //  res.body.should.have.property("name").eq("Newwww");

                    // res.body.should.have.property("greetingId").eq(9);
                    // res.body.should.have.property("name").eq("Newwww");
                    // res.body.should.have.property("message").eq("CHello");
                    done();
                });
        });

        // test the POST API when provided improper data
        it("givenlabels_WhenNotGivenProperName_ShouldNotPostLabel", (done) => {
            const label = greet.labels.labelWithoutName;
            chai
                .request(server)
                .post("/labels/")
                .set("Authorization", token)
                .send(label)

            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
        });

        it("givenlabels_WhenGivenEmptyName_ShouldNotPostlabel", (done) => {
            const label = greet.labels.labelWithEmptyName;
            chai
                .request(server)
                .post("/labels/")
                .set("Authorization", token)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it("givenlabels_WhenGiven2charInName_ShouldNotPostlabel", (done) => {
            const label = greet.labels.postlabelWithImpropername;
            chai
                .request(server)
                .post("/labels")
                .set("Authorization", token)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);
                    //res.should.have.message.eq("please enter valid details");
                    done();
                });
        });
    });

    /**
     * @description Test the PUT API using Id
     */
    describe("/PUT  /labels/:labelId", () => {
        // test the PUT API when provided proper Id
        it("givenlabels_WhenGivenProperId_ShouldUpdatelabel", (done) => {
            //  const labelId = "602fe5c2ab2f532e30a6214c";
            console.log("put: " + labelId);
            const label = greet.labels.labelToUpdate;
            chai
                .request(server)
                .put("/labels/" + labelId)
                .set("Authorization", token)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log("res Body:", res.body);
                    res.body.should.be.a("Object");
                    //  res.body.message.should.have.equal("label updated successfully !");

                    done();
                });
        });

        it("givenlabels_WhenGivenIMProperId_ShouldNotUpdatelabel", (done) => {
            const labelId = "1";
            console.log("put: " + labelId);
            const label = greet.labels.labelToUpdate;
            chai
                .request(server)
                .put("/labels/" + labelId)
                .set("Authorization", token)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(404);

                    //  res.body.message.should.have.equal("label not found");

                    done();
                });
        });

        // test the PUT API when provided improper Id
        it("givenlabels_WhenGivenImroperName_ShouldNotUpdatelabel", (done) => {
            //  const labelId = greet.labels.labelWithoutname.labelId;
            const label = greet.labels.labelWithoutName;
            chai
                .request(server)
                .put("/labels/" + labelId)
                .set("Authorization", token)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);
                    //   res.body.message.should.have.equal("label not found");
                    done();
                });
        });
        it("givenlabels_WhenGivenImroperName_ShouldNotUpdatelabel", (done) => {
            //  const labelId = greet.labels.labelWithEmptyname.labelId;
            const label = greet.labels.labelWithEmptyname;
            chai
                .request(server)
                .put("/labels/" + labelId)
                .set("Authorization", token)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);
                    //   res.body.message.should.have.equal("Error updating label");
                    done();
                });
        });
    });

    describe("/GET /labels/:userId", () => {
        // test the PUT API when provided proper Id
        it("givenUserId_WhenGivenProperUserId_ShouldGiveLabel", (done) => {
            const userId = greet.labels.userId;
            console.log("GET: " + userId);
            chai
                .request(server)
                .put("/labels/" + userId)
                .set("Authorization", token)
                // .send(label)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log("res Body:", res.body);
                    res.body.should.be.a("Object");
                    //  res.body.message.should.have.equal("label updated successfully !");

                    done();
                });
        });
    });

    describe("DELETE /labels/labelId", function() {
        it("givenlabels_WhenGivenProperId_ShouldDelete_label", (done) => {
            const labelId = greet.labels.labelToDelete.labelId;
            chai
                .request(server)
                .delete("/labels/" + labelId)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    //   res.body.message.should.have.equal("label deleted successfully!");

                    done();
                });
        });

        it("givenlabels_WhenNotGivenProperId_ShouldNotDelete_label", (done) => {
            const labelId = 144;
            chai
                .request(server)
                .delete("/labels/" + labelId)
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(404);
                    //  res.body.message.should.have.equal("label not found with id");

                    //res.text.should.be.eq("it cannot delete with wrong label id");
                    done();
                });
        });
    });
});