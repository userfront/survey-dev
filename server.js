require("dotenv").config({ path: "./api/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());

const rsaPublicKey =
  process.env.NODE_ENV === "production"
    ? Buffer.from(process.env.RSA_PUBLIC_KEY, "base64").toString()
    : process.env.RSA_PUBLIC_KEY.replace("\\n", "\n");

// Set up sequelize
const { sequelize } = require("./api/database/instance.js");

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/survey-responses", async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verified = jwt.verify(token, rsaPublicKey, {
      algorithm: "RS256",
    });
    const surveyResponses = await sequelize.models.SurveyResponse.findAll({
      where: {
        userId: verified.userId,
      },
    });
    return res.send({ surveyResponses });
  } catch (error) {
    console.log("errC", error);
    return res.status(401).send("Unauthorized");
  }
});

app.post("/survey-responses", async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verified = jwt.verify(token, rsaPublicKey, {
      algorithm: "RS256",
    });
    const surveyResponse = await sequelize.models.SurveyResponse.create({
      userId: verified.userId,
      data: req.body.data,
    });
    return res.send(surveyResponse);
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
});

app.get("/results", async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verified = jwt.verify(token, rsaPublicKey, {
      algorithm: "RS256",
    });
    if (
      !verified.authorization ||
      !verified.authorization["5xbpy4nz"] ||
      verified.authorization["5xbpy4nz"].roles.indexOf("admin") < 0
    ) {
      throw new Error("Unauthorized");
    }
    return res.send({
      results: {
        data: [],
      },
    });
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
});

app.get("/status", async (req, res) => {
  return res.send("ok");
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
