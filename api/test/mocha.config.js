process.env.DATABASE_NAME = "survey_test";
const server = require("../../server.js");

after(async () => {
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve();
    });
  });
});
