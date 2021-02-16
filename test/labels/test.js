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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });

        // test the GET API when points are not proper
        it("givenlabels_WhenNotGivenProperEndPoints_ShouldNotReturnObject", (done) => {
            chai
                .request(server)
                .get("/not")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    /**
     * @description Test the GET API using Id
     */
    describe("/GET /labels/labelId", () => {
        it("givenlabels_WhenGivenProperlabelId_ShouldGiveObject", (done) => {
            const labelId = 2;
            chai
                .request(server)
                .get("/labels/" + labelId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });

        // test the GET API when provided improper label Id
        it("givenlabels_WhenNotGivenProperlabelId_ShouldNotGiveObject", (done) => {
            const labelId = 144;
            chai
                .request(server)
                .get("/labels/" + labelId)
                .end((err, res) => {
                    res.should.have.status(401);

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
                .post("/labels/")
                .send(label)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    done();
                });
        });

        // test the POST API when provided improper data
        it("givenlabels_WhenNotGivenProperName_ShouldNotPostLabel", (done) => {
            const label = greet.labels.labelWithoutName;
            chai
                .request(server)
                .post("/labels/")
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
                .catch(done());
        });

        it("givenlabels_WhenGivenEmptyName_ShouldNotPostlabel", (done) => {
            const label = greet.labels.labelWithEmptyName;
            chai
                .request(server)
                .post("/labels/")
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);
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
            const labelId = greet.labels.labelToUpdate.labelId;
            console.log("put: " + labelId);
            const label = greet.labels.labelToUpdate;
            chai
                .request(server)
                .put("/labels/" + labelId)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log("Response Body:", res.body);
                    res.body.should.be.a("Object");
                    done();
                });
        });
        // test the PUT API when provided improper Id
        it("givenlabels_WhenGivenImroperName_ShouldNotUpdatelabel", (done) => {
            const labelId = greet.labels.labelWithoutname.labelId;
            const label = greet.labels.labelWithoutName;
            chai
                .request(server)
                .put("/labels/" + labelId)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it("givenlabels_WhenGivenImroperName_ShouldNotUpdatelabel", (done) => {
            const labelId = greet.labels.labelWithEmptyname.labelId;
            const label = greet.labels.labelWithEmptyname;
            chai
                .request(server)
                .put("/labels/" + labelId)
                .send(label)
                .end((err, res) => {
                    res.should.have.status(401);

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
                .end((err, response) => {
                    response.should.have.status(401);
                    done();
                });
        });

        it("givenlabels_WhenNotGivenProperId_ShouldNotDelete_label", (done) => {
            const labelId = 144;
            chai
                .request(server)
                .delete("/labels/" + labelId)
                .end((err, response) => {
                    response.should.have.status(401);
                    //response.text.should.be.eq("it cannot delete with wrong label id");
                    done();
                });
        });
    });
});