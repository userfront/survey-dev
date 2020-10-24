## Start with Create React App

https://create-react-app.dev/docs/getting-started/

```
npx create-react-app survey-dev
cd survey-dev
npm start
```

![Create React App](https://res.cloudinary.com/component/image/upload/v1603496124/permanent/survey-tutorial-0.png)

## Add survey-react

https://surveyjs.io/Documentation/Library

```
npm install survey-react --save
```

Add questions.js

Update App.js

```js
// App.js
import * as Survey from "survey-react";
import "survey-react/modern.css";
import questions from "./questions.js";

Survey.StylesManager.applyTheme("modern");
const survey = new Survey.Model(questions);
survey.onComplete.add(function (result) {
  console.log(result.data);
});

function App() {
  return (
    <div className="App">
      <Survey.Survey model={survey} />
    </div>
  );
}

export default App;
```

## Add backend server

```
npm install express --save
touch server.js
```

```js
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
```

Add to package.json:

```json
"proxy": "http://localhost:5000"
```

Now in one terminal, you can run `npm run serve` to start the frontend on localhost:3000. In another terminal you can run `node server.js` to start the backend on localhost:5000.

With both of these running, visiting http://localhost:3000 should show the survey, and visiting http://localhost:5000/ping should return "pong".

## Add a database connection

Will be using Sequelize to connect to a Postgres database instance.

https://sequelize.org/master/manual/getting-started.html

```
npm install sequelize pg pg-hstore lodash dotenv --save
```

### Create the database

Download https://www.postgresql.org/download/

Install `psql`

```
psql
CREATE DATABASE survey_dev;
CREATE DATABASE survey_test;
\q
```

### Setup the development and test environments

```
mkdir api
mkdir api/database
touch api/database/config.js
```

```js
// api/database/config.js
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
    dialect: "postgres",
    username: "postgres",
    password: null,
    host: "localhost",
    port: 5432,
  },
  test: {
    database: "survey_test",
    dialect: "postgres",
    username: "postgres",
    password: null,
    host: "localhost",
    port: 5432,
  },
};
```

### Use this information to create DB connection instance

```
touch api/database/instance.js
```

```js
// api/database/instance.js
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host || "localhost",
    port: config.port || 5432,
  }
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
```

### Import the database instance into server.js

```js
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

// Set up sequelize
const { sequelize } = require("./api/database/instance.js");

app.get("/ping", async (req, res) => {
  // Check the DB connection
  await sequelize.authenticate();
  return res.send("pong");
});

app.get("/", async (req, res) => {
  return res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`✅  Backend listening on port ${port}`)
);

module.exports = server;
```

Now when we start the server:

```
node server.js
```

And visit http://localhost:5000/ping

The terminal should note the DB connection:

```
Executing (default): SELECT 1+1 AS result
```

### Add a table to the DB

We will use Sequelize-CLI to add a table using migrations.

https://sequelize.org/master/manual/migrations.html

```
npm install sequelize-cli --save-dev
```

Add folders for the migrations and models

```
mkdir api/database/migrations
mkdir api/models
touch .sequelizerc
```

```js
// .sequelizerc
const path = require("path");

module.exports = {
  config: path.resolve("api", "database/config.js"),
  "models-path": path.resolve("api", "models"),
  "migrations-path": path.resolve("api", "database/migrations"),
};
```

Now we can create a migration that we will use to generate the database table

```
npx sequelize migration:create --name create-response
```

Update the file that was created in `api/database/migrations/...`

```js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Responses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("Responses", ["user_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Responses");
  },
};
```

Run the migration

```
npx sequelize db:migrate
```

This created our DB table. If we wanted to undo this step, we could run `npx sequelize db:migrate:undo` (if you do this, be sure to re-run the initial migration again).

### Create DB model

```
touch api/models/response.js
```

```js
// api/models/response.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Response",
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "user_id",
      },
      data: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {}
  );
};
```

Update our sequelize instance to automatically read any files in the /models directory

```js
// api/database/instance.js
const fs = require("fs");
const path = require("path");
const modelsDirectory = path.join(__dirname, "../models");
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host || "localhost",
    port: config.port || 5432,
  }
);

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
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
```

### Read from DB in a route

```js
// Update server.js
app.get("/ping", async (req, res) => {
  const responses = await sequelize.models.Response.findAll();
  console.log(responses);
  return res.send("pong");
});
```
