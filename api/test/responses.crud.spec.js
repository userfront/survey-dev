const request = require("request");
const chai = require("chai");
const expect = chai.expect;
const Test = require("./test.config.js");
const { sequelize } = require("../database/instance.js");

const uri = "http://localhost:3000";
const req = request.defaults({
  json: true,
  uri,
});

describe("SurveyResponses endpoint", () => {
  before(async () => {
    // Reset the database before running these tests
    await Test.resetDb();

    // Create 3 survey responses
    await sequelize.models.SurveyResponse.create({
      userId: 1,
      data: { technology: ["JS", "React"] },
    });
    await sequelize.models.SurveyResponse.create({
      userId: 2,
      data: { technology: ["Java", "Spring", "VS Code"] },
    });
    await sequelize.models.SurveyResponse.create({
      userId: 3,
      data: { technology: ["MySql"] },
    });
    return Promise.resolve();
  });

  it("GET /survey-responses should return survey responses", async () => {
    // Perform a GET request to /survey-responses
    const payload = {
      uri: `${uri}/survey-responses`,
    };
    const { res, body } = await new Promise((resolve) => {
      req.get(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 200 status code
    expect(res.statusCode).to.equal(200);

    // Check that the body has a surveyResponse array
    expect(body.surveyResponses).to.exist;

    // Check that the surveyResponse array has 3 surveyResponses in it
    expect(body.surveyResponses.length).to.equal(3);

    // Check that the surveyResponses have the correct structure
    const surveyResponse = body.surveyResponses[0];
    expect(surveyResponse.data).to.exist;
    return Promise.resolve();
  });

  it("POST /survey-responses should create a survey response", async () => {
    // Perform a POST request to /survey-responses
    const payload = {
      uri: `${uri}/survey-responses`,
      body: {
        data: {
          favoriteColor: "green",
          technology: ["Vue", "Node.js"],
        },
      },
    };
    const { res, body } = await new Promise((resolve) => {
      req.post(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 200 status code
    expect(res.statusCode).to.equal(200);

    // Check that the surveyResponse is returned
    expect(body.id).to.exist;
    expect(body.data).to.deep.equal(payload.body.data);

    // Check that a surveyResponse was created in the database
    const surveyResponse = await sequelize.models.SurveyResponse.findOne({
      where: { id: body.id },
    });
    expect(surveyResponse).to.exist;
    expect(surveyResponse.userId).to.equal(1);
    expect(surveyResponse.data).to.deep.equal(payload.body.data);

    return Promise.resolve();
  });
});
