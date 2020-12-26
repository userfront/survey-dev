const fs = require("fs");
const path = require("path");
const modelsDirectory = path.join(__dirname, "../models");
const { Sequelize } = require("sequelize");
const db = {};

if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_NAME = process.env.RDS_DB_NAME;
  process.env.DATABASE_USERNAME = process.env.RDS_USERNAME;
  process.env.DATABASE_PASSWORD = process.env.RDS_PASSWORD;
  process.env.DATABASE_HOST = process.env.RDS_HOSTNAME;
  process.env.DATABASE_PORT = process.env.RDS_PORT;
  process.env.DATABASE_DIALECT = "postgres";
  console.log("RDS", process.env.RDS_DB_NAME, process.env.RDS_USERNAME);
}

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 5432,
  }
);

db.modelNames = [];

fs.readdirSync(modelsDirectory)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(modelsDirectory, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
    db.modelNames.push(model.name);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
