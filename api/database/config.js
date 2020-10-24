module.exports = {
  production: {
    database: process.env.CLOUD_SQL_DATABASE,
    username: process.env.CLOUD_SQL_USERNAME,
    password: process.env.CLOUD_SQL_PASSWORD,
    host: process.env.CLOUD_SQL_HOST,
    dialect: "postgres",
  },
  development: {
    database: "survey_dev",
    username: "postgres",
    password: null,
    host: "localhost",
    dialect: "postgres",
    port: 5431,
  },
  test: {
    database: "survey_test",
    username: "postgres",
    password: null,
    host: "localhost",
    dialect: "postgres",
    port: 5431,
  },
};
