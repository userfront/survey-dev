require("dotenv").config({ path: "./api/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());

const rsaPublicKey = process.env.RSA_PUBLIC_KEY.replace("\\n", "\n");

// Set up sequelize
const { sequelize } = require("./api/database/instance.js");

app.all("/survey-responses", function (req, res, next) {
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
  } catch (err) {
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
  } catch (err) {
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
