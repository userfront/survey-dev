process.env.DATABASE_NAME = "survey_test";
process.env.RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ8PxdNGVwO0Wl4irLuYyrYvNCHMO2Zc
Tb8cVka/B0xrWTAX/G+7l1fA7aEWX7/OJsAXkD4aEp3e/d3rNFH/KacCAwEAAQ==
-----END PUBLIC KEY-----`;

const server = require("../../server.js");

after(async () => {
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve();
    });
  });
});
