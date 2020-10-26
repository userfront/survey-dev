const request = require("request");
const chai = require("chai");
const expect = chai.expect;

const server = require("../../server.js");
// const uri = server.info.uri + "/";
const req = request.defaults({
  json: true,
  // uri,
});

describe("Test test", () => {
  it("should do something", async () => {
    const { res, body } = await req.get("http://localhost:3000/");
    console.log("hi", res);
    expect(true).to.equal(false);
    return Promise.resolve();
  });
});
