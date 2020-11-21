const request = require("request");
const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const Test = require("./test.config.js");
const { sequelize } = require("../database/instance.js");

const uri = "http://localhost:3000";
const req = request.defaults({
  json: true,
  uri,
});

describe.only("SurveyResponses endpoint", () => {
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
    // Create a JWT signed with the RSA private key
    const token = jwt.sign(
      {
        userId: 3,
      },
      Test.rsaPrivateKey,
      { algorithm: "RS256" }
    );

    // Perform a GET request to /survey-responses
    const payload = {
      uri: `${uri}/survey-responses`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const { res, body } = await new Promise((resolve) => {
      req.get(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 200 status code
    expect(res.statusCode).to.equal(200);

    // Check that the body has a surveyResponse array
    expect(body.surveyResponses).to.exist;

    // Check that the surveyResponse array has 1 surveyResponses in it
    expect(body.surveyResponses.length).to.equal(1);

    // Check that the surveyResponses have the correct structure
    const surveyResponse = body.surveyResponses[0];
    expect(surveyResponse.userId).to.equal(3);
    expect(surveyResponse.data).to.exist;
    return Promise.resolve();
  });

  it("GET /survey-responses should return 401 if JWT is signed with wrong key", async () => {
    // Create a JWT signed with a different RSA private key
    const token = jwt.sign(
      {
        userId: 3,
      },
      `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBALHlFNfHdfCq4stiIZyTmkawfJXgGSXHHy9L2YmcDYoeoL/ljIXn
PX4/d4AgABq6NTKJEoIm661Ay1VYjErpY4cCAwEAAQJBAJ2XS6yP1So7qCf2KcJ0
e6INrIB1ArIVwMl8Txz5soDcfe8h3X6w7/GshWG//DcnTXsosMnYPbkhGord1nQP
85kCIQDyW5SHAY0mSyYUjZpFrq/dEyDEGiq26DpT8C1w3DlBwwIhALvolEEU+dMt
NMF7Bj8Y/8oi1BP/AlCs62TM9gLt8FbtAiEA5FW2BNBIXMi2cuzKaVZgqGeqGjgR
AEyhD44cMdW6OCMCIF0n3metaHTi0mahAOXDFPw27ADFyXYJY+FjIwssvpu5AiAy
j54LxJp8HjQXvbs/Tr7OSu3CEK7pc9uTZ6RkyD1oGw==
-----END RSA PRIVATE KEY-----`,
      {
        algorithm: "RS256",
      }
    );

    const payload = {
      uri: `${uri}/survey-responses`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    // Perform a POST request to /survey-responses
    const { res, body } = await new Promise((resolve) => {
      req.get(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 401 status code
    expect(res.statusCode).to.equal(401);
    expect(body).to.equal("Unauthorized");
    return Promise.resolve();
  });

  it("GET /survey-responses should return 401 if no authorization header is present", async () => {
    const payload = {
      uri: `${uri}/survey-responses`,
    };

    // Perform a POST request to /survey-responses
    const { res, body } = await new Promise((resolve) => {
      req.get(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 401 status code
    expect(res.statusCode).to.equal(401);
    expect(body).to.equal("Unauthorized");
    return Promise.resolve();
  });

  it("POST /survey-responses should create a survey response", async () => {
    // Create a JWT signed with the RSA private key
    const token = jwt.sign(
      {
        userId: 88,
      },
      Test.rsaPrivateKey,
      { algorithm: "RS256" }
    );

    const payload = {
      uri: `${uri}/survey-responses`,
      body: {
        data: {
          favoriteColor: "green",
          technology: ["Vue", "Node.js"],
        },
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    // Perform a POST request to /survey-responses
    const { res, body } = await new Promise((resolve) => {
      req.post(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 200 status code
    expect(res.statusCode).to.equal(200);

    // Check that the surveyResponse is returned
    expect(body.id).to.exist;
    expect(body.userId).to.equal(88);
    expect(body.data).to.deep.equal(payload.body.data);

    // Check that a surveyResponse was created in the database
    const surveyResponse = await sequelize.models.SurveyResponse.findOne({
      where: { id: body.id },
    });
    expect(surveyResponse).to.exist;
    expect(surveyResponse.userId).to.equal(88);
    expect(surveyResponse.data).to.deep.equal(payload.body.data);

    return Promise.resolve();
  });

  it("POST /survey-responses should return 401 if JWT is expired", async () => {
    // Create an expired JWT signed with the RSA private key
    const token = jwt.sign(
      {
        userId: 88,
      },
      Test.rsaPrivateKey,
      {
        algorithm: "RS256",
        expiresIn: -1,
      }
    );

    const payload = {
      uri: `${uri}/survey-responses`,
      body: {
        data: {
          someData: "Here",
        },
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    // Perform a POST request to /survey-responses
    const { res, body } = await new Promise((resolve) => {
      req.post(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 401 status code
    expect(res.statusCode).to.equal(401);
    expect(body).to.equal("Unauthorized");
    return Promise.resolve();
  });

  it("POST /survey-responses should return 401 if JWT is signed with wrong key", async () => {
    // Create a JWT signed with a different RSA private key
    const token = jwt.sign(
      {
        userId: 88,
      },
      `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBALHlFNfHdfCq4stiIZyTmkawfJXgGSXHHy9L2YmcDYoeoL/ljIXn
PX4/d4AgABq6NTKJEoIm661Ay1VYjErpY4cCAwEAAQJBAJ2XS6yP1So7qCf2KcJ0
e6INrIB1ArIVwMl8Txz5soDcfe8h3X6w7/GshWG//DcnTXsosMnYPbkhGord1nQP
85kCIQDyW5SHAY0mSyYUjZpFrq/dEyDEGiq26DpT8C1w3DlBwwIhALvolEEU+dMt
NMF7Bj8Y/8oi1BP/AlCs62TM9gLt8FbtAiEA5FW2BNBIXMi2cuzKaVZgqGeqGjgR
AEyhD44cMdW6OCMCIF0n3metaHTi0mahAOXDFPw27ADFyXYJY+FjIwssvpu5AiAy
j54LxJp8HjQXvbs/Tr7OSu3CEK7pc9uTZ6RkyD1oGw==
-----END RSA PRIVATE KEY-----`,
      {
        algorithm: "RS256",
      }
    );

    const payload = {
      uri: `${uri}/survey-responses`,
      body: {
        data: {
          someData: "Here",
        },
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    // Perform a POST request to /survey-responses
    const { res, body } = await new Promise((resolve) => {
      req.post(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 401 status code
    expect(res.statusCode).to.equal(401);
    expect(body).to.equal("Unauthorized");
    return Promise.resolve();
  });

  it("POST /survey-responses should return 401 if the authorization header is missing", async () => {
    const payload = {
      uri: `${uri}/survey-responses`,
      body: {
        data: {
          someData: "Here",
        },
      },
    };

    // Perform a POST request to /survey-responses
    const { res, body } = await new Promise((resolve) => {
      req.post(payload, (err, res, body) => resolve({ res, body }));
    });

    // Check that the server returns a 401 status code
    expect(res.statusCode).to.equal(401);
    expect(body).to.equal("Unauthorized");
    return Promise.resolve();
  });
});
