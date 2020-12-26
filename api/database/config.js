module.exports = {
  production: {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
  },
  development: {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
  },
  migration: {
    database: "ebdb",
    username: "postgres",
    // password: "",
    host: "aa1dixnkdt7lfxi.cbets7yhwixt.us-east-1.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
  },
};
