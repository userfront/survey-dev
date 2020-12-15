const axios = require("axios");
const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const Test = require("./test.config.js");
const { sequelize } = require("../database/instance.js");

const ax = axios.create({
  baseURL: "http://localhost:5000",
});

describe("Results endpoint", () => {
  before(async () => {
    // Reset the database before running these tests
    await Test.resetDb();
    return Promise.resolve();
  });

  it("GET /results should return results to an admin user", async () => {
    // Create a JWT and sign it with the RSA private key
    const token = jwt.sign(
      {
        userId: 11,
        authorization: {
          "5xbpy4nz": {
            tenantId: "5xbpy4nz",
            roles: ["admin"],
          },
        },
      },
      Test.rsaPrivateKey,
      { algorithm: "RS256" }
    );
    // Perform a GET request to /results
    const { data, status } = await ax.get("/results", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    // Check that the server returned the results
    expect(status).to.equal(200);
    expect(data).to.deep.equal({ results: { data: [] } });
    return Promise.resolve();
  });

  it("GET /results should return 401 for a non-admin user", async () => {
    // Create an expired JWT signed with the RSA private key
    const token = jwt.sign(
      {
        userId: 22,
        authorization: {
          "5xbpy4nz": {
            tenantId: "5xbpy4nz",
            roles: [], // Does not have admin role
          },
        },
      },
      Test.rsaPrivateKey,
      {
        algorithm: "RS256",
      }
    );

    let res = {};
    try {
      // Perform a GET request to /results
      await ax.get("/results", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      res = error.response;
    }
    // Check that the server returned a 401 status code
    expect(res.status).to.equal(401);
    expect(res.data).to.equal("Unauthorized");

    return Promise.resolve();
  });

  it("GET /results should return 401 for an admin user in a different tenant", async () => {
    // Create an admin JWT for another tenant
    const token = jwt.sign(
      {
        userId: 22,
        authorization: {
          "12fake34": {
            tenantId: "12fake34", // Different tenant
            roles: ["admin"],
          },
        },
      },
      Test.rsaPrivateKey,
      {
        algorithm: "RS256",
      }
    );

    let res = {};
    try {
      // Perform a GET request to /results
      await ax.get("/results", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      res = error.response;
    }
    // Check that the server returned a 401 status code
    expect(res.status).to.equal(401);
    expect(res.data).to.equal("Unauthorized");

    return Promise.resolve();
  });

  it("GET /results should return 401 if no authorization header is present", async () => {
    let res = {};
    try {
      // Perform a GET request to /results
      await ax.get("/results");
    } catch (error) {
      res = error.response;
    }
    // Check that the server returned a 401 status code
    expect(res.status).to.equal(401);
    expect(res.data).to.equal("Unauthorized");
    return Promise.resolve();
  });

  it("GET /results should return 401 if the JWT is expired", async () => {
    // Create an expired JWT signed with the RSA private key
    const token = jwt.sign(
      {
        userId: 22,
        authorization: {
          "5xbpy4nz": {
            tenantId: "5xbpy4nz",
            roles: ["admin"],
          },
        },
      },
      Test.rsaPrivateKey,
      {
        algorithm: "RS256",
        expiresIn: -1,
      }
    );

    let res = {};
    try {
      // Perform a GET request to /results
      await ax.get("/results", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      res = error.response;
    }
    // Check that the server returned a 401 status code
    expect(res.status).to.equal(401);
    expect(res.data).to.equal("Unauthorized");
    return Promise.resolve();
  });

  it("GET /results should return 401 if the JWT is signed by a different private key", async () => {
    // Create a JWT signed with a different RSA private key
    const token = jwt.sign(
      {
        userId: 3,
        authorization: {
          "5xbpy4nz": {
            tenantId: "5xbpy4nz",
            roles: ["admin"],
          },
        },
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

    let res = {};
    try {
      // Perform a GET request to /results
      await ax.get("/results", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      res = error.response;
    }
    // Check that the server returned a 401 status code
    expect(res.status).to.equal(401);
    expect(res.data).to.equal("Unauthorized");
    return Promise.resolve();
  });
});
