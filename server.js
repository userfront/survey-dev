const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const jwt = require("jsonwebtoken");

const rsaPublicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMb8XUyMG7SkLKImwog14vQKFV
Z5/PPTrFOffcmSxj3VKn6N0COfLfA/e6Yy4VgXPYrRAHMEFwDieuZkoS+wuRztOY
IoAmS7F8wft1WRHJo56OqDtcWyCcttWMB0Ol7QrWM/z69+hmRUJJg2IU33tcLOPk
/UonF7GA4iarEPQeBQIDAQAB
-----END PUBLIC KEY-----`;

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

// Set up sequelize
const { sequelize } = require("./api/database/instance.js");

app.all("/survey-responses", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/survey-responses", async (req, res) => {
  const surveyResponses = await sequelize.models.SurveyResponse.findAll();
  return res.send({ surveyResponses });
});

app.post("/survey-responses", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const verified = jwt.verify(token, rsaPublicKey, { algorithms: ["RS256"] });
  const surveyResponse = await sequelize.models.SurveyResponse.create({
    userId: verified.userId,
    data: req.body.data,
  });
  return res.send(surveyResponse);
});

app.get("/", async (req, res) => {
  return res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
